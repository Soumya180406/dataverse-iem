# Clerk-based admin dashboard API tests (iteration 3): RBAC, games, participants, scores, history, export, content
import csv
import io
import os
import uuid

import pytest
import requests
from openpyxl import load_workbook

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


# ---- RBAC ----
STAFF_GETS = ["/admin/games", "/admin/history", "/admin/export?fmt=csv"]


@pytest.mark.parametrize("path", STAFF_GETS + ["/users", "/me"])
def test_no_token_401(path):
    assert requests.get(A + path).status_code == 401


@pytest.mark.parametrize("path", STAFF_GETS + ["/users"])
def test_member_403(H, path):
    assert requests.get(A + path, headers=H["member"]).status_code == 403


def test_member_cannot_write(H):
    assert requests.post(f"{A}/admin/games", json={"name": "TEST x", "max_score": 5}, headers=H["member"]).status_code == 403
    assert requests.post(f"{A}/admin/scores/reset", headers=H["member"]).status_code == 403
    assert requests.put(f"{A}/admin/content", json={"data": {}}, headers=H["member"]).status_code == 403


@pytest.mark.parametrize("role", ["admin", "super_admin"])
def test_staff_200(H, role):
    for p in STAFF_GETS:
        assert requests.get(A + p, headers=H[role]).status_code == 200, p


def test_me_roles(H):
    for r in ["super_admin", "admin", "member"]:
        d = requests.get(f"{A}/me", headers=H[r]).json()
        assert d["role"] == r


def test_users_super_only(H):
    assert requests.get(f"{A}/users", headers=H["admin"]).status_code == 403
    r = requests.get(f"{A}/users", headers=H["super_admin"])
    assert r.status_code == 200 and len(r.json()["users"]) >= 3
    assert requests.patch(f"{A}/users/user_3LofUwOL8kvtbzb9kRptCuUyHxI/role", json={"role": "member"},
                          headers=H["admin"]).status_code == 403


def test_demote_only_super_409(H):
    r = requests.patch(f"{A}/users/user_3LofUouIZWstGd4peYAm5Tl1UR6/role", json={"role": "admin"}, headers=H["super_admin"])
    assert r.status_code == 409, r.text


def test_set_role_noop_member(H):
    r = requests.patch(f"{A}/users/user_3LofUwOL8kvtbzb9kRptCuUyHxI/role", json={"role": "member"}, headers=H["super_admin"])
    assert r.status_code == 200
    assert requests.patch(f"{A}/users/user_3LofUwOL8kvtbzb9kRptCuUyHxI/role", json={"role": "god"},
                          headers=H["super_admin"]).status_code == 403


# ---- Games ----
def test_games_validation(H):
    for body in [{"name": "x", "max_score": 10}, {"name": "<b>bad</b>", "max_score": 10},
                 {"name": "TEST ok", "max_score": 0}, {"name": "TEST ok", "max_score": 100001}]:
        assert requests.post(f"{A}/admin/games", json=body, headers=H["admin"]).status_code == 422, body


def test_game_crud_and_dup(H):
    g = mk_game(H, mx=50)
    r = requests.post(f"{A}/admin/games", json={"name": g["name"].upper(), "max_score": 5}, headers=H["admin"])
    assert r.status_code == 409
    r = requests.put(f"{A}/admin/games/{g['id']}", json={"name": g["name"] + " X", "max_score": 70}, headers=H["admin"])
    assert r.status_code == 200 and r.json()["max_score"] == 70
    lst = requests.get(f"{A}/admin/games", headers=H["admin"]).json()
    assert any(x["id"] == g["id"] and x["max_score"] == 70 for x in lst)
    assert requests.put(f"{A}/admin/games/nope", json={"name": "TEST zz", "max_score": 5}, headers=H["admin"]).status_code == 404


def test_game_rename_to_existing_name(H):
    g1, g2 = mk_game(H), mk_game(H)
    r = requests.put(f"{A}/admin/games/{g2['id']}", json={"name": g1["name"], "max_score": 100}, headers=H["admin"])
    assert r.status_code == 409, f"PUT allowed duplicate game name: {r.status_code}"


# ---- Participants ----
def test_participant_team_and_dup(H):
    p = mk_p(H, college="TEST College", kind="team", members=["A One", "B Two"])
    assert p["kind"] == "team" and p["members"] == ["A One", "B Two"] and p["total"] == 0
    r = requests.post(f"{A}/admin/participants", json={"name": p["name"].lower(), "college": "test college"}, headers=H["admin"])
    assert r.status_code == 409
    q = mk_p(H, college="TEST College")
    r = requests.put(f"{A}/admin/participants/{q['id']}", json={"name": p["name"], "college": "TEST College"}, headers=H["admin"])
    assert r.status_code == 409
    r = requests.put(f"{A}/admin/participants/{q['id']}", json={"name": q["name"] + " Ed", "college": "TEST C2", "kind": "solo"}, headers=H["admin"])
    assert r.status_code == 200 and r.json()["college"] == "TEST C2"


