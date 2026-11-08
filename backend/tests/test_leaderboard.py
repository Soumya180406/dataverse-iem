# Leaderboard + organiser passcode API tests (iteration 2)
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
KEY = "DV27-2F1ACEA2"
H = {"X-Organiser-Key": KEY}
CREATED = []


def _uniq():
    return "".join(c for c in uuid.uuid4().hex if c.isalpha())[:6] or "abc"


def _add(name, college=""):
    r = requests.post(f"{BASE_URL}/api/leaderboard", json={"name": name, "college": college}, headers=H)
    if r.status_code == 201:
        CREATED.append(r.json()["id"])
    return r


@pytest.fixture(scope="module", autouse=True)
def cleanup():
    yield
    for pid in CREATED:
        requests.delete(f"{BASE_URL}/api/leaderboard/{pid}", headers=H)


# Public read
def test_public_get_sorted_and_ranked():
    r = requests.get(f"{BASE_URL}/api/leaderboard")
    assert r.status_code == 200
    d = r.json()
    assert set(d) >= {"items", "total", "updated_at"}
    items = d["items"]
    assert d["total"] == len(items)
    for a, b in zip(items, items[1:]):
        assert (a["points"] > b["points"]) or (a["points"] == b["points"] and a["name"] <= b["name"])
        if a["points"] == b["points"]:
            assert a["rank"] == b["rank"]
    for it in items:
        assert "_id" not in it and "key" not in it


# Auth guard: missing key (wrong key tested once via verify only, to respect rate limiter)
@pytest.mark.parametrize("method,path,body", [
    ("post", "/api/leaderboard", {"name": "TEST Nokey", "college": ""}),
    ("post", "/api/leaderboard/bulk", {"text": "TEST Nokey"}),
    ("patch", "/api/leaderboard/xyz/points", {"delta": 5}),
    ("delete", "/api/leaderboard/xyz", None),
    ("post", "/api/organiser/verify", None),
])
def test_write_requires_key(method, path, body):
    r = requests.request(method, f"{BASE_URL}{path}", json=body)
    assert r.status_code == 401


def test_verify_wrong_and_right():
    r = requests.post(f"{BASE_URL}/api/organiser/verify", headers={"X-Organiser-Key": "WRONG-KEY"})
    assert r.status_code == 401
    assert "passcode" in r.json()["detail"].lower()
    r = requests.post(f"{BASE_URL}/api/organiser/verify", headers=H)
    assert r.status_code == 200 and r.json() == {"ok": True}


def test_add_duplicate_and_validation():
    u = _uniq()
    r = _add(f"TEST Alpha {u}", "IEM Kolkata")
    assert r.status_code == 201
    p = r.json()
    assert p["points"] == 0 and p["name"] == f"TEST Alpha {u}"
    # duplicate case-insensitive
    r2 = requests.post(f"{BASE_URL}/api/leaderboard", json={"name": f"test alpha {u}", "college": "iem kolkata"}, headers=H)
    assert r2.status_code == 409
    # persisted
    ids = [i["id"] for i in requests.get(f"{BASE_URL}/api/leaderboard").json()["items"]]
    assert p["id"] in ids
    # bad names
    for bad in ["1abc", "<script>", "A", "TEST x$y"]:
        rb = requests.post(f"{BASE_URL}/api/leaderboard", json={"name": bad}, headers=H)
        assert rb.status_code == 422, bad
    rc = requests.post(f"{BASE_URL}/api/leaderboard", json={"name": "TEST Ok", "college": "<b>"}, headers=H)
    assert rc.status_code == 422


def test_bulk_add():
    u = _uniq()
    text = f"TEST Bulk One {u}\tIEM\nTEST Bulk Two {u}, UEM Kolkata\nTEST Bulk Three {u}\n\n123bad\nTEST Bulk One {u}\tiem\n"
    r = requests.post(f"{BASE_URL}/api/leaderboard/bulk", json={"text": text}, headers=H)
    assert r.status_code == 200
    d = r.json()
    assert d["added"] == 3 and d["skipped_duplicates"] == 1 and d["invalid_count"] == 1
    assert "123bad" in d["invalid"][0]
    items = requests.get(f"{BASE_URL}/api/leaderboard").json()["items"]
    mine = [i for i in items if u in i["name"]]
    CREATED.extend(i["id"] for i in mine)
    assert len(mine) == 3
    two = next(i for i in mine if "Two" in i["name"])
    assert two["college"] == "UEM Kolkata"


def test_points_delta_set_floor_and_rank():
    u = _uniq()
    a = _add(f"TEST Pa {u}").json()
    b = _add(f"TEST Pb {u}").json()
    r = requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={"delta": 10}, headers=H)
    assert r.status_code == 200 and r.json()["points"] == 10
    r = requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={"delta": -25}, headers=H)
    assert r.json()["points"] == 0
    r = requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={"points": 99990}, headers=H)
    assert r.json()["points"] == 99990
    r = requests.patch(f"{BASE_URL}/api/leaderboard/{b['id']}/points", json={"points": 99990}, headers=H)
    items = requests.get(f"{BASE_URL}/api/leaderboard").json()["items"]
    ra = next(i for i in items if i["id"] == a["id"])
    rb = next(i for i in items if i["id"] == b["id"])
    assert ra["rank"] == rb["rank"]
    # invalid bodies
    assert requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={}, headers=H).status_code == 422
    assert requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={"delta": 1, "points": 2}, headers=H).status_code == 422
    assert requests.patch(f"{BASE_URL}/api/leaderboard/{a['id']}/points", json={"points": -1}, headers=H).status_code == 422
    assert requests.patch(f"{BASE_URL}/api/leaderboard/nope/points", json={"delta": 1}, headers=H).status_code == 404
    # reset to 0 so they don't sit at top
    for pid in (a["id"], b["id"]):
        requests.patch(f"{BASE_URL}/api/leaderboard/{pid}/points", json={"points": 0}, headers=H)


def test_delete():
    u = _uniq()
    p = requests.post(f"{BASE_URL}/api/leaderboard", json={"name": f"TEST Del {u}"}, headers=H).json()
    r = requests.delete(f"{BASE_URL}/api/leaderboard/{p['id']}", headers=H)
    assert r.status_code == 200 and r.json()["deleted"] == p["id"]
    assert requests.delete(f"{BASE_URL}/api/leaderboard/{p['id']}", headers=H).status_code == 404
    ids = [i["id"] for i in requests.get(f"{BASE_URL}/api/leaderboard").json()["items"]]
    assert p["id"] not in ids
