import { useCallback, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Show, UserButton } from "@clerk/react";
import { Loader2, ShieldAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/Navbar";
import { useAdminApi } from "@/components/admin/useAdminApi";
import { ScoresTab } from "@/components/admin/ScoresTab";
import { ParticipantsTab } from "@/components/admin/ParticipantsTab";
import { GamesTab } from "@/components/admin/GamesTab";
import { HistoryTab } from "@/components/admin/HistoryTab";
import { ContentTab } from "@/components/admin/ContentTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { api } from "@/lib/api";

const Header = ({ me }) => (
  <header className="sticky top-0 z-40 border-b border-purple-500/20 bg-[#05070E]/90 backdrop-blur-xl">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3"><Logo />{me && <span className="hidden rounded-full border border-cyan-400/40 px-2 py-0.5 font-mono text-[10px] uppercase text-cyan-300 sm:inline" data-testid="admin-role-badge">{me.role.replace("_", " ")}</span>}</div>
      <div className="flex items-center gap-4"><Link to="/leaderboard" className="hidden text-sm text-slate-400 hover:text-white sm:inline" data-testid="admin-view-leaderboard">Public leaderboard</Link><UserButton /></div>
    </div>
  </header>
);

const Denied = ({ me }) => (
  <div className="mx-auto mt-24 max-w-md px-4 text-center" data-testid="admin-access-denied">
    <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />
    <h1 className="mt-4 text-2xl font-bold text-white">Waiting for approval</h1>
    <p className="mt-2 text-slate-400">{me?.email} is not an approved organiser yet. Ask the super admin to give you admin access, then refresh.</p>
  </div>
);

const TABS = [["scores", "Scores"], ["participants", "Participants & teams"], ["games", "Games"], ["history", "History"], ["content", "Website content"]];

const Dashboard = ({ me }) => {
  const call = useAdminApi();
  const [board, setBoard] = useState({ games: [], items: [] });
  const [games, setGames] = useState([]);
  const [version, setVersion] = useState(0);
  const load = useCallback(async () => {
    const [b, g] = await Promise.all([api.get("/leaderboard"), call("get", "/admin/games")]);
    setBoard(b.data); setGames(g.data); setVersion((v) => v + 1);
  }, [call]);
  useEffect(() => { load(); }, [load]);
  const tabs = me.role === "super_admin" ? [...TABS, ["users", "Users"]] : TABS;
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8" data-testid="admin-dashboard">
      <div>
        <p className="eyebrow">// Admin console</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">Welcome, {me.name?.split(" ")[0] || "organiser"}</h1>
        <p className="mt-1 text-sm text-slate-400" data-testid="admin-summary">{board.items.length} participants · {games.length} games</p>
      </div>
      <Tabs defaultValue="scores">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1 rounded-2xl border border-slate-700 bg-slate-900/70 p-1">
          {tabs.map(([v, l]) => <TabsTrigger key={v} value={v} className="rounded-xl px-4 py-2 text-sm data-[state=active]:bg-cyan-400 data-[state=active]:text-slate-950" data-testid={`admin-tab-${v}`}>{l}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="scores" className="mt-6"><ScoresTab board={board} call={call} onDone={load} /></TabsContent>
        <TabsContent value="participants" className="mt-6"><ParticipantsTab board={board} call={call} onDone={load} /></TabsContent>
        <TabsContent value="games" className="mt-6"><GamesTab games={games} call={call} onDone={load} /></TabsContent>
        <TabsContent value="history" className="mt-6"><HistoryTab call={call} version={version} /></TabsContent>
        <TabsContent value="content" className="mt-6"><ContentTab call={call} /></TabsContent>
        {me.role === "super_admin" && <TabsContent value="users" className="mt-6"><UsersTab call={call} meId={me.user_id} /></TabsContent>}
      </Tabs>
    </main>
  );
};

const Gate = () => {
  const call = useAdminApi();
  const [me, setMe] = useState(null);
  useEffect(() => { document.title = "Admin | DataVerse 2K27"; call("get", "/me").then((r) => setMe(r.data)).catch(() => setMe({ role: "none" })); }, [call]);
  return (
    <>
      <Header me={me} />
      {!me ? <Loader2 className="mx-auto mt-24 h-8 w-8 animate-spin text-cyan-300" /> : ["admin", "super_admin"].includes(me.role) ? <Dashboard me={me} /> : <Denied me={me} />}
    </>
  );
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#05070E]">
      <Show when="signed-in"><Gate /></Show>
      <Show when="signed-out"><Navigate to="/sign-in" replace /></Show>
    </div>
  );
}
