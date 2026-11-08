import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/site/Reveal";
import { SCHEDULE } from "@/data/content";

const Timeline = ({ items }) => (
  <ol className="relative ml-3 border-l border-purple-500/30 md:ml-6">
    {items.map((it, i) => (
      <li key={i} className="group relative mb-6 pl-8 md:pl-12" data-testid={`schedule-item-${i}`}>
        <span className="absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 border-cyan-300 bg-[#05070E] transition-[box-shadow] duration-300 group-hover:shadow-[0_0_16px_rgba(0,240,255,0.8)]" />
        <div className="glass flex flex-col gap-3 rounded-2xl p-5 transition-[border-color] duration-300 group-hover:border-cyan-400/40 md:flex-row md:items-center md:gap-8">
          <span className="font-mono text-2xl font-bold text-amber-300 md:w-24">{it.time}</span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{it.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400"><MapPin className="h-3.5 w-3.5" /> {it.place}</p>
          </div>
          <span className="w-fit rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 font-mono text-xs text-purple-200">{it.kind}</span>
        </div>
      </li>
    ))}
  </ol>
);

export const Schedule = () => (
  <section id="schedule" className="relative py-20 md:py-32" data-testid="schedule-section">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="schedule" eyebrow="// Event Schedule" title="Two days, minute by minute"
        sub="Tentative timeline — final timings and rooms will be announced on Instagram." />
      <Tabs defaultValue="day1">
        <TabsList className="mb-10 grid h-auto w-full grid-cols-2 gap-2 rounded-full border border-slate-700 bg-slate-900/70 p-1.5 sm:inline-grid sm:w-auto">
          {Object.entries(SCHEDULE).map(([k, d]) => (
            <TabsTrigger key={k} value={k} data-testid={`schedule-tab-${k}`}
              className="rounded-full px-3 py-2 font-mono text-xs uppercase tracking-wider text-slate-400 data-[state=active]:bg-cyan-400 data-[state=active]:text-slate-950 sm:px-5 sm:tracking-widest">
              {d.label}<span className="hidden sm:inline">&nbsp;· {d.date}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(SCHEDULE).map(([k, d]) => (
          <TabsContent key={k} value={k}><Timeline items={d.items} /></TabsContent>
        ))}
      </Tabs>
    </div>
  </section>
);