def test_bulk(H):
    a, b = f"TEST Bulk {u()}", f"TEST Bulk {u()}"
    text = f"Name,College\n{a},TEST Col\n{b}\tTEST Col\n{a},TEST Col\n<bad>,x\n"
    r = requests.post(f"{A}/admin/participants/bulk", json={"text": text}, headers=H["admin"])
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["added"] == 2 and d["skipped_duplicates"] == 1 and d["invalid_count"] == 1
    items = requests.get(f"{A}/leaderboard").json()["items"]
    for it in items:
        if it["name"] in (a, b):
            CREATED_P.append(it["id"])
    assert sum(1 for it in items if it["name"] in (a, b)) == 2


# ---- Scores ----
def test_scores_totals_rank_and_game_delete(H):
    g1, g2 = mk_game(H, mx=100), mk_game(H, mx=10)
    p1, p2, p3 = mk_p(H), mk_p(H), mk_p(H)
    url = lambda p, g: f"{A}/admin/participants/{p['id']}/scores/{g['id']}"
    for bad in [-1, 5.5, "abc", 11]:
        assert requests.put(url(p1, g2), json={"score": bad}, headers=H["admin"]).status_code == 422, bad
    assert requests.put(url(p1, g1), json={"score": 60}, headers=H["admin"]).json()["total"] == 60
    r = requests.put(url(p1, g2), json={"score": 7}, headers=H["admin"])
    assert r.json()["total"] == 67
    requests.put(url(p2, g1), json={"score": 67}, headers=H["admin"])
    requests.put(url(p3, g1), json={"score": 5}, headers=H["admin"])
    lb = requests.get(f"{A}/leaderboard").json()
    gids = [g["id"] for g in lb["games"]]
    assert g1["id"] in gids and g2["id"] in gids
    totals = [i["total"] for i in lb["items"]]
    assert totals == sorted(totals, reverse=True)
    by = {i["id"]: i for i in lb["items"]}
    assert by[p1["id"]]["rank"] == by[p2["id"]]["rank"]
    assert by[p3["id"]]["rank"] > by[p1["id"]]["rank"]
    # history
    h = requests.get(f"{A}/admin/history", headers=H["admin"]).json()
    e = next(x for x in h if x.get("action") == "score_set" and x.get("participant_id") == p1["id"] and x.get("new") == 7)
    assert e["admin_name"] == "Test Admin" and e["admin_email"] == "dvadmin+clerk_test@example.com" and e["old"] is None and e["at"]
    # export
    c = requests.get(f"{A}/admin/export?fmt=csv", headers=H["admin"])
    assert c.status_code == 200 and "attachment" in c.headers["content-disposition"]
    rows = list(csv.reader(io.StringIO(c.content.decode("utf-8-sig"))))
    assert g1["name"] in rows[0] and g2["name"] in rows[0] and rows[0][-1] == "Total"
    x = requests.get(f"{A}/admin/export?fmt=xlsx", headers=H["admin"])
    assert x.status_code == 200
    ws = load_workbook(io.BytesIO(x.content)).active
    assert g1["name"] in [cell.value for cell in ws[1]]
    # delete game recalculates totals
    assert requests.delete(f"{A}/admin/games/{g2['id']}", headers=H["admin"]).status_code == 200
    CREATED_G.remove(g2["id"])
    by = {i["id"]: i for i in requests.get(f"{A}/leaderboard").json()["items"]}
    assert by[p1["id"]]["total"] == 60 and g2["id"] not in by[p1["id"]]["scores"]


def test_reset(H):
    g, p = mk_game(H), mk_p(H)
    requests.put(f"{A}/admin/participants/{p['id']}/scores/{g['id']}", json={"score": 9}, headers=H["admin"])
    r = requests.post(f"{A}/admin/scores/reset", headers=H["admin"])
    assert r.status_code == 200
    items = requests.get(f"{A}/leaderboard").json()["items"]
    assert all(i["total"] == 0 and i["scores"] == {} for i in items)
    h = requests.get(f"{A}/admin/history", headers=H["admin"]).json()
    assert h[0]["action"] == "reset_all"


# ---- Content ----
def test_content(H):
    bad = requests.put(f"{A}/admin/content", json={"data": {"registration_form_url": "http://x.com"}}, headers=H["admin"])
    assert bad.status_code == 422
    data = {"registration_form_url": "https://forms.gle/TEST", "contact": {"email": "test-contact@example.com"}}
    assert requests.put(f"{A}/admin/content", json={"data": data}, headers=H["admin"]).status_code == 200
    got = requests.get(f"{A}/content").json()["data"]
    assert got["registration_form_url"] == "https://forms.gle/TEST"
