import json, os, sys, requests
from pathlib import Path
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")
H = {"Authorization": f"Bearer {os.environ['CLERK_SECRET_KEY']}", "User-Agent": "emergent-test"}
U = {"super_admin": "user_3LofUouIZWstGd4peYAm5Tl1UR6", "admin": "user_3LofUyfuh1QmUk4b6Y6JHm5blkk", "member": "user_3LofUwOL8kvtbzb9kRptCuUyHxI"}
out = {}
for r, uid in U.items():
    t = requests.post("https://api.clerk.com/v1/sign_in_tokens", json={"user_id": uid, "expires_in_seconds": 3600}, headers=H, timeout=20)
    t.raise_for_status()
    out[r] = t.json()["token"]
Path("/tmp/tickets.json").write_text(json.dumps(out))
print("ok", list(out))
