import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { CONTACT, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/data/content";

export const Contact = () => (
  <section id="contact" className="relative py-20 md:py-32" data-testid="contact-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="contact" eyebrow="// Contact & Social" title="Ping the verse" />
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="space-y-4 lg:col-span-5">
          <div className="glass space-y-5 rounded-3xl p-7">
            <p className="flex gap-3 text-slate-300"><Mail className="h-5 w-5 shrink-0 text-cyan-300" /> <span data-testid="contact-email">{CONTACT.email}</span></p>
            {CONTACT.phones.map((p, i) => (
              <p key={i} className="flex gap-3 text-slate-300"><Phone className="h-5 w-5 shrink-0 text-purple-300" /> <span data-testid={`contact-phone-${i}`}>{p}</span></p>
            ))}
            <p className="flex gap-3 text-slate-300"><MapPin className="h-5 w-5 shrink-0 text-amber-300" /> {CONTACT.address}</p>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" data-testid="contact-instagram-card"
            className="group relative block overflow-hidden rounded-3xl border border-pink-400/30 bg-gradient-to-br from-fuchsia-600/30 via-purple-700/30 to-amber-500/20 p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(217,70,239,0.3)]">
            <Instagram className="h-9 w-9 text-white" />
            <p className="mt-4 font-display text-2xl font-bold text-white">{INSTAGRAM_HANDLE}</p>
            <p className="mt-1 text-sm text-slate-200">Follow for announcements, results and behind-the-scenes.</p>
            <span className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950">Follow on Instagram</span>
          </a>
        </Reveal>
        <Reveal delay={0.1} className="overflow-hidden rounded-3xl border border-purple-500/20 lg:col-span-7">
          <iframe title="IEM Kolkata map" src={CONTACT.map} loading="lazy" className="h-[360px] w-full grayscale invert-[0.9] hue-rotate-180 lg:h-full lg:min-h-[460px]" data-testid="contact-map" />
        </Reveal>
      </div>
    </div>
  </section>
);
