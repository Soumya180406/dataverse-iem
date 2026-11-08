# Shared fixtures: Clerk session JWT minting for role test users (see /app/memory/test_credentials.md)
import os
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[1] / ".env")
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")

CLERK = "https://api.clerk.com/v1"
USERS = {
    "super_admin": "user_3LofUouIZWstGd4peYAm5Tl1UR6",
    "admin": "user_3LofUyfuh1QmUk4b6Y6JHm5blkk",
    "member": "user_3LofUwOL8kvtbzb9kRptCuUyHxI",
}


def _ch():
    return {"Authorization": f"Bearer {os.environ['CLERK_SECRET_KEY']}", "User-Agent": "emergent-test"}


def mint(uid):
    s = requests.post(f"{CLERK}/sessions", json={"user_id": uid}, headers=_ch(), timeout=20)
    s.raise_for_status()
    sid = s.json()["id"]
    t = requests.post(f"{CLERK}/sessions/{sid}/tokens", json={"expires_in_seconds": 3600}, headers=_ch(), timeout=20)
    if t.status_code >= 400:
        t = requests.post(f"{CLERK}/sessions/{sid}/tokens", headers=_ch(), timeout=20)
    t.raise_for_status()
    return t.json()["jwt"]


@pytest.fixture(scope="session")
def tokens():
    try:
        return {r: mint(u) for r, u in USERS.items()}
    except Exception as e:
        pytest.skip(f"Could not mint Clerk tokens: {e}")


@pytest.fixture(scope="session")
def H(tokens):
    return {r: {"Authorization": f"Bearer {t}"} for r, t in tokens.items()}
