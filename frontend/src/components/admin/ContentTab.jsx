import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card, btnPlain, btnDanger } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";
import { useSite } from "@/context/SiteContent";

const LABELS = { registration_form_url: "Registration Google Form link", contact: "Contact details", fee_note: "Fee note", prize_pool: "Prize pool",
  tiers: "Registration fees", events: "Events", schedule: "Schedule", rules: "Rules", faqs: "FAQs", team: "Team names" };
const FIXED = ["tiers", "events", "faculty"];
const blank = (s) => (typeof s === "string" ? "" : typeof s === "number" ? 0 : Array.isArray(s) ? [] : Object.fromEntries(Object.entries(s).map(([k, v]) => [k, blank(v)])));

const Field = ({ label, value, onChange, path }) => {
  const id = `content-${path.join("-")}`;
  if (Array.isArray(value)) {
    const fixed = FIXED.includes(path[path.length - 1]);
    return (
      <div className="space-y-2 rounded-xl border border-white/5 p-3">
        <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
        {value.map((v, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1"><Field label={`${label} ${i + 1}`} value={v} path={[...path, i]} onChange={(nv) => onChange(value.map((x, j) => (j === i ? nv : x)))} /></div>
            {!fixed && <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className={`${btnDanger} self-start`} aria-label="Remove" data-testid={`${id}-remove-${i}`}><Trash2 className="h-3.5 w-3.5" /></button>}
          </div>
        ))}
        {!fixed && <button type="button" onClick={() => onChange([...value, value.length ? blank(value[0]) : ""])} className={btnPlain} data-testid={`${id}-add`}><Plus className="h-3.5 w-3.5" /> Add</button>}
      </div>
    );
  }
  if (value && typeof value === "object") {
    return <div className="grid gap-2 md:grid-cols-2">{Object.entries(value).map(([k, v]) => (
      <div key={k} className={typeof v === "object" || (typeof v === "string" && v.length > 60) ? "md:col-span-2" : ""}>
        <Field label={k.replace(/_/g, " ")} value={v} path={[...path, k]} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      </div>))}</div>;
  }
  const long = typeof value === "string" && value.length > 60;
  const Tag = long ? "textarea" : "input";
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-500">{label}</span>
      <Tag className={`field !py-2 ${long ? "min-h-[70px]" : ""}`} type={typeof value === "number" ? "number" : "text"} value={value}
        onChange={(e) => onChange(typeof value === "number" ? Number(e.target.value) : e.target.value)} data-testid={id} />
    </label>
  );
};

export const ContentTab = ({ call }) => {
  const { editable, reload } = useSite();
  const [data, setData] = useState(editable);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    if (await run(() => call("put", "/admin/content", { data: { data } }), "Website updated")) await reload();
    setBusy(false);
  };
  return (
    <div className="space-y-4" data-testid="content-tab">
      <div className="sticky top-16 z-10 flex items-center justify-between rounded-2xl border border-cyan-400/30 bg-[#05070E]/95 p-3 backdrop-blur">
        <p className="text-sm text-slate-300">Edit the website text, then save. Changes go live immediately.</p>
        <button onClick={save} disabled={busy} className="btn-neon !px-5 !py-2 text-sm" data-testid="content-save-btn">{busy && <Loader2 className="h-4 w-4 animate-spin" />} Save changes</button>
      </div>
      {Object.keys(LABELS).map((k) => (
        <Card key={k} title={LABELS[k]} testid={`content-section-${k}`}>
          <Field label={LABELS[k]} value={data[k]} path={[k]} onChange={(v) => setData({ ...data, [k]: v })} />
        </Card>
      ))}
    </div>
  );
};
