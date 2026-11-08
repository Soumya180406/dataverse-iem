import asyncio
import hmac
import logging
import os
import re
import time
import uuid
from collections import defaultdict
from contextlib import suppress
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, field_validator
from pymongo import ASCENDING, DESCENDING, IndexModel, ReturnDocument
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]
ORGANISER_PASSCODE = os.environ['ORGANISER_PASSCODE']

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

INDEXES: dict[str, list[IndexModel]] = {
    "leaderboard": [
        IndexModel([("id", ASCENDING)], name="id", unique=True),
        IndexModel([("key", ASCENDING)], name="key", unique=True),
        IndexModel([("points", DESCENDING), ("name", ASCENDING)], name="rank"),
    ],
}


async def ensure_indexes() -> None:
    for collection, models in INDEXES.items():
        for model in models:
            try:
                await db[collection].create_indexes([model])
            except Exception as exc:
                logger.error("ensure_indexes(%s.%s): %s", collection, model.document["name"], exc)


app = FastAPI(title="DataVerse 2K27 API")
api_router = APIRouter(prefix="/api")

# ---------- Organiser passcode guard ----------
_FAILS: dict[str, list[float]] = defaultdict(list)
MAX_FAILS, WINDOW = 10, 900


def _ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for", "")
    return fwd.split(",")[-1].strip() if fwd else (request.client.host if request.client else "")


def require_organiser(request: Request, x_organiser_key: str = Header(default="")) -> None:
    ip = _ip(request)
    now = time.time()
    _FAILS[ip] = [t for t in _FAILS[ip] if now - t < WINDOW]
    if len(_FAILS[ip]) >= MAX_FAILS:
        raise HTTPException(429, "Too many wrong passcodes. Try again in 15 minutes.")
    if not x_organiser_key or not hmac.compare_digest(x_organiser_key.strip(), ORGANISER_PASSCODE):
        _FAILS[ip].append(now)
        raise HTTPException(401, "Wrong organiser passcode")
    _FAILS.pop(ip, None)


# ---------- Models ----------
NAME_RE = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")


def clean(v: str) -> str:
    return " ".join((v or "").split())


class Participant(BaseModel):
    id: str
    name: str
    college: str = ""
    points: int = 0
    updated_at: str


class ParticipantIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    college: str = Field(default="", max_length=150)

    @field_validator("name")
    @classmethod
    def name_ok(cls, v: str) -> str:
        v = clean(v)
        if not NAME_RE.match(v):
            raise ValueError("name may only contain letters, spaces, dots, hyphens and apostrophes")
        return v

    @field_validator("college")
    @classmethod
    def college_ok(cls, v: str) -> str:
        v = clean(v)
        if re.search(r"[<>{}$]", v):
            raise ValueError("college contains invalid characters")
        return v


class BulkIn(BaseModel):
    text: str = Field(min_length=1, max_length=200_000)


class PointsIn(BaseModel):
    delta: Optional[int] = Field(default=None, ge=-10000, le=10000)
    points: Optional[int] = Field(default=None, ge=0, le=1_000_000)


def key_of(name: str, college: str) -> str:
    return f"{name.lower()}|{college.lower()}"


def to_model(doc: dict) -> Participant:
    return Participant(id=doc["id"], name=doc["name"], college=doc.get("college", ""),
                       points=doc.get("points", 0), updated_at=doc["updated_at"])


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def insert_participant(p: ParticipantIn) -> Optional[Participant]:
    doc = {"id": str(uuid.uuid4()), "name": p.name, "college": p.college, "points": 0,
           "key": key_of(p.name, p.college), "updated_at": now_iso()}
    res = await db.leaderboard.update_one({"key": doc["key"]}, {"$setOnInsert": doc}, upsert=True)
    return to_model(doc) if res.upserted_id else None


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "DataVerse 2K27 API"}


@api_router.get("/leaderboard")
async def leaderboard():
    docs = await db.leaderboard.find({}, {"_id": 0, "key": 0}).sort([("points", -1), ("name", 1)]) \
        .collation({"locale": "en", "strength": 2}).to_list(5000)
    items, rank, prev = [], 0, None
    for i, d in enumerate(docs):
        if d.get("points", 0) != prev:
            rank, prev = i + 1, d.get("points", 0)
        items.append({**to_model(d).model_dump(), "rank": rank})
    last = max((d["updated_at"] for d in docs), default=None)
    return {"items": items, "total": len(items), "updated_at": last}


@api_router.post("/organiser/verify")
async def verify(_: None = Depends(require_organiser)):
    return {"ok": True}


@api_router.post("/leaderboard", status_code=201)
async def add_participant(body: ParticipantIn, _: None = Depends(require_organiser)):
    p = await insert_participant(body)
    if not p:
        raise HTTPException(409, "This participant is already on the leaderboard")
    return p


@api_router.post("/leaderboard/bulk")
async def bulk_add(body: BulkIn, _: None = Depends(require_organiser)):
    lines = [ln for ln in body.text.splitlines() if ln.strip()]
    if lines and re.match(r"^\s*(full\s*)?name\b", lines[0], re.I):
        lines = lines[1:]
    if len(lines) > 3000:
        raise HTTPException(422, "Paste at most 3000 rows at a time")
    added, skipped, invalid = 0, 0, []
    for ln in lines:
        parts = [clean(x) for x in re.split(r"\t|,", ln, maxsplit=1)]
        name, college = parts[0], (parts[1] if len(parts) > 1 else "")
        try:
            p = ParticipantIn(name=name, college=college)
        except Exception:
            invalid.append(ln.strip()[:60])
            continue
        if await insert_participant(p):
            added += 1
        else:
            skipped += 1
    return {"added": added, "skipped_duplicates": skipped, "invalid": invalid[:20], "invalid_count": len(invalid)}


@api_router.patch("/leaderboard/{pid}/points")
async def update_points(pid: str, body: PointsIn, _: None = Depends(require_organiser)):
    if (body.delta is None) == (body.points is None):
        raise HTTPException(422, "Send either delta or points")
    if body.points is not None:
        update = {"$set": {"points": body.points, "updated_at": now_iso()}}
        doc = await db.leaderboard.find_one_and_update({"id": pid}, update, projection={"_id": 0},
                                                       return_document=ReturnDocument.AFTER)
    else:
        doc = await db.leaderboard.find_one_and_update(
            {"id": pid}, [{"$set": {"points": {"$max": [0, {"$add": ["$points", body.delta]}]}, "updated_at": now_iso()}}],
            projection={"_id": 0}, return_document=ReturnDocument.AFTER)
    if not doc:
        raise HTTPException(404, "Participant not found")
    return to_model(doc)


@api_router.delete("/leaderboard/{pid}")
async def remove_participant(pid: str, _: None = Depends(require_organiser)):
    if (await db.leaderboard.delete_one({"id": pid})).deleted_count == 0:
        raise HTTPException(404, "Participant not found")
    return {"deleted": pid}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    app.state.index_task = asyncio.create_task(ensure_indexes())


@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.index_task.cancel()
    with suppress(asyncio.CancelledError):
        await app.state.index_task
    client.close()
