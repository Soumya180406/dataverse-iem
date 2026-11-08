import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui";
import { run } from "@/components/admin/useAdminApi";

export const UsersTab = ({ call, meId }) => {
  const [d, setD] = useState({ roles: [], users: [] });
  const load = () => run(() => call("get", "/users")).then((r) => r && setD(r.data));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const change = async (uid, role) => { if (await run(() => call("patch", `/users/${uid}/role`, { data: { role } }), "Role updated")) load(); };
  return (
    <Card title="Users & roles" testid="users-tab">
      <p className="mb-3 text-xs text-slate-400">Anyone who signs in with Google appears here as "member" with no access. Promote approved organisers to admin. Super admins can also manage users.</p>
      <div className="divide-y divide-white/5 text-sm">
        {d.users.map((u) => (
          <div key={u.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3" data-testid={`user-row-${u.user_id}`}>
            <div><p className="text-white">{u.name || u.email}{u.user_id === meId && <span className="ml-2 text-xs text-cyan-300">(you)</span>}</p><p className="text-xs text-slate-500">{u.email}</p></div>
            <select className="field !w-40 !py-2" value={u.role} onChange={(e) => change(u.user_id, e.target.value)} data-testid={`user-role-${u.user_id}`}>
              {d.roles.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
            </select>
          </div>
        ))}
      </div>
    </Card>
  );
};
