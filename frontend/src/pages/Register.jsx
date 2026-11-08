import { useEffect } from "react";
import { ExternalLink, FileText, ListChecks, IdCard, Check, X, BadgeIndianRupee } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { useSite } from "@/context/SiteContent";

const STEPS = [
  { icon: ListChecks, text: "Choose your pass — Central (all events) or event-wise for Ideaforge / Poster Presentation." },
  { icon: FileText, text: "Open the official registration form and fill in your details." },
  { icon: IdCard, text: "Carry your college ID on event day. Updates come via Instagram." },
];

const FormButton = ({ testid, className = "btn-gold" }) => {
  const { REGISTRATION_FORM_URL } = useSite();
  return (
  <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className={className} data-testid={testid}>
    Open registration form <ExternalLink className="h-4 w-4" />
  </a>
  );
};

export default function Register() {
  const { EVENTS, TIERS, REGISTRATION_FORM_URL, FEE_NOTE } = useSite();
  useEffect(() => { document.title = "Register | DataVerse 2K27"; window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen bg-[#05070E]" data-testid="register-page">
      <Navbar />
      <main className="relative px-4 pb-20 pt-28 sm:px-6 md:pt-36 lg:px-8">
        <div className="cyber-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="eyebrow">// Registration</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Enter the <span className="gradient-text">verse</span></h1>
          <p className="mt-3 text-slate-400">Solo registration · Registration is done through our official Google Form.</p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.id} className={`glass relative rounded-2xl p-6 ${t.featured ? "border-amber-400/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : ""}`} data-testid={`fee-${t.id}`}>
                {t.featured && <span className="absolute -top-2.5 right-4 rounded-full bg-amber-400 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-950">Best value</span>}
                <p className="font-mono text-xs uppercase tracking-widest text-slate-400">{t.label}</p>
                <p className="mt-2 font-display text-4xl font-black text-white">₹{t.fee}</p>
                <p className="mt-1 text-sm text-slate-400">{t.note}</p>
                <ul className="mt-4 space-y-2">
                  {t.perks.map((p) => {
                    const no = p.startsWith("Not");
                    return (
                      <li key={p} className={`flex gap-2 text-sm ${no ? "text-slate-500" : "text-slate-300"}`}>
                        {no ? <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" /> : <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />} {p}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-4 flex items-center gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200" data-testid="fee-reimburse-note">
            <BadgeIndianRupee className="h-5 w-5 shrink-0" /> {FEE_NOTE}
          </p>

          <div className="glass mt-6 rounded-3xl p-6 sm:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <ol className="space-y-5">
                {STEPS.map((s, i) => (
                  <li key={i} className="flex gap-4 text-slate-300">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300"><s.icon className="h-5 w-5" /></span>
                    <span className="pt-2">{s.text}</span>
                  </li>
                ))}
              </ol>
              <div>
                <p className="mb-3 text-sm text-slate-400">Events you can pick from</p>
                <div className="flex flex-wrap gap-2">
                  {EVENTS.map((e) => (
                    <span key={e.slug} className="flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-100"><e.icon className="h-4 w-4" /> {e.name}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 flex flex-col items-center gap-6 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="rounded-2xl bg-white p-3" data-testid="register-form-qr"><QRCodeSVG value={REGISTRATION_FORM_URL} size={120} /></div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">Scan to register</p>
                  <p className="text-sm text-slate-400">or tap the button — the form opens in a new tab.</p>
                </div>
              </div>
              <FormButton testid="register-google-form-btn" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
