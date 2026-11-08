import asyncio
import csv
import io
import json
import os
import re
import uuid
from datetime import datetime, timezone
from typing import List, Literal, Optional

import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from pydantic import BaseModel, Field, field_validator
from pymongo import ReturnDocument

try:
    from backend.clerk_auth import require_user
except ModuleNotFoundError:
    from clerk_auth import require_user

router = APIRouter(prefix="/api")
db = None  # set by server.py


def init(database):
    global db
    db = database


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Roles ----------
ROLES = ["super_admin", "admin", "member"]
DEFAULT_ROLE = "member"
RETIRED_ROLES: dict[str, str] = {}
RANK = {r: len(ROLES) - i for i, r in enumerate(ROLES)}
ENV = "live" if os.environ.get("CLERK_PUBLISHABLE_KEY", "").startswith("pk_live_") else "preview"
IN_ENV = {"env": {"$in": [ENV, None]}}


def effective_role(role) -> str:
    role = RETIRED_ROLES.get(role, role)
    return role if role in ROLES else DEFAULT_ROLE


def _clerk_profile(user_id: str) -> dict:
    admins = {e.strip().lower() for e in os.environ.get("ADMIN_EMAIL", "").split(",") if e.strip()}
    r = requests.get(f"https://api.clerk.com/v1/users/{user_id}", timeout=10,
                     headers={"Authorization": f"Bearer {os.environ['CLERK_SECRET_KEY']}", "User-Agent": "emergent-app"})
    r.raise_for_status()
    d = r.json()
    pid = d.get("primary_email_address_id")
    email = next((e["email_address"] for e in d["email_addresses"] if e["id"] == pid), "")
    is_admin = any(e["email_address"].lower() in admins and (e.get("verification") or {}).get("status") == "verified"
                   for e in d["email_addresses"])
    name = " ".join(x for x in [d.get("first_name"), d.get("last_name")] if x) or email
    return {"email": email, "name": name, "is_admin": is_admin}


async def current_member(user: dict = Depends(require_user)) -> dict:
    uid = user["user_id"]
    member = await db.users.find_one({"user_id": uid}, {"_id": 0})
    if member is None or not member.get("role"):
        prof = await asyncio.to_thread(_clerk_profile, uid)
        role = "super_admin" if prof["is_admin"] else DEFAULT_ROLE
        await db.users.update_one({"user_id": uid, "role": {"$in": [None, ""]}}, {"$set": {"role": role}})
        member = await db.users.find_one_and_update(
            {"user_id": uid},
            {"$setOnInsert": {"user_id": uid, "role": role, "email": prof["email"], "name": prof["name"],
                              "created_at": now_iso()}},
            upsert=True, projection={"_id": 0}, return_document=ReturnDocument.AFTER)
    if member.get("env") != ENV:
        await db.users.update_one({"user_id": uid}, {"$set": {"env": ENV}})
    return {**member, "env": ENV, "role": effective_role(member["role"])}


def require_role(*roles: str):
    async def check(member: dict = Depends(current_member)) -> dict:
        if member["role"] not in roles:
            raise HTTPException(status_code=403, detail="Not allowed")
        return member
    return check


staff = require_role("super_admin", "admin")
super_only = require_role("super_admin")


def who(m: dict) -> dict:
    return {"admin_name": m.get("name") or m.get("email") or m["user_id"], "admin_email": m.get("email", "")}


# ---------- Models ----------
NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 .'&\-]{1,79}$")


def clean(v: str) -> str:
    return " ".join((v or "").split())


