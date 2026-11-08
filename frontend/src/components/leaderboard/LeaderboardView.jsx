import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal } from "lucide-react";

const PODIUM = [
  { cls: "border-amber-400/60 bg-amber-400/10 text-amber-300", h: "sm:min-h-44", order: "sm:order-2" },
  { cls: "border-slate-300/50 bg-slate-300/10 text-slate-200", h: "sm:min-h-36", order: "sm:order-1" },
  { cls: "border-orange-400/50 bg-orange-400/10 text-orange-300", h: "sm:min-h-32", order: "sm:order-3" },
];

export const showPodium = (items) => items.length >= 3 && items[2].points > 0;

export const Podium = ({ items }) => (
  <div className="grid gap-4 sm:grid-cols-3 sm:items-end" data-testid="leaderboard-podium">
    {items.slice(0, 3).map((p, i) => (
      <motion.div key={p.id} layout className={`flex flex-col justify-end rounded-3xl border p-5 ${PODIUM[i].cls} ${PODIUM[i].h} ${PODIUM[i].order}`} data-testid={`podium-${i + 1}`}>
        <div className="flex items-center gap-2">
          {i === 0 ? <Crown className="h-6 w-6" /> : <Medal className="h-6 w-6" />}
          <span className="font-mono text-xs uppercase tracking-widest">Rank {p.rank}</span>
        </div>
        <p className="mt-2 truncate font-display text-xl font-bold text-white">{p.name}</p>
        <p className="truncate text-xs text-slate-400">{p.college || "\u00a0"}</p>
        <p className="mt-2 font-mono text-2xl font-bold">{p.points} <span className="text-xs">DP</span></p>
      </motion.div>
    ))}
  </div>
);

export const RankTable = ({ items, empty = "No scores yet — check back once the fest begins." }) => (
  <div className="glass overflow-hidden rounded-2xl" data-testid="leaderboard-table">
    <div className="grid grid-cols-[56px_1fr_90px] border-b border-white/5 px-4 py-3 font-mono text-xs uppercase tracking-wider text-slate-500 sm:grid-cols-[72px_1fr_1fr_110px]">
      <span>Rank</span><span>Participant</span><span className="hidden sm:block">College</span><span className="text-right">DataPoints</span>
    </div>
    <AnimatePresence initial={false}>
      {items.map((p) => (
        <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          className="grid grid-cols-[56px_1fr_90px] items-center border-b border-white/5 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[72px_1fr_1fr_110px]" data-testid={`leaderboard-row-${p.id}`}>
          <span className={`font-mono font-bold ${p.rank <= 3 ? "text-amber-300" : "text-slate-400"}`}>#{p.rank}</span>
          <span className="min-w-0"><span className="block truncate text-white">{p.name}</span><span className="block truncate text-xs text-slate-500 sm:hidden">{p.college}</span></span>
          <span className="hidden truncate text-slate-400 sm:block">{p.college}</span>
          <span className="text-right font-mono text-base font-bold text-cyan-300">{p.points}</span>
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
