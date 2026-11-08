import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Card, Confirm, btnDanger, btnPlain } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";

const EMPTY = { name: "", college: "", kind: "solo", members: "" };

const Form = ({ init, onSave, onCancel }) => {
  const [f, setF] = useState(init);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave({ ...f, members: f.kind === "team" ? f.members.split(",").map((m) => m.trim()).filter(Boolean) : [] }); }}
      className="grid gap-3 md:grid-cols-[1fr_1fr_120px]" data-testid="participant-form">
      <input className="field" placeholder="Participant or team name" value={f.name} onChange={set("name")} maxLength={80} data-testid="participant-name-input" />
      <input className="field" placeholder="College (optional)" value={f.college} onChange={set("college")} maxLength={150} data-testid="participant-college-input" />
      <select className="field" value={f.kind} onChange={set("kind")} data-testid="participant-kind-select">
        <option value="solo">Solo</option><option value="team">Team</option>
      </select>
      {f.kind === "team" && <input className="field md:col-span-3" placeholder="Team members, separated by commas" value={f.members} onChange={set("members")} data-testid="participant-members-input" />}
      <div className="flex gap-2 md:col-span-3">
        <button className="btn-neon !px-5 !py-2 text-sm" disabled={f.name.trim().length < 2} data-testid="participant-save-btn">Save</button>
        {onCancel && <button type="button" onClick={onCancel} className={btnPlain} data-testid="participant-cancel-btn"><X className="h-4 w-4" /> Cancel</button>}
      </div>
    </form>
  );
};

const Bulk = ({ call, onDone }) => {
  const [text, setText] = useState("");
  const go = async () => {
    const r = await run(() => call("post", "/admin/participants/bulk", { data: { text } }));
    if (r) { setText(""); onDone(); run(async () => r, `Added ${r.data.added} · ${r.data.skipped_duplicates} duplicates skipped${r.data.invalid_count ? ` · ${r.data.invalid_count} invalid rows` : ""}`); }
  };
  return (
    <div className="mt-5 space-y-2">
      <p className="text-xs text-slate-400">Or paste Name and College columns from your Google Form sheet (one per line):</p>
      <textarea className="field min-h-[90px] font-mono text-xs" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Riya Sen\tIEM Kolkata"} data-testid="bulk-input" />
      <button onClick={go} disabled={!text.trim()} className={btnPlain} data-testid="bulk-add-btn"><Plus className="h-4 w-4" /> Add all</button>
    </div>
  );
};

export const ParticipantsTab = ({ board, call, onDone }) => {
  const [editing, setEditing] = useState(null);
  const create = async (body) => { if (await run(() => call("post", "/admin/participants", { data: body }), `${body.name} added`)) onDone(); };
  const update = async (id, body) => { if (await run(() => call("put", `/admin/participants/${id}`, { data: body }), "Saved")) { setEditing(null); onDone(); } };
  const remove = async (p) => { if (await run(() => call("delete", `/admin/participants/${p.id}`), `${p.name} deleted`)) onDone(); };
  return (
    <div className="space-y-6">
      <Card title="Add participant or team" testid="participants-add-card">
        <Form key={board.items.length} init={EMPTY} onSave={create} />
        <Bulk call={call} onDone={onDone} />
      </Card>
      <Card title={`All participants (${board.items.length})`} testid="participants-list">
        <div className="divide-y divide-white/5">
          {board.items.map((p) => editing === p.id ? (
            <div key={p.id} className="py-3"><Form init={{ ...p, members: (p.members || []).join(", ") }} onSave={(b) => update(p.id, b)} onCancel={() => setEditing(null)} /></div>
          ) : (
            <div key={p.id} className="flex flex-wrap items-center gap-3 py-3" data-testid={`participant-row-${p.id}`}>
              <div className="min-w-0 flex-1">
                <p className="text-white">{p.name} {p.kind === "team" && <span className="ml-1 rounded bg-purple-500/20 px-1.5 text-[10px] uppercase text-purple-200">Team</span>}</p>
                <p className="text-xs text-slate-500">{[p.college, (p.members || []).join(", ")].filter(Boolean).join(" · ")}</p>
              </div>
              <span className="font-mono text-cyan-300">{p.total} pts</span>
              <button onClick={() => setEditing(p.id)} className={btnPlain} data-testid={`participant-edit-${p.id}`}><Pencil className="h-3.5 w-3.5" /> Edit</button>
              <Confirm title={`Delete ${p.name}?`} text="They and all their scores are removed from the leaderboard." onConfirm={() => remove(p)} testid={`participant-delete-${p.id}`} action="Delete">
                <button className={btnDanger} data-testid={`participant-delete-btn-${p.id}`}><Trash2 className="h-3.5 w-3.5" /></button>
              </Confirm>
            </div>
          ))}
          {!board.items.length && <p className="py-6 text-center text-slate-500">No participants yet.</p>}
        </div>
      </Card>
    </div>
  );
};
