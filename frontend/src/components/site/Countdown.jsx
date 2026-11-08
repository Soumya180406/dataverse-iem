import { useEffect, useState } from "react";
import { EVENT_START } from "@/lib/api";

const diff = () => {
  const ms = Math.max(0, EVENT_START.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    mins: Math.floor((ms / 60000) % 60),
    secs: Math.floor((ms / 1000) % 60),
  };
};

export const useCountdown = () => {
  const [t, setT] = useState(diff);
  useEffect(() => {
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
};

export const Countdown = () => {
  const t = useCountdown();
  const cells = [["days", "Days"], ["hours", "Hours"], ["mins", "Minutes"], ["secs", "Seconds"]];
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4" data-testid="hero-countdown">
      {cells.map(([k, label]) => (
        <div key={k} className="glass relative overflow-hidden rounded-2xl px-2 py-4 text-center sm:px-5 sm:py-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
          <div className="font-mono text-2xl font-bold text-white tabular-nums sm:text-4xl" data-testid={`countdown-${k}`}>
            {String(t[k]).padStart(2, "0")}
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 sm:text-xs">{label}</div>
        </div>
      ))}
    </div>
  );
};
