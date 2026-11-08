# Iteration 5: unit test of first-sign-in role logic (_clerk_profile / ADMIN_EMAIL match), Clerk HTTP mocked
import os
import sys
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import admin_api  # noqa: E402


def _resp(emails, primary="e1"):
    r = mock.Mock()
    r.raise_for_status = lambda: None
    r.json = lambda: {"primary_email_address_id": primary, "first_name": "Soumyajit", "last_name": "B",
                      "email_addresses": emails}
    return r


def _run(emails, admin_env="soumyajitbanerjee2006@gmail.com"):
    with mock.patch.dict(os.environ, {"ADMIN_EMAIL": admin_env, "CLERK_SECRET_KEY": "sk_x"}), \
            mock.patch.object(admin_api.requests, "get", return_value=_resp(emails)):
        return admin_api._clerk_profile("user_x")


def test_admin_email_is_set():
    assert os.environ.get("ADMIN_EMAIL", "").strip().lower() == "soumyajitbanerjee2006@gmail.com"


def test_verified_owner_is_admin():
    p = _run([{"id": "e1", "email_address": "SoumyajitBanerjee2006@gmail.com", "verification": {"status": "verified"}}])
    assert p["is_admin"] is True and p["name"] == "Soumyajit B"


def test_unverified_owner_not_admin():
    p = _run([{"id": "e1", "email_address": "soumyajitbanerjee2006@gmail.com", "verification": {"status": "unverified"}}])
    assert p["is_admin"] is False


def test_other_email_not_admin():
    p = _run([{"id": "e1", "email_address": "someone@gmail.com", "verification": {"status": "verified"}}])
    assert p["is_admin"] is False


def test_admin_env_with_spaces_and_list():
    p = _run([{"id": "e1", "email_address": "soumyajitbanerjee2006@gmail.com", "verification": {"status": "verified"}}],
             admin_env=" other@x.com , soumyajitbanerjee2006@gmail.com ")
    assert p["is_admin"] is True
