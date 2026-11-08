import { useState } from "react";
import { UserPlus, ClipboardPaste, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { errMsg } from "@/lib/api";

export const AddParticipants = ({ call, onDone }) => {
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const addOne = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await call("post", "/leaderboard", { name, college }); toast.success(`${name} added`); setName(""); setCollege(""); onDone(); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  const addBulk = async () => {
    if (!text.trim()) return toast.error("Paste at least one row");
    setBusy(true);
    try {
      const { data } = await call("post", "/leaderboard/bulk", { text });
      toast.success(`Added ${data.added} · ${data.skipped_duplicates} already on board${data.invalid_count ? ` · ${data.invalid_count} rows skipped` : ""}`);
      if (data.invalid_count) toast.warning(`Check these rows: ${data.invalid.slice(0, 3).join(" | ")}`);
      setText(""); onDone();
    } catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={addOne} className="glass space-y-3 rounded-2xl p-5" data-testid="organiser-add-form">
        <p className="flex items-center gap-2 font-semibold text-white"><UserPlus className="h-5 w-5 text-cyan-300" /> Add one participant</p>
        <input className="field" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} data-testid="organiser-name-input" />
        <input className="field" placeholder="College (optional)" value={college} onChange={(e) => setCollege(e.target.value)} maxLength={150} data-testid="organiser-college-input" />
        <button className="btn-neon !py-2.5" disabled={busy || name.trim().length < 2} data-testid="organiser-add-btn">Add</button>
      </form>
      <div className="glass space-y-3 rounded-2xl p-5" data-testid="organiser-bulk-form">
        <p className="flex items-center gap-2 font-semibold text-white"><ClipboardPaste className="h-5 w-5 text-purple-300" /> Paste from Google Form sheet</p>
        <p className="text-xs text-slate-400">Copy the Name and College columns from your responses sheet and paste here — one person per line (Name, College). Duplicates are skipped.</p>
        <textarea className="field min-h-[110px] font-mono text-xs" placeholder={"Riya Sen\tIEM Kolkata\nArjun Roy\tUEM Kolkata"} value={text} onChange={(e) => setText(e.target.value)} data-testid="organiser-bulk-input" />
        <button type="button" onClick={addBulk} className="btn-ghost !py-2.5" disabled={busy} data-testid="organiser-bulk-btn">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Add all</button>
      </div>
    </div>
  );
};
