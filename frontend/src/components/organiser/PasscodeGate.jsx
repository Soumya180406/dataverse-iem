import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { api, errMsg } from "@/lib/api";

export const PasscodeGate = ({ onUnlock }) => {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try {
      await api.post("/organiser/verify", null, { headers: { "X-Organiser-Key": code.trim() } });
      sessionStorage.setItem("dv_org_key", code.trim());
      onUnlock(code.trim());
    } catch (err) {
      toast.error(errMsg(err, "Could not verify passcode"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="glass mx-auto mt-10 max-w-md rounded-3xl p-8 text-center" data-testid="organiser-gate">
      <Lock className="mx-auto h-10 w-10 text-cyan-300" />
      <h2 className="mt-4 text-2xl font-bold text-white">Organiser access</h2>
      <p className="mt-2 text-sm text-slate-400">Enter the organiser passcode to update scores.</p>
      <input type="password" className="field mt-6 text-center font-mono" placeholder="Passcode" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="current-password" data-testid="organiser-passcode-input" />
      <button className="btn-neon mt-4 w-full" disabled={busy} data-testid="organiser-unlock-btn">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Unlock</button>
    </form>
  );
};
