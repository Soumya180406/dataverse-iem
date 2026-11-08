import { Handshake } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SPONSORS, CONTACT } from "@/data/content";

export const Sponsors = () => (
  <section id="sponsors" className="relative overflow-hidden py-20 md:py-32" data-testid="sponsors-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="sponsors" eyebrow="// Sponsors & Partners" title="Powered by people who believe in data" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {SPONSORS.logos.map((l, i) => (
          <Reveal key={l.src} delay={i * 0.06}>
            <div className="group flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]" data-testid={`partner-logo-${i}`}>
              <img src={l.src} alt={l.name} title={l.name} loading="lazy" className="max-h-[6.5rem] max-w-full object-contain" />
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {SPONSORS.partners.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.1} className="glass rounded-3xl p-7 transition-[border-color,box-shadow] duration-300 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-300">{p.role}</p>
            <p className="mt-3 font-display text-xl font-semibold text-white" data-testid={`partner-${i}`}>{p.name}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {SPONSORS.slots.map((s, i) => (
          <div key={s} className="grid h-28 place-items-center rounded-2xl border border-dashed border-slate-700 text-center transition-[border-color] duration-300 hover:border-cyan-400/50" data-testid={`sponsor-slot-${i}`}>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">{s}</p>
              <p className="mt-1 text-sm text-slate-400">[Your logo here]</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-600/15 to-cyan-500/10 p-7 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Handshake className="h-8 w-8 text-cyan-300" />
          <p className="text-slate-200">Want to sponsor DataVerse 2K27? Reach the team at <span className="text-cyan-300">{CONTACT.email}</span></p>
        </div>
      </div>
    </div>
  </section>
);
