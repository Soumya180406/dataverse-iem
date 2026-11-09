import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { NAV, REGISTRATION_FORM_URL } from "@/data/content";

export const Logo = () => (
  <Link to="/" className="group flex items-center gap-2" data-testid="nav-logo">
    <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/40 bg-cyan-400/10 font-mono text-sm font-bold text-cyan-300 transition-[box-shadow] duration-300 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]">
      DV
    </span>
    <span className="whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-white">
      DataVerse <span className="text-amber-300">2K27</span>
    </span>
  </Link>
);

export const useSectionNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (id) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", `/#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };
};

export const Navbar = () => {
  const go = useSectionNav();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${scrolled ? "border-b border-purple-500/20 bg-[#05070E]/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20">
        <Logo />
        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => go(n.id)} data-testid={`nav-link-${n.id}`}
              className="rounded-full px-2 py-2 text-sm text-slate-300 transition-colors duration-200 hover:bg-white/5 hover:text-cyan-300 xl:px-3">
              {n.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a href={REGISTRATION_FORM_URL} target="_blank" rel="noopener noreferrer" className="btn-neon !px-5 !py-2 text-sm" data-testid="nav-register-btn">Register</a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-slate-200 lg:hidden" data-testid="nav-mobile-menu-btn" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="border-purple-500/20 bg-[#070a14]/95 backdrop-blur-xl">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-10 flex flex-col gap-1">
                {NAV.map((n) => (
                  <button key={n.id} data-testid={`mobile-nav-${n.id}`} onClick={() => { setOpen(false); setTimeout(() => go(n.id), 250); }}
                    className="rounded-xl px-4 py-3 text-left font-display text-lg text-slate-200 hover:bg-white/5 hover:text-cyan-300">
                    {n.label}
                  </button>
                ))}
                <button onClick={() => { setOpen(false); setTimeout(() => go("contact"), 250); }} className="rounded-xl px-4 py-3 text-left font-display text-lg text-slate-200" data-testid="mobile-nav-contact">Contact</button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};
