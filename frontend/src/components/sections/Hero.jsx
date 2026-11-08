import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Countdown } from "@/components/site/Countdown";
import { DataNetwork } from "@/components/site/DataNetwork";
import { useSectionNav } from "@/components/site/Navbar";

const fade = (d) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });

export const Hero = () => {
  const go = useSectionNav();
  return (
    <section id="home" className="noise relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16" data-testid="hero-section">
      <img src="/images/img1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#05070E]/60 via-[#05070E]/80 to-[#05070E]" />
      <div className="cyber-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <DataNetwork />
      <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-purple-600/25 blur-[120px]" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-amber-300" data-testid="hero-badge">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" /> Registrations open
          </motion.div>
          <motion.h1 {...fade(0.1)} className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl" data-testid="hero-title">
            Data<span className="gradient-text">Verse</span>
            <br />
            <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(251,191,36,0.9)]">2K27</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className="mt-6 font-mono text-sm uppercase tracking-[0.35em] text-cyan-300 sm:text-base" data-testid="hero-tagline">
            Compete • Analyze • Conquer
          </motion.p>
          <motion.p {...fade(0.25)} className="mt-4 inline-block rounded-full bg-gradient-to-r from-purple-600/40 to-cyan-500/30 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-white" data-testid="hero-subtitle">
            A Data Science & Innovation Fest
          </motion.p>
          <motion.p {...fade(0.3)} className="mt-6 max-w-xl text-base text-slate-300 md:text-lg">
            <span className="font-display text-xl font-semibold italic text-white">“From Data to Impact”</span> — Innovate. Analyze. Transform. Two days, six events and a ₹24,000+ prize pool.
          </motion.p>
          <motion.div {...fade(0.4)} className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="glass flex items-center gap-2 rounded-full px-4 py-2"><CalendarDays className="h-4 w-4 text-cyan-300" /> 13–14 Feb 2027 · Sat–Sun</span>
            <span className="glass flex items-center gap-2 rounded-full px-4 py-2"><MapPin className="h-4 w-4 text-purple-300" /> IEM Management Building, Sector V, Kolkata</span>
          </motion.div>
          <motion.div {...fade(0.5)} className="mt-10 flex flex-wrap gap-4">
            <Link to="/register" className="btn-neon" data-testid="hero-register-btn">Register now <ArrowRight className="h-4 w-4" /></Link>
            <button onClick={() => go("events")} className="btn-ghost" data-testid="hero-events-btn">Explore events</button>
          </motion.div>
        </div>
        <motion.div {...fade(0.6)} className="self-end lg:col-span-5">
          <div className="glass rounded-3xl p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <p className="eyebrow">Countdown to launch</p>
              <span className="font-mono text-xs text-slate-500">IST 09:30</span>
            </div>
            <Countdown />
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[["₹350", "Single"], ["₹399", "Double"], ["₹449", "Central"]].map(([p, l]) => (
                <Link key={l} to="/register" className="rounded-xl border border-slate-700/70 px-2 py-3 transition-[border-color] duration-200 hover:border-amber-400/60" data-testid={`hero-fee-${l.toLowerCase()}`}>
                  <div className="font-display text-xl font-bold text-amber-300">{p}</div>
                  <div className="text-xs text-slate-400">{l}</div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
