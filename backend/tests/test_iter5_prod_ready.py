# Iteration 5: production readiness — auth gating, role access, persistence across backend restart
import os
import subprocess
import time
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API = f"{BASE_URL}/api"


def _wait_up(timeout=60):
    end = time.time() + timeout
    while time.time() < end:
        try:
            if requests.get(f"{API}/leaderboard", timeout=5).status_code == 200:
                return True
        except requests.RequestException:
            pass
        time.sleep(2)
    return False


# Public endpoints
class TestPublic:
    def test_leaderboard_public(self):
        r = requests.get(f"{API}/leaderboard", timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert isinstance(d["items"], list) and isinstance(d["games"], list)
        assert d["total"] == len(d["items"])

    def test_content_public(self):
        r = requests.get(f"{API}/content", timeout=20)
        assert r.status_code == 200
        assert "data" in r.json()

    def test_clerk_config(self):
        r = requests.get(f"{API}/clerk/config", timeout=20)
        assert r.status_code == 200
        d = r.json()
        assert d["enabled"] is True
        assert d["publishable_key"].startswith("pk_")


# Auth gating + role matrix
class TestRoles:
    def test_no_token_401(self):
        for path in ["/me", "/users", "/admin/games", "/admin/history"]:
            assert requests.get(f"{API}{path}", timeout=20).status_code == 401, path

    def test_bad_token_401(self):
        r = requests.get(f"{API}/me", headers={"Authorization": "Bearer abc.def.ghi"}, timeout=20)
        assert r.status_code == 401

    def test_me_roles(self, H):
        for role in ["super_admin", "admin", "member"]:
            r = requests.get(f"{API}/me", headers=H[role], timeout=20)
            assert r.status_code == 200
            assert r.json()["role"] == role

    def test_users_super_only(self, H):
        assert requests.get(f"{API}/users", headers=H["super_admin"], timeout=20).status_code == 200
        assert requests.get(f"{API}/users", headers=H["admin"], timeout=20).status_code == 403
        assert requests.get(f"{API}/users", headers=H["member"], timeout=20).status_code == 403

    def test_member_denied_admin(self, H):
        assert requests.get(f"{API}/admin/games", headers=H["member"], timeout=20).status_code == 403
        assert requests.get(f"{API}/admin/games", headers=H["admin"], timeout=20).status_code == 200


# Persistence: create game+participant+score, restart backend, verify, cleanup
class TestPersistence:
    def test_persist_across_restart(self, H):
        h = H["admin"]
        tag = uuid.uuid4().hex[:6]
        gid = pid = None
        try:
            g = requests.post(f"{API}/admin/games", json={"name": f"TEST Persist {tag}", "max_score": 50},
                              headers=h, timeout=20)
            assert g.status_code == 201, g.text
            gid = g.json()["id"]
            p = requests.post(f"{API}/admin/participants",
                              json={"name": f"TEST Persist P {tag}", "college": "TEST College"}, headers=h, timeout=20)
            assert p.status_code == 201, p.text
            pid = p.json()["id"]
            s = requests.put(f"{API}/admin/participants/{pid}/scores/{gid}", json={"score": 42}, headers=h, timeout=20)
            assert s.status_code == 200 and s.json()["total"] == 42

            subprocess.run(["sudo", "supervisorctl", "restart", "backend"], check=True, timeout=90)
            time.sleep(3)
            assert _wait_up(), "backend did not come back"

            lb = requests.get(f"{API}/leaderboard", timeout=20).json()
            assert any(x["id"] == gid and x["max_score"] == 50 for x in lb["games"])
            row = next((x for x in lb["items"] if x["id"] == pid), None)
            assert row is not None
            assert row["scores"].get(gid) == 42 and row["total"] == 42
        finally:
            if pid:
                requests.delete(f"{API}/admin/participants/{pid}", headers=h, timeout=20)
            if gid:
                requests.delete(f"{API}/admin/games/{gid}", headers=h, timeout=20)
            lb = requests.get(f"{API}/leaderboard", timeout=20).json()
            assert not any(x["id"] == pid for x in lb["items"])
            assert not any(x["id"] == gid for x in lb["games"])
