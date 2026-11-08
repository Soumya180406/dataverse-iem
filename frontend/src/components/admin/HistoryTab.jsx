import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";

const LABEL = {
  score_set: (h) => `${h.participant_name} · ${h.game_name}: ${h.old ?? "–"} → ${h.new}`,
  reset_all: (h) => `Reset all scores (${h.count} participants)`,
  participant_add: (h) => `Added ${h.participant_name}`,
  participant_bulk_add: (h) => `Bulk added ${h.count} participants`,
  participant_edit: (h) => `Edited ${h.participant_name}`,
  participant_delete: (h) => `Deleted ${h.participant_name} (had ${h.old} pts)`,
  game_add: (h) => `Added game ${h.game_name}`,
  game_edit: (h) => `Edited game ${h.game_name}`,
  game_delete: (h) => `Deleted game ${h.game_name}`,
  content_edit: () => "Updated website content",
};

export const HistoryTab = ({ call, version }) => {
  const [rows, setRows] = useState([]);
  useEffect(() => { run(() => call("get", "/admin/history")).then((r) => r && setRows(r.data)); }, [call, version]);
  return (
    <Card title="Change history" testid="history-tab">
      <div className="divide-y divide-white/5 text-sm">
        {rows.map((h) => (
          <div key={h.id} className="flex flex-wrap justify-between gap-2 py-2.5" data-testid={`history-row-${h.id}`}>
            <span className="text-slate-200">{(LABEL[h.action] || (() => h.action))(h)}</span>
            <span className="text-xs text-slate-500">{h.admin_name} · {new Date(h.at).toLocaleString("en-IN")}</span>
          </div>
        ))}
        {!rows.length && <p className="py-6 text-center text-slate-500">No changes yet.</p>}
      </div>
    </Card>
  );
};
