# Seeds/cleans TEST data for iteration-4 UI test. usage: python ui_seed_iter4.py seed|scores|clean
import json, os, sys, requests
from pathlib import Path
sys.path.insert(0, os.path.dirname(__file__))
from conftest import mint, USERS  # noqa
from dotenv import load_dotenv
load_dotenv("/app/frontend/.env")
A = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") + "/api"
F = Path("/tmp/iter4_seed.json")
H = {"Authorization": f"Bearer {mint(USERS['admin'])}"}
cmd = sys.argv[1]
if cmd == "seed":
    g = requests.post(f"{A}/admin/games", json={"name": "TEST UI Game", "max_score": 10}, headers=H).json()
    ps = [requests.post(f"{A}/admin/participants", json={"name": f"TEST UI P{i}"}, headers=H).json() for i in range(1, 5)]
    F.write_text(json.dumps({"g": g["id"], "p": [p["id"] for p in ps]}))
    print(F.read_text())
elif cmd == "scores":
    d = json.loads(F.read_text())
    for pid, s in zip(d["p"], [9, 7, 5]):
        print(requests.put(f"{A}/admin/participants/{pid}/scores/{d['g']}", json={"score": s}, headers=H).status_code)
elif cmd == "zero":
    d = json.loads(F.read_text())
    for pid in d["p"]:
        requests.put(f"{A}/admin/participants/{pid}/scores/{d['g']}", json={"score": 0}, headers=H)
    print("zeroed")
elif cmd == "clean":
    d = json.loads(F.read_text())
    for pid in d["p"]:
        print(requests.delete(f"{A}/admin/participants/{pid}", headers=H).status_code)
    print(requests.delete(f"{A}/admin/games/{d['g']}", headers=H).status_code)
