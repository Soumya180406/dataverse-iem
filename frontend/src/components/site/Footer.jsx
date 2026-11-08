import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/site/Navbar";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/data/content";

export const Footer = () => (
  <footer className="no-print relative border-t border-purple-500/20 bg-[#04060c]">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <Logo />
        <p className="mt-4 max-w-xs text-sm text-slate-400">Compete • Analyze • Conquer. 13–14 February 2027 at IEM Kolkata.</p>
      </div>
      <div className="text-sm text-slate-400">
        <p className="eyebrow mb-3">Organised by</p>
        <p>Department of Basic Science and Humanities, Institute of Engineering & Management, Kolkata</p>
        <p className="mt-2">in association with Society for Data Science, IEM Student Chapter</p>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <p className="eyebrow">Quick links</p>
        <Link to="/register" className="text-slate-300 hover:text-cyan-300" data-testid="footer-register-link">Register</Link>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-pink-300" data-testid="footer-instagram-link">
          <Instagram className="h-4 w-4" /> {INSTAGRAM_HANDLE}
        </a>
      </div>
    </div>
    <div className="border-t border-white/5 py-5 text-center font-mono text-xs text-slate-500">© 2027 DataVerse 2K27 · IEM Kolkata</div>
  </footer>
);
