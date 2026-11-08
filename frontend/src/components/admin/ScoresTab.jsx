import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Card, Confirm, btnDanger, btnPlain } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";

const Cell = ({ p, g, call, onDone }) => {
  const cur = p.scores?.[g.id];
  const [v, setV] = useState(cur ?? "");
  const save = async () => {
    if (String(v) === String(cur ?? "")) return;
    const n = Number(v);
    if (v === "" || !Number.isInteger(n) || n < 0 || n > g.max_score) {
      toast.error(`${g.name}: enter a whole number from 0 to ${g.max_score}`);
      setV(cur ?? "");
      return;
    }
    if (await run(() => call("put", `/admin/participants/${p.id}/scores/${g.id}`, { data: { score: n } }), `${p.name}: ${g.name} = ${n}`)) onDone();
    else setV(cur ?? "");
  };
  return (
    <input type="number" min={0} max={g.max_score} value={v} onChange={(e) => setV(e.target.value)} onBlur={save}
      onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
      className="w-20 rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-center font-mono text-sm text-white outline-none focus:border-cyan-400"
      data-testid={`score-input-${p.id}-${g.id}`} />
  );
};

const download = async (call, fmt) => {
  const res = await run(() => call("get", "/admin/export", { params: { fmt }, responseType: "blob" }));
  if (!res) return;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(res.data); a.download = `dataverse-scores.${fmt}`; a.click();
};

export const ScoresTab = ({ board, call, onDone }) => {
  const { games, items } = board;
  const reset = async () => { if (await run(() => call("post", "/admin/scores/reset"), "All scores reset")) onDone(); };
  return (
    <Card title="Enter scores" testid="scores-tab" right={
      <div className="flex flex-wrap gap-2">
        <button onClick={() => download(call, "csv")} className={btnPlain} data-testid="export-csv-btn"><Download className="h-4 w-4" /> CSV</button>
        <button onClick={() => download(call, "xlsx")} className={btnPlain} data-testid="export-xlsx-btn"><Download className="h-4 w-4" /> Excel</button>
        <Confirm title="Reset all scores?" text="Every participant's game scores and total go back to 0. This is recorded in history." onConfirm={reset} testid="reset-scores" action="Reset">
          <button className={btnDanger} data-testid="reset-scores-btn"><RotateCcw className="h-4 w-4" /> Reset scores</button>
        </Confirm>
      </div>}>
      <p className="mb-3 text-xs text-slate-400">Type a score and press Enter or click away to save. Totals and ranks update automatically.</p>
      {!games.length || !items.length ? <p className="py-8 text-center text-slate-500" data-testid="scores-empty">Add games and participants first.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="scores-table">
            <thead><tr className="text-left font-mono text-xs uppercase text-slate-500">
              <th className="p-2">#</th><th className="p-2">Name</th>
              {games.map((g) => <th key={g.id} className="p-2 text-center">{g.name}<div className="normal-case text-[10px]">max {g.max_score}</div></th>)}
              <th className="p-2 text-right">Total</th>
            </tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-white/5" data-testid={`scores-row-${p.id}`}>
                  <td className="p-2 font-mono text-amber-300">{p.rank}</td>
                  <td className="p-2 text-white">{p.name}<div className="text-xs text-slate-500">{p.college}</div></td>
                  {games.map((g) => <td key={g.id} className="p-2 text-center"><Cell key={`${p.id}-${g.id}-${p.scores?.[g.id]}`} p={p} g={g} call={call} onDone={onDone} /></td>)}
                  <td className="p-2 text-right font-mono text-lg font-bold text-cyan-300" data-testid={`scores-total-${p.id}`}>{p.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};
