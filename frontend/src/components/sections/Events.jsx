import { REGISTRATION_FORM_URL } from "@/data/content";
import { ArrowUpRight, Download, FileWarning, Ruler } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { useSite } from "@/context/SiteContent";

const ACCENT = {
  cyan: "text-cyan-300 border-cyan-400/30 hover:border-cyan-300/80 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)]",
  purple: "text-purple-300 border-purple-400/30 hover:border-purple-300/80 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)]",
  gold: "text-amber-300 border-amber-400/30 hover:border-amber-300/80 hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]",
};

const EventCard = ({ e, i }) => (
  <Reveal delay={(i % 3) * 0.1} className={i === 0 || i === 5 ? "md:col-span-2 lg:col-span-1" : ""}>
    <div className={`group relative h-full overflow-hidden rounded-3xl border bg-slate-900/60 p-7 backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 ${ACCENT[e.accent]}`} data-testid={`event-card-${e.slug}`}>
      <div className="absolute right-6 top-6 font-mono text-5xl font-black text-white/5">0{i + 1}</div>
      <e.icon className="h-10 w-10" strokeWidth={1.5} />
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">{e.tag}</p>
      <h3 className="mt-2 text-2xl font-bold text-white">{e.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{e.blurb}</p>
      {e.template && (
        <div className="mt-5 rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-4" data-testid={`${e.slug}-template-box`}>
          <p className="flex items-start gap-2 text-xs text-slate-300"><FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" /> {e.templateNote || "Mandatory: use the official PPT template — maximum 6 slides, IEM & UEM logos kept."}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={e.template} download className="btn-neon !px-4 !py-2 text-xs" data-testid={`${e.slug}-template-download`}><Download className="h-4 w-4" /> {e.templateLabel || "Download PPT template"}</a>
            {e.guide && <a href={e.guide} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-4 !py-2 text-xs" data-testid={`${e.slug}-guide-download`}><Ruler className="h-4 w-4" /> Size guide (PDF)</a>}
          </div>
        </div>
      )}
      <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white" data-testid={`event-register-${e.slug}`}>
        Register for this <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  </Reveal>
);

export const Events = () => { const { EVENTS } = useSite(); return (
  <section id="events" className="relative py-20 md:py-32" data-testid="events-section">
    <div className="cyber-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="events" eyebrow="// Event Categories" title={<>Six arenas. <span className="text-amber-300">One verse.</span></>}
        sub="Central Registration unlocks all six events and the Mega Auction. Event-wise passes are available for Ideaforge and Poster Presentation." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EVENTS.map((e, i) => <EventCard key={e.slug} e={e} i={i} />)}
      </div>
    </div>
  </section>
); };