class GameIn(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    max_score: int = Field(default=100, ge=1, le=100000)

    @field_validator("name")
    @classmethod
    def ok(cls, v):
        v = clean(v)
        if not NAME_RE.match(v):
            raise ValueError("use letters, numbers, spaces and . ' & - only")
        return v


class ParticipantIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    college: str = Field(default="", max_length=150)
    kind: Literal["solo", "team"] = "solo"
    members: List[str] = Field(default_factory=list, max_length=10)

    @field_validator("name")
    @classmethod
    def name_ok(cls, v):
        v = clean(v)
        if not NAME_RE.match(v):
            raise ValueError("name may only use letters, numbers, spaces and . ' & -")
        return v

    @field_validator("college")
    @classmethod
    def college_ok(cls, v):
        v = clean(v)
        if re.search(r"[<>{}$]", v):
            raise ValueError("college contains invalid characters")
        return v

    @field_validator("members")
    @classmethod
    def members_ok(cls, v):
        out = [clean(m) for m in v if clean(m)]
        if any(len(m) > 80 or re.search(r"[<>{}$]", m) for m in out):
            raise ValueError("invalid member name")
        return out


class ScoreIn(BaseModel):
    score: int = Field(ge=0, le=100000)


class BulkIn(BaseModel):
    text: str = Field(min_length=1, max_length=200_000)


class RoleIn(BaseModel):
    role: str


class ContentIn(BaseModel):
    data: dict

    @field_validator("data")
    @classmethod
    def size_ok(cls, v):
        if len(json.dumps(v)) > 150_000:
            raise ValueError("content too large")
        url = v.get("registration_form_url")
        if url is not None and not (isinstance(url, str) and url.startswith("https://")):
            raise ValueError("registration form link must start with https://")

        def walk(x):
            if isinstance(x, str) and len(x) > 3000:
                raise ValueError("a text field is too long")
            if isinstance(x, dict):
                [walk(i) for i in x.values()]
            if isinstance(x, list):
                [walk(i) for i in x]
        walk(v)
        return v


# ---------- Helpers ----------
P_PROJ = {"_id": 0, "key": 0}


def pkey(name, college):
    return f"{name.lower()}|{college.lower()}"


async def games_list():
    return await db.games.find({}, {"_id": 0}).sort([("order", 1), ("created_at", 1)]).to_list(200)


async def ranked():
    docs = await db.participants.find({}, P_PROJ).sort([("total", -1), ("name", 1)]) \
        .collation({"locale": "en", "strength": 2}).to_list(5000)
    rank, prev = 0, None
    for i, d in enumerate(docs):
        if d["total"] != prev:
            rank, prev = i + 1, d["total"]
        d["rank"] = rank
    return docs


async def log(m, action, **extra):
    await db.score_history.insert_one({"id": str(uuid.uuid4()), "action": action, "at": now_iso(), **who(m), **extra})


async def add_participant(p: ParticipantIn):
    doc = {"id": str(uuid.uuid4()), "name": p.name, "college": p.college, "kind": p.kind, "members": p.members,
           "scores": {}, "total": 0, "key": pkey(p.name, p.college), "updated_at": now_iso()}
    res = await db.participants.update_one({"key": doc["key"]}, {"$setOnInsert": doc}, upsert=True)
    return doc if res.upserted_id else None


# ---------- Public ----------
@router.get("/leaderboard")
async def leaderboard():
    items = await ranked()
    return {"games": [{"id": g["id"], "name": g["name"]} for g in await games_list()], "items": items,
            "total": len(items), "updated_at": max((d["updated_at"] for d in items), default=None)}


@router.get("/content")
async def get_content():
    doc = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    return {"data": (doc or {}).get("data", {}), "updated_at": (doc or {}).get("updated_at")}


# ---------- Me / users ----------
@router.get("/me")
async def me(m: dict = Depends(current_member)):
    return {"user_id": m["user_id"], "role": m["role"], "email": m.get("email", ""), "name": m.get("name", "")}


@router.get("/users")
async def list_users(admin: dict = Depends(super_only)):
    people = await db.users.find(IN_ENV, {"_id": 0}).to_list(1000)
    return {"roles": [r for r in ROLES if RANK[r] <= RANK[admin["role"]]],
            "users": [{**p, "role": effective_role(p.get("role"))} for p in people]}


@router.patch("/users/{user_id}/role")
async def set_role(user_id: str, body: RoleIn, admin: dict = Depends(super_only)):
    if body.role not in ROLES or RANK[body.role] > RANK[admin["role"]]:
        raise HTTPException(status_code=403, detail="Not allowed")
    target = await db.users.find_one({"user_id": user_id, **IN_ENV}, {"_id": 0})
    if target is None:
        raise HTTPException(status_code=404, detail="Not found")
    if (effective_role(target.get("role")) == "super_admin" and body.role != "super_admin"
            and await db.users.count_documents({"role": "super_admin", **IN_ENV}) <= 1):
        raise HTTPException(status_code=409, detail="Keep at least one super admin")
    await db.users.update_one({"user_id": user_id}, {"$set": {"role": body.role}})
    return {"user_id": user_id, "role": body.role}


# ---------- Games ----------
@router.get("/admin/games")
async def admin_games(_: dict = Depends(staff)):
    return await games_list()


@router.post("/admin/games", status_code=201)
async def create_game(body: GameIn, m: dict = Depends(staff)):
    if await db.games.find_one({"name": {"$regex": f"^{re.escape(body.name)}$", "$options": "i"}}):
        raise HTTPException(409, "A game with this name already exists")
    g = {"id": str(uuid.uuid4()), "name": body.name, "max_score": body.max_score,
         "order": await db.games.count_documents({}), "created_at": now_iso()}
    await db.games.insert_one({**g})
    await log(m, "game_add", game_id=g["id"], game_name=g["name"])
    return g


@router.put("/admin/games/{gid}")
async def update_game(gid: str, body: GameIn, m: dict = Depends(staff)):
    g = await db.games.find_one_and_update({"id": gid}, {"$set": body.model_dump()}, projection={"_id": 0},
                                           return_document=ReturnDocument.AFTER)
    if not g:
        raise HTTPException(404, "Game not found")
    await log(m, "game_edit", game_id=gid, game_name=g["name"])
    return g


@router.delete("/admin/games/{gid}")
async def delete_game(gid: str, m: dict = Depends(staff)):
    g = await db.games.find_one({"id": gid}, {"_id": 0})
    if not g:
        raise HTTPException(404, "Game not found")
    await db.games.delete_one({"id": gid})
    await db.participants.update_many({f"scores.{gid}": {"$exists": True}}, [
        {"$unset": f"scores.{gid}"},
        {"$set": {"total": {"$sum": {"$map": {"input": {"$objectToArray": "$scores"}, "in": "$$this.v"}}},
                  "updated_at": now_iso()}}])
    await log(m, "game_delete", game_id=gid, game_name=g["name"])
    return {"deleted": gid}


# ---------- Participants ----------
@router.post("/admin/participants", status_code=201)
async def create_participant(body: ParticipantIn, m: dict = Depends(staff)):
    p = await add_participant(body)
    if not p:
        raise HTTPException(409, "Already on the leaderboard")
    await log(m, "participant_add", participant_id=p["id"], participant_name=p["name"])
    p.pop("key", None)
    p.pop("_id", None)
    return p


@router.post("/admin/participants/bulk")
async def bulk_participants(body: BulkIn, m: dict = Depends(staff)):
    lines = [ln for ln in body.text.splitlines() if ln.strip()]
    if lines and re.match(r"^\s*(full\s*|team\s*)?name\b", lines[0], re.I):
        lines = lines[1:]
    if len(lines) > 3000:
        raise HTTPException(422, "Paste at most 3000 rows at a time")
    added, skipped, invalid = 0, 0, []
    for ln in lines:
        parts = [clean(x) for x in re.split(r"\t|,", ln, maxsplit=1)]
        try:
            p = ParticipantIn(name=parts[0], college=parts[1] if len(parts) > 1 else "")
        except Exception:
            invalid.append(ln.strip()[:60])
            continue
        if await add_participant(p):
            added += 1
        else:
            skipped += 1
    if added:
        await log(m, "participant_bulk_add", count=added)
    return {"added": added, "skipped_duplicates": skipped, "invalid": invalid[:20], "invalid_count": len(invalid)}


@router.put("/admin/participants/{pid}")
async def update_participant(pid: str, body: ParticipantIn, m: dict = Depends(staff)):
    k = pkey(body.name, body.college)
    if await db.participants.find_one({"key": k, "id": {"$ne": pid}}):
        raise HTTPException(409, "Another participant already has this name and college")
    p = await db.participants.find_one_and_update(
        {"id": pid}, {"$set": {**body.model_dump(), "key": k, "updated_at": now_iso()}},
        projection=P_PROJ, return_document=ReturnDocument.AFTER)
    if not p:
        raise HTTPException(404, "Participant not found")
    await log(m, "participant_edit", participant_id=pid, participant_name=p["name"])
    return p


@router.delete("/admin/participants/{pid}")
async def delete_participant(pid: str, m: dict = Depends(staff)):
    p = await db.participants.find_one_and_delete({"id": pid}, projection=P_PROJ)
    if not p:
        raise HTTPException(404, "Participant not found")
    await log(m, "participant_delete", participant_id=pid, participant_name=p["name"], old=p["total"])
    return {"deleted": pid}


@router.put("/admin/participants/{pid}/scores/{gid}")
async def set_score(pid: str, gid: str, body: ScoreIn, m: dict = Depends(staff)):
    g = await db.games.find_one({"id": gid}, {"_id": 0})
    if not g:
        raise HTTPException(404, "Game not found")
    if body.score > g["max_score"]:
        raise HTTPException(422, f"Score for {g['name']} must be between 0 and {g['max_score']}")
    before = await db.participants.find_one({"id": pid}, P_PROJ)
    if not before:
        raise HTTPException(404, "Participant not found")
    old = before.get("scores", {}).get(gid)
    p = await db.participants.find_one_and_update({"id": pid}, [
        {"$set": {f"scores": {"$mergeObjects": ["$scores", {gid: body.score}]}}},
        {"$set": {"total": {"$sum": {"$map": {"input": {"$objectToArray": "$scores"}, "in": "$$this.v"}}},
                  "updated_at": now_iso()}}], projection=P_PROJ, return_document=ReturnDocument.AFTER)
    await log(m, "score_set", participant_id=pid, participant_name=p["name"], game_id=gid, game_name=g["name"],
              old=old, new=body.score)
    return p


@router.post("/admin/scores/reset")
async def reset_scores(m: dict = Depends(staff)):
    res = await db.participants.update_many({}, {"$set": {"scores": {}, "total": 0, "updated_at": now_iso()}})
    await log(m, "reset_all", count=res.modified_count)
    return {"reset": res.modified_count}


@router.get("/admin/history")
async def history(limit: int = 200, _: dict = Depends(staff)):
    return await db.score_history.find({}, {"_id": 0}).sort("at", -1).limit(min(max(limit, 1), 1000)).to_list(1000)


@router.get("/admin/export")
async def export(fmt: Literal["csv", "xlsx"] = "csv", _: dict = Depends(staff)):
    games, rows = await games_list(), await ranked()
    head = ["Rank", "Name", "College", "Type", "Members"] + [g["name"] for g in games] + ["Total"]

    def safe(v):
        return "'" + v if isinstance(v, str) and v[:1] in ("=", "+", "-", "@") else v
    data = [[r["rank"], safe(r["name"]), safe(r["college"]), r["kind"], safe(", ".join(r.get("members", [])))]
            + [r["scores"].get(g["id"], "") for g in games] + [r["total"]] for r in rows]
    if fmt == "csv":
        buf = io.StringIO()
        w = csv.writer(buf)
        w.writerow(head)
        w.writerows(data)
        body, mt = ("\ufeff" + buf.getvalue()).encode(), "text/csv"
    else:
        wb = Workbook()
        ws = wb.active
        ws.title = "Leaderboard"
        ws.append(head)
        for r in data:
            ws.append(r)
        out = io.BytesIO()
        wb.save(out)
        body, mt = out.getvalue(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    return StreamingResponse(io.BytesIO(body), media_type=mt,
                             headers={"Content-Disposition": f'attachment; filename="dataverse-scores.{fmt}"'})


# ---------- Website content ----------
@router.put("/admin/content")
async def save_content(body: ContentIn, m: dict = Depends(staff)):
    await db.site_content.update_one({"key": "main"}, {"$set": {"key": "main", "data": body.data,
                                                                "updated_at": now_iso(), **who(m)}}, upsert=True)
    await log(m, "content_edit")
    return {"ok": True}
