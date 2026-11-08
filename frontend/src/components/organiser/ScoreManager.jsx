import { useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { errMsg } from "@/lib/api";

const STEPS = [-10, -5, 5, 10, 25, 50];

const RemoveBtn = ({ p, onConfirm }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="rounded-lg border border-red-500/40 p-2 text-red-300 hover:bg-red-500/10" aria-label="Remove" data-testid={`organiser-remove-${p.id}`}><Trash2 className="h-4 w-4" /></button>
    </AlertDialogTrigger>
    <AlertDialogContent className="border-slate-700 bg-[#0b1020]">
      <AlertDialogTitle>Remove {p.name}?</AlertDialogTitle>
      <AlertDialogDescription>Their DataPoints will be deleted from the leaderboard.</AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-500" data-testid="organiser-remove-confirm">Remove</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const ScoreRow = ({ p, call, onDone }) => {
  const [val, setVal] = useState("");
  const send = async (body, msg) => {
    try { await call("patch", `/leaderboard/${p.id}/points`, body); toast.success(msg); setVal(""); onDone(); }
    catch (err) { toast.error(errMsg(err)); }
  };
  const remove = async () => {
    try { await call("delete", `/leaderboard/${p.id}`); toast.success(`${p.name} removed`); onDone(); }
    catch (err) { toast.error(errMsg(err)); }
  };
  return (
    <div className="flex flex-col gap-3 border-b border-white/5 px-4 py-3 last:border-b-0 lg:flex-row lg:items-center" data-testid={`organiser-row-${p.id}`}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-white"><span className="mr-2 font-mono text-amber-300">#{p.rank}</span>{p.name}</p>
        <p className="truncate text-xs text-slate-500">{p.college}</p>
      </div>
      <span className="font-mono text-xl font-bold text-cyan-300 lg:w-20 lg:text-right" data-testid={`organiser-points-${p.id}`}>{p.points}</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {STEPS.map((s) => (
          <button key={s} onClick={() => send({ delta: s }, `${s > 0 ? "+" : ""}${s} to ${p.name}`)} data-testid={`organiser-delta-${s}-${p.id}`}
            className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs font-bold transition-colors ${s > 0 ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10" : "border-red-400/40 text-red-300 hover:bg-red-400/10"}`}>
            {s > 0 ? `+${s}` : s}
          </button>
        ))}
        <form onSubmit={(e) => { e.preventDefault(); if (val !== "") send({ points: Number(val) }, `${p.name} set to ${val}`); }} className="flex gap-1.5">
          <input type="number" min={0} className="w-20 rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 font-mono text-xs text-white outline-none focus:border-cyan-400" placeholder="Set" value={val} onChange={(e) => setVal(e.target.value)} data-testid={`organiser-set-input-${p.id}`} />
          <button className="rounded-lg bg-cyan-400 px-2.5 py-1.5 text-xs font-bold text-slate-950" data-testid={`organiser-set-btn-${p.id}`}>Set</button>
        </form>
        <RemoveBtn p={p} onConfirm={remove} />
      </div>
    </div>
  );
};

export const ScoreManager = ({ items, call, onDone }) => {
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((p) => `${p.name} ${p.college}`.toLowerCase().includes(s)) : items;
  }, [items, q]);
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
        <input className="field !pl-10" placeholder="Search participant to update" value={q} onChange={(e) => setQ(e.target.value)} data-testid="organiser-search" />
      </div>
      <div className="glass rounded-2xl" data-testid="organiser-score-list">
        {shown.map((p) => <ScoreRow key={p.id} p={p} call={call} onDone={onDone} />)}
        {!shown.length && <p className="px-4 py-10 text-center text-slate-500">No participants yet. Add them above.</p>}
      </div>
    </div>
  );
};
