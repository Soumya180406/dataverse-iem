import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Podium, RankTable, LiveBadge, showPodium } from "@/components/leaderboard/LeaderboardView";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export default function Leaderboard() {
  const { items, total, updated_at } = useLeaderboard();
  const [q, setQ] = useState("");
  useEffect(() => { document.title = "Live Leaderboard | DataVerse 2K27"; window.scrollTo(0, 0); }, []);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((p) => `${p.name} ${p.college}`.toLowerCase().includes(s)) : items;
  }, [items, q]);

  return (
    <div className="min-h-screen bg-[#05070E]" data-testid="leaderboard-page">
      <Navbar />
      <main className="px-4 pb-20 pt-28 sm:px-6 md:pt-36 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow">// Live Leaderboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">DataPoints <span className="gradient-text">standings</span></h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <LiveBadge updatedAt={updated_at} />
            <span className="text-sm text-slate-400" data-testid="leaderboard-total">{total} participants</span>
          </div>
          {showPodium(items) && !q && <div className="mt-8"><Podium items={items} /></div>}
          <div className="relative mt-8">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
            <input className="field !pl-10" placeholder="Find your name or college" value={q} onChange={(e) => setQ(e.target.value)} data-testid="leaderboard-search" />
          </div>
          <div className="mt-4"><RankTable items={shown} empty={q ? "No one matches that search." : undefined} /></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
