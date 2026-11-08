import { ShieldCheck } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { RULES } from "@/data/content";

export const Rules = () => (
  <section id="rules" className="relative py-20 md:py-32" data-testid="rules-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="rules" eyebrow="// Rules & Guidelines" title="Play fair. Play sharp." />
      <div className="grid gap-6 md:grid-cols-2">
        {RULES.map((r, i) => (
          <Reveal key={r.title} delay={i * 0.1} className="glass rounded-3xl p-7" >
            <div data-testid={`rules-group-${i}`}>
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-cyan-300" />
                <h3 className="text-xl font-semibold text-white">{r.title}</h3>
              </div>
              <ul className="space-y-3">
                {r.items.map((t, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-300">
                    <span className="mt-1 font-mono text-xs text-amber-300">{String(j + 1).padStart(2, "0")}</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
