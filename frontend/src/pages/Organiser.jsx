import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { PasscodeGate } from "@/components/organiser/PasscodeGate";
import { AddParticipants } from "@/components/organiser/AddParticipants";
import { ScoreManager } from "@/components/organiser/ScoreManager";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { api } from "@/lib/api";

export default function Organiser() {
  const [key, setKey] = useState(() => sessionStorage.getItem("dv_org_key") || "");
  const { items, total, refresh } = useLeaderboard(8000);
  useEffect(() => { document.title = "Organiser | DataVerse 2K27"; }, []);

  const lock = useCallback(() => { sessionStorage.removeItem("dv_org_key"); setKey(""); }, []);
  const call = useCallback(async (method, url, data) => {
    try {
      return await api.request({ method, url, data, headers: { "X-Organiser-Key": key } });
    } catch (err) {
      if (err?.response?.status === 401) lock();
      throw err;
    }
  }, [key, lock]);

  return (
    <div className="min-h-screen bg-[#05070E]" data-testid="organiser-page">
      <Navbar />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">// Organiser console</p>
              <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Leaderboard scores</h1>
            </div>
            {key && (
              <div className="flex items-center gap-3">
                <Link to="/leaderboard" className="text-sm text-cyan-300 hover:text-cyan-200" data-testid="organiser-view-public">View public board</Link>
                <button onClick={lock} className="btn-ghost !px-4 !py-2 text-sm" data-testid="organiser-lock-btn"><LogOut className="h-4 w-4" /> Lock</button>
              </div>
            )}
          </div>
          {!key ? <PasscodeGate onUnlock={setKey} /> : (
            <div className="mt-8 space-y-8">
              <AddParticipants call={call} onDone={refresh} />
              <p className="text-sm text-slate-400" data-testid="organiser-total">{total} participants on the board</p>
              <ScoreManager items={items} call={call} onDone={refresh} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
