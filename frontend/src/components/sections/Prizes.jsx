import { Gift } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { HIGHLIGHTS } from "@/data/content";
import { useSite } from "@/context/SiteContent";

export const Prizes = () => { const { PRIZES } = useSite(); return (
  <section id="prizes" className="relative py-20 md:py-32" data-testid="prizes-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="prizes" eyebrow="// Prizes & Rewards" title={<>Same data. <span className="gradient-text">Bigger possibilities.</span></>} />
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#1a1033] via-[#120c26] to-[#0b1230] p-8 lg:col-span-7 md:p-10">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-amber-400/20 blur-[100px]" />
          <p className="eyebrow !text-amber-300">Total prize pool</p>
          <p className="mt-3 font-display text-6xl font-black text-white sm:text-7xl lg:text-8xl" data-testid="prize-pool">{PRIZES.pool}</p>
          <p className="mt-2 text-slate-300">Exciting cash prizes & goodies</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {PRIZES.perks.map((p, i) => (
              <div key={p.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4" data-testid={`prize-perk-${i}`}>
                <p.icon className="h-6 w-6 shrink-0 text-amber-300" />
                <span className="text-sm text-slate-200">{p.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="glass flex flex-col justify-between rounded-3xl p-8 lg:col-span-5">
          <div>
            <Gift className="floaty h-12 w-12 text-purple-300" />
            <h3 className="mt-5 text-2xl font-bold text-white">Mystery Auction Prizes</h3>
            <p className="mt-2 text-slate-400">Bid, win & take home amazing surprises at the Mega Auction.</p>
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-cyan-300">Be a part of something bigger</p>
        </Reveal>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.label} delay={i * 0.06} className="glass flex items-center gap-3 rounded-2xl p-5">
            <h.icon className="h-6 w-6 shrink-0 text-cyan-300" />
            <span className="text-sm text-slate-200" data-testid={`highlight-${i}`}>{h.label}</span>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
); };
