import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Brain, Database, Trophy } from "lucide-react";

const STATS = [["06", "Events"], ["02", "Days"], ["03", "Pass options"], ["01", "Campus"]];
const PILLARS = [
  { icon: Brain, title: "Compete", text: "Pitch, present and play against the sharpest data minds around.", c: "text-cyan-300" },
  { icon: Database, title: "Analyze", text: "Dig into datasets, clues and markets — every event rewards clear thinking.", c: "text-purple-300" },
  { icon: Trophy, title: "Conquer", text: "Win on stage, learn in workshops and leave with stories worth telling.", c: "text-amber-300" },
];

export const About = () => (
  <section id="about" className="relative py-20 md:py-32" data-testid="about-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="about" eyebrow="// About DataVerse" title={<>Where data meets <span className="gradient-text">competition</span></>}
        sub="DataVerse 2K27 is the data science and technical fest of the Department of Basic Science and Humanities, Institute of Engineering & Management, Kolkata — organised in association with the Society for Data Science, IEM Student Chapter." />
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {STATS.map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08} className="glass rounded-2xl p-6">
              <div className="font-display text-5xl font-black text-white">{n}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{l}</div>
            </Reveal>
          ))}
        </div>
        <div className="grid gap-4 lg:col-span-7">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={0.1 + i * 0.1} className="glass group flex gap-5 rounded-2xl p-6 transition-[border-color] duration-300 hover:border-cyan-400/40">
              <p.icon className={`h-8 w-8 shrink-0 ${p.c} transition-transform duration-300 group-hover:scale-110`} />
              <div>
                <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                <p className="mt-1 text-sm text-slate-400 md:text-base">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
