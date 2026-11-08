import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { SCHEDULE } from "@/data/content";

const THEME = {
  blue: { panel: "border-sky-400/40 shadow-[0_0_40px_rgba(56,189,248,0.15)]", pill: "bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_0_18px_rgba(56,189,248,0.45)]", line: "border-sky-400/40", dot: "bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.9)]", icon: "text-sky-300", label: "text-sky-300" },
  pink: { panel: "border-pink-400/40 shadow-[0_0_40px_rgba(236,72,153,0.15)]", pill: "bg-gradient-to-br from-fuchsia-700 to-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.45)]", line: "border-pink-400/40", dot: "bg-pink-300 shadow-[0_0_10px_rgba(249,168,212,0.9)]", icon: "text-pink-300", label: "text-pink-300" },
};

const DayPanel = ({ id, day }) => {
  const t = THEME[day.theme];
  return (
    <div className={`rounded-3xl border bg-[#070a16]/90 p-5 sm:p-7 ${t.panel}`} data-testid={`schedule-${id}`}>
      <p className={`font-mono text-xs uppercase tracking-[0.3em] ${t.label}`}>{day.label}</p>
      <h3 className="mt-1 font-display text-2xl font-bold text-white">{day.date}</h3>
      <ol className="mt-6 space-y-3">
        {day.items.map((it, i) => (
          <li key={i} className={`flex items-center gap-3 border-b pb-3 last:border-b-0 sm:gap-5 ${t.line}`} data-testid={`schedule-${id}-item-${i}`}>
            <div className={`w-[92px] shrink-0 rounded-xl px-2 py-2 text-center font-mono text-xs font-bold leading-tight text-white sm:w-[112px] sm:text-sm ${t.pill}`}>
              {it.start}<br />– {it.end}
            </div>
            <span className={`hidden h-2.5 w-2.5 shrink-0 rounded-full sm:block ${t.dot}`} />
            <it.icon className={`h-7 w-7 shrink-0 ${t.icon}`} strokeWidth={1.5} />
            <div className="min-w-0">
              <p className="font-display text-base font-bold uppercase tracking-wide text-white sm:text-lg">{it.title}</p>
              {it.sub && <p className="text-xs uppercase tracking-wide text-slate-400 sm:text-sm">{it.sub}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const Schedule = () => (
  <section id="schedule" className="relative py-20 md:py-32" data-testid="schedule-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="schedule" eyebrow="// Event Schedule" title="Two days, minute by minute" />
      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries(SCHEDULE).map(([k, d], i) => (
          <Reveal key={k} delay={i * 0.1}><DayPanel id={k} day={d} /></Reveal>
        ))}
      </div>
      <p className="mt-8 flex items-center justify-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.25em] text-sky-300" data-testid="schedule-tagline">
        <Star className="h-4 w-4 fill-sky-300" /> Learn. Compete. Win. Repeat.
      </p>
    </div>
  </section>
);
