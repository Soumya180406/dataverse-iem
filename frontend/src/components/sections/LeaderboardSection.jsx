import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/Reveal";
import { Podium, RankTable, LiveBadge, showPodium } from "@/components/leaderboard/LeaderboardView";
import { useLeaderboard } from "@/hooks/useLeaderboard";

export const LeaderboardSection = () => {
  const { items, games, updated_at } = useLeaderboard();
  const pod = showPodium(items);
  return (
    <section id="leaderboard" className="relative py-20 md:py-32" data-testid="leaderboard-section">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="leaderboard" eyebrow="// Live Leaderboard" title={<>Earn DataPoints. <span className="gradient-text">Top the board.</span></>} />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <LiveBadge updatedAt={updated_at} />
          <Link to="/leaderboard" className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-300 hover:text-cyan-200" data-testid="leaderboard-view-all">
            Full leaderboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {pod && <div className="mb-6"><Podium items={items} /></div>}
        <RankTable games={games} items={items.slice(pod ? 3 : 0, 10)} empty={items.length ? "More ranks will appear here." : undefined} />
      </div>
    </section>
  );
};
