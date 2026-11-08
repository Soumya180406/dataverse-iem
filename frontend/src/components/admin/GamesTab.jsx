import { useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";
import { Card, Confirm, btnDanger, btnPlain } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";

const Row = ({ g, call, onDone }) => {
  const [f, setF] = useState({ name: g.name, max_score: g.max_score });
  const save = async () => { if (await run(() => call("put", `/admin/games/${g.id}`, { data: { ...f, max_score: Number(f.max_score) } }), "Game saved")) onDone(); };
  const remove = async () => { if (await run(() => call("delete", `/admin/games/${g.id}`), `${g.name} deleted`)) onDone(); };
  return (
    <div className="flex flex-wrap items-center gap-2 py-3" data-testid={`game-row-${g.id}`}>
      <input className="field !py-2 flex-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} data-testid={`game-name-${g.id}`} />
      <label className="flex items-center gap-2 text-xs text-slate-400">Max
        <input type="number" min={1} className="field !w-24 !py-2" value={f.max_score} onChange={(e) => setF({ ...f, max_score: e.target.value })} data-testid={`game-max-${g.id}`} />
      </label>
      <button onClick={save} className={btnPlain} data-testid={`game-save-${g.id}`}><Save className="h-3.5 w-3.5" /> Save</button>
      <Confirm title={`Delete ${g.name}?`} text="All scores for this game are removed and totals recalculated." onConfirm={remove} testid={`game-delete-${g.id}`} action="Delete">
        <button className={btnDanger} data-testid={`game-delete-btn-${g.id}`}><Trash2 className="h-3.5 w-3.5" /></button>
      </Confirm>
    </div>
  );
};

export const GamesTab = ({ games, call, onDone }) => {
  const [f, setF] = useState({ name: "", max_score: 100 });
  const add = async (e) => {
    e.preventDefault();
    if (await run(() => call("post", "/admin/games", { data: { name: f.name, max_score: Number(f.max_score) } }), `${f.name} added`)) { setF({ name: "", max_score: 100 }); onDone(); }
  };
  return (
    <Card title="Games" testid="games-tab">
      <form onSubmit={add} className="flex flex-wrap gap-2" data-testid="game-add-form">
        <input className="field flex-1" placeholder="New game name (e.g. Data Treasure Hunt)" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} data-testid="game-add-name" />
        <input type="number" min={1} className="field !w-28" placeholder="Max" value={f.max_score} onChange={(e) => setF({ ...f, max_score: e.target.value })} data-testid="game-add-max" />
        <button className="btn-neon !px-5 !py-2 text-sm" disabled={f.name.trim().length < 2} data-testid="game-add-btn"><Plus className="h-4 w-4" /> Add game</button>
      </form>
      <div className="mt-3 divide-y divide-white/5">
        {games.map((g) => <Row key={`${g.id}-${g.name}-${g.max_score}`} g={g} call={call} onDone={onDone} />)}
        {!games.length && <p className="py-6 text-center text-slate-500">No games yet.</p>}
      </div>
    </Card>
  );
};
