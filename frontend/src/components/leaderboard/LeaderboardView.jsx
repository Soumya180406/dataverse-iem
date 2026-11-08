import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal } from "lucide-react";

const MEDAL = {
  1: { card: "border-amber-400/70 bg-gradient-to-b from-amber-400/25 to-amber-400/5 text-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.25)]", row: "bg-amber-400/10 border-l-4 border-l-amber-400", label: "Gold" },
  2: { card: "border-slate-300/60 bg-gradient-to-b from-slate-300/20 to-slate-300/5 text-slate-200", row: "bg-slate-300/10 border-l-4 border-l-slate-300", label: "Silver" },
  3: { card: "border-orange-400/60 bg-gradient-to-b from-orange-500/20 to-orange-500/5 text-orange-300", row: "bg-orange-500/10 border-l-4 border-l-orange-400", label: "Bronze" },
};
const ORDER = ["sm:order-2 sm:min-h-48", "sm:order-1 sm:min-h-40", "sm:order-3 sm:min-h-36"];

export const showPodium = (items) => items.length >= 3 && items[2].total > 0;

export const Podium = ({ items }) => (
  <div className="grid gap-4 sm:grid-cols-3 sm:items-end" data-testid="leaderboard-podium">
    {items.slice(0, 3).map((p, i) => (
      <motion.div key={p.id} layout className={`flex flex-col justify-end rounded-3xl border p-5 ${MEDAL[p.rank]?.card || MEDAL[3].card} ${ORDER[i]}`} data-testid={`podium-${i + 1}`}>
        <div className="flex items-center gap-2">
          {p.rank === 1 ? <Crown className="h-6 w-6" /> : <Medal className="h-6 w-6" />}
          <span className="font-mono text-xs uppercase tracking-widest">{MEDAL[p.rank]?.label} · Rank {p.rank}</span>
        </div>
        <p className="mt-2 truncate font-display text-xl font-bold text-white">{p.name}</p>
        <p className="truncate text-xs text-slate-400">{p.college || "\u00a0"}</p>
        <p className="mt-2 font-mono text-2xl font-bold">{p.total} <span className="text-xs">pts</span></p>
      </motion.div>
    ))}
  </div>
);

const GameChips = ({ p, games }) => (
  <div className="mt-1.5 flex flex-wrap gap-1.5">
    {games.map((g) => (
      <span key={g.id} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-300" data-testid={`score-${p.id}-${g.id}`}>
        {g.name}: <span className="text-cyan-300">{p.scores?.[g.id] ?? "–"}</span>
      </span>
    ))}
  </div>
);

export const RankTable = ({ items, games = [], empty = "No scores yet — check back once the fest begins." }) => (
  <div className="glass overflow-hidden rounded-2xl" data-testid="leaderboard-table">
    <div className="grid grid-cols-[56px_1fr_80px] border-b border-white/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-500 sm:grid-cols-[72px_1fr_110px]">
      <span>Rank</span><span>Participant / Team · game scores</span><span className="text-right">Total</span>
    </div>
    <AnimatePresence initial={false}>
      {items.map((p) => (
        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          className={`grid grid-cols-[56px_1fr_80px] items-center border-b border-white/5 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[72px_1fr_110px] ${p.total > 0 ? MEDAL[p.rank]?.row || "" : ""}`} data-testid={`leaderboard-row-${p.id}`}>
          <span className={`font-mono text-base font-bold ${p.total <= 0 ? "text-slate-400" : p.rank === 1 ? "text-amber-300" : p.rank === 2 ? "text-slate-200" : p.rank === 3 ? "text-orange-300" : "text-slate-400"}`}>#{p.rank}</span>
          <span className="min-w-0">
            <span className="block truncate text-white">{p.name}{p.kind === "team" && <span className="ml-2 rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] uppercase text-purple-200">Team</span>}</span>
            {p.college && <span className="block truncate text-xs text-slate-500">{p.college}</span>}
            {games.length > 0 && <GameChips p={p} games={games} />}
          </span>
          <span className="text-right font-mono text-lg font-bold text-cyan-300" data-testid={`total-${p.id}`}>{p.total}</span>
        </motion.div>
      ))}
    </AnimatePresence>
    {!items.length && <p className="px-4 py-10 text-center text-slate-500" data-testid="leaderboard-empty">{empty}</p>}
  </div>
);

export const LiveBadge = ({ updatedAt }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-red-300" data-testid="leaderboard-live-badge">
    <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" /> Live
    {updatedAt && <span className="normal-case tracking-normal text-slate-400">· updated {new Date(updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>}
  </span>
);
