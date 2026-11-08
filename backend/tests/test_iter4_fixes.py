# Iteration 4 retest: leaderboard max_score, game rename/max_score 409 guards, score 404 for missing participant, regression
import os
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
A = f"{BASE_URL}/api"
CREATED_P, CREATED_G = [], []


def u():
    return "".join(c for c in uuid.uuid4().hex if c.isalpha())[:6] or "abc"


@pytest.fixture(scope="module", autouse=True)
def cleanup(H):
    yield
    for pid in CREATED_P:
        requests.delete(f"{A}/admin/participants/{pid}", headers=H["admin"])
    for gid in CREATED_G:
        requests.delete(f"{A}/admin/games/{gid}", headers=H["admin"])


def mk_game(H, name=None, mx=100):
    r = requests.post(f"{A}/admin/games", json={"name": name or f"TEST Game {u()}", "max_score": mx}, headers=H["admin"])
    assert r.status_code == 201, r.text
    CREATED_G.append(r.json()["id"])
    return r.json()


def mk_p(H, name=None, **kw):
    r = requests.post(f"{A}/admin/participants", json={"name": name or f"TEST P {u()}", **kw}, headers=H["admin"])
    assert r.status_code == 201, r.text
    CREATED_P.append(r.json()["id"])
    return r.json()


def score(H, pid, gid, s):
    return requests.put(f"{A}/admin/participants/{pid}/scores/{gid}", json={"score": s}, headers=H["admin"])


def test_leaderboard_games_have_max_score(H):
    g = mk_game(H, mx=37)
    games = requests.get(f"{A}/leaderboard").json()["games"]
    got = next(x for x in games if x["id"] == g["id"])
    assert got["max_score"] == 37 and got["name"] == g["name"]
    assert all("max_score" in x for x in games)


def test_rename_to_existing_case_insensitive_409(H):
    g1, g2 = mk_game(H), mk_game(H)
    r = requests.put(f"{A}/admin/games/{g2['id']}", json={"name": g1["name"].lower(), "max_score": 100}, headers=H["admin"])
    assert r.status_code == 409, r.text
    r = requests.put(f"{A}/admin/games/{g2['id']}", json={"name": g1["name"].upper(), "max_score": 100}, headers=H["admin"])
    assert r.status_code == 409
    # renaming to own name with different case is fine
    r = requests.put(f"{A}/admin/games/{g2['id']}", json={"name": g2["name"].upper(), "max_score": 100}, headers=H["admin"])
    assert r.status_code == 200 and r.json()["name"] == g2["name"].upper()


def test_lower_max_below_existing_score_409(H):
    g, p = mk_game(H, mx=100), mk_p(H)
    assert score(H, p["id"], g["id"], 80).status_code == 200
    r = requests.put(f"{A}/admin/games/{g['id']}", json={"name": g["name"], "max_score": 50}, headers=H["admin"])
    assert r.status_code == 409, r.text
    assert requests.get(f"{A}/admin/games", headers=H["admin"]).json() and \
        next(x for x in requests.get(f"{A}/admin/games", headers=H["admin"]).json() if x["id"] == g["id"])["max_score"] == 100
    # equal to existing score OK, above OK, raise OK
    for mx in [80, 90, 500]:
        r = requests.put(f"{A}/admin/games/{g['id']}", json={"name": g["name"], "max_score": mx}, headers=H["admin"])
        assert r.status_code == 200 and r.json()["max_score"] == mx, (mx, r.text)
    lb = requests.get(f"{A}/leaderboard").json()
    assert next(x for x in lb["games"] if x["id"] == g["id"])["max_score"] == 500


def test_score_missing_participant_404(H):
    g = mk_game(H)
    r = score(H, "does-not-exist", g["id"], 5)
    assert r.status_code == 404 and "Participant" in r.json()["detail"]
    p = mk_p(H)
    r = score(H, p["id"], "no-game", 5)
    assert r.status_code == 404


def test_score_above_max_422(H):
    g, p = mk_game(H, mx=10), mk_p(H)
    assert score(H, p["id"], g["id"], 11).status_code == 422
    assert score(H, p["id"], g["id"], 10).status_code == 200


def test_regression_flow(H):
    g1, g2, p = mk_game(H, mx=100), mk_game(H, mx=50), mk_p(H, college="TEST College")
    assert score(H, p["id"], g1["id"], 40).json()["total"] == 40
    assert score(H, p["id"], g2["id"], 25).json()["total"] == 65
    it = next(i for i in requests.get(f"{A}/leaderboard").json()["items"] if i["id"] == p["id"])
    assert it["total"] == 65 and it["scores"][g1["id"]] == 40


def test_rbac(H):
    assert requests.get(f"{A}/admin/games").status_code == 401
    assert requests.put(f"{A}/admin/games/x", json={"name": "TEST a", "max_score": 5}).status_code == 401
    assert requests.get(f"{A}/admin/games", headers=H["member"]).status_code == 403
    assert requests.put(f"{A}/admin/participants/x/scores/y", json={"score": 1}, headers=H["member"]).status_code == 403
