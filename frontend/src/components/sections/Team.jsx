import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { useSite } from "@/context/SiteContent";

const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

const GroupTitle = ({ children, color }) => (
  <p className={`mb-5 font-mono text-xs uppercase tracking-[0.3em] ${color}`}>{children}</p>
);

const FacultyCard = ({ m, i }) => (
  <Reveal delay={i * 0.1}>
    <div className="group overflow-hidden rounded-3xl border border-amber-400/30 bg-slate-900/60 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-amber-400/70" data-testid={`team-faculty-${i}`}>
      <div className="aspect-[4/5] overflow-hidden">
        <img src={m.photo} alt={`Faculty co-ordinator ${m.name}`} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
      </div>
      <p className="p-4 text-center font-display font-semibold text-white">{m.name}</p>
    </div>
  </Reveal>
);

const StudentCard = ({ m, i }) => (
  <Reveal delay={i * 0.1}>
    <div className="glass flex items-center gap-4 rounded-3xl p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-cyan-400/40" data-testid={`team-student-${i}`}>
      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 font-mono text-xl font-bold text-cyan-300">{initials(m.name)}</span>
      <p className="font-display text-lg font-semibold text-white">{m.name}</p>
    </div>
  </Reveal>
);

export const Team = () => { const { TEAM } = useSite(); return (
  <section id="team" className="relative py-20 md:py-32" data-testid="team-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="team" eyebrow="// Organising Team" title="The minds behind the verse" />
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <GroupTitle color="text-amber-300">Faculty Co-ordinators</GroupTitle>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {TEAM.faculty.map((m, i) => <FacultyCard key={i} m={m} i={i} />)}
          </div>
        </div>
        <div className="lg:col-span-5">
          <GroupTitle color="text-cyan-300">Student Leads</GroupTitle>
          <div className="grid gap-4">
            {TEAM.students.map((m, i) => <StudentCard key={i} m={m} i={i} />)}
          </div>
        </div>
      </div>
    </div>
  </section>
); };
