import asyncio
import logging
import os
from contextlib import suppress
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING, DESCENDING, IndexModel
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

try:
    from backend.clerk_auth import clerk_router
    from backend import admin_api
except ModuleNotFoundError:
    from clerk_auth import clerk_router
    import admin_api

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]
admin_api.init(db)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

INDEXES: dict[str, list[IndexModel]] = {
    "participants": [IndexModel([("id", ASCENDING)], name="id", unique=True),
                     IndexModel([("key", ASCENDING)], name="key", unique=True),
                     IndexModel([("total", DESCENDING), ("name", ASCENDING)], name="rank")],
    "games": [IndexModel([("id", ASCENDING)], name="id", unique=True)],
    "score_history": [IndexModel([("at", DESCENDING)], name="at_desc")],
    "users": [IndexModel([("user_id", ASCENDING)], name="user_id", unique=True)],
    "site_content": [IndexModel([("key", ASCENDING)], name="key", unique=True)],
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


@api_router.get("/")
async def root():
    return {"message": "DataVerse 2K27 API"}


app.include_router(api_router)
app.include_router(admin_api.router)
app.include_router(clerk_router)

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
    for old, new in admin_api.RETIRED_ROLES.items():
        await db.users.update_many({"role": old}, {"$set": {"role": new}})


@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.index_task.cancel()
    with suppress(asyncio.CancelledError):
        await app.state.index_task
    client.close()
