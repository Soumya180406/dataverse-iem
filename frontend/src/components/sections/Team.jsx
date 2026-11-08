import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { TEAM } from "@/data/content";

const initials = (role) => role.split(" ").map((w) => w[0]).join("").slice(0, 2);

export const Team = () => (
  <section id="team" className="relative py-20 md:py-32" data-testid="team-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="team" eyebrow="// Organising Team" title="The minds behind the verse" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {TEAM.map((m, i) => (
          <Reveal key={i} delay={(i % 4) * 0.08}>
            <div className="glass group rounded-3xl p-5 text-center transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-cyan-400/40 sm:p-6" data-testid={`team-member-${i}`}>
              <div className={`mx-auto grid h-20 w-20 place-items-center rounded-2xl border font-mono text-xl font-bold ${m.group === "Faculty" ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"}`}>
                {initials(m.role)}
              </div>
              <p className="mt-4 font-display font-semibold text-white">{m.name}</p>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
