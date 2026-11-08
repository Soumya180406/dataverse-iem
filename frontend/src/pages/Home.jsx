import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Events } from "@/components/sections/Events";
import { Schedule } from "@/components/sections/Schedule";
import { Rules } from "@/components/sections/Rules";
import { Sponsors } from "@/components/sections/Sponsors";
import { Team } from "@/components/sections/Team";
import { Gallery } from "@/components/sections/Gallery";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Prizes } from "@/components/sections/Prizes";
import { LeaderboardSection } from "@/components/sections/LeaderboardSection";
import { useSite } from "@/context/SiteContent";

const Marquee = () => (
  <div className="overflow-hidden border-y border-purple-500/20 bg-[#070a14] py-4">
    <div className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em] text-slate-500">
      {Array.from({ length: 2 }).flatMap((_, k) =>
        ["Ideaforge", "Poster Presentation", "Data Treasure Hunt", "Games Carnival", "Workshops", "Mega Auction", "From Data to Impact"].map((e) => (
          <span key={`${k}-${e}`} className="flex items-center gap-10">{e}<span className="text-amber-300">✦</span></span>
        )))}
    </div>
  </div>
);

const CtaBand = () => { const { REGISTRATION_FORM_URL } = useSite(); return (
  <section className="px-4 py-16 sm:px-6 lg:px-8">
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/30 bg-gradient-to-br from-[#0b1230] to-[#140a2a] p-10 md:p-16">
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-[100px]" />
      <p className="eyebrow">// Be a part of something bigger</p>
      <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">Claim your place in the verse.</h2>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/register" className="btn-gold" data-testid="cta-register-btn">Register now</Link>
        <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-testid="cta-google-form-btn">Open Google Form</a>
      </div>
    </div>
  </section>
); };

export default function Home() {
  const { hash } = useLocation();
  useEffect(() => {
    document.title = "DataVerse 2K27 | Data Science & Tech Fest at IEM Kolkata | 13–14 Feb 2027";
    if (hash) {
      setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 150);
    }
  }, [hash]);
  return (
    <div className="bg-[#05070E]" data-testid="home-page">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Events />
        <Prizes />
        <LeaderboardSection />
        <Schedule />
        <Rules />
        <Sponsors />
        <Team />
        <Gallery />
        <Faq />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
    </div>
  );
}
