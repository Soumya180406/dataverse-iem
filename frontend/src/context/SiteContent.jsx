import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { api } from "@/lib/api";
import * as D from "@/data/content";

const strip = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => keys.includes(k)));

export const defaultEditable = () => ({
  registration_form_url: D.REGISTRATION_FORM_URL,
  contact: strip(D.CONTACT, ["email", "phones", "address"]),
  fee_note: D.FEE_NOTE,
  prize_pool: D.PRIZES.pool,
  tiers: D.TIERS.map((t) => strip(t, ["label", "fee", "note", "perks"])),
  events: D.EVENTS.map((e) => strip(e, ["name", "tag", "blurb"])),
  schedule: Object.fromEntries(Object.entries(D.SCHEDULE).map(([k, d]) => [k, { date: d.date, items: d.items.map((i) => ({ start: i.start, end: i.end, title: i.title, sub: i.sub || "" })) }])),
  rules: D.RULES,
  faqs: D.FAQS,
  team: { faculty: D.TEAM.faculty.map((f) => ({ name: f.name })), students: D.TEAM.students },
});

const byIndex = (base, ov) => base.map((b, i) => ({ ...b, ...((ov || [])[i] || {}) }));

const build = (ov) => {
  const e = { ...defaultEditable(), ...ov };
  const icons = Object.fromEntries(Object.values(D.SCHEDULE).flatMap((d) => d.items.map((i) => [i.title.toLowerCase(), i.icon])));
  return {
    editable: e,
    REGISTRATION_FORM_URL: e.registration_form_url,
    CONTACT: { ...D.CONTACT, ...e.contact },
    FEE_NOTE: e.fee_note,
    PRIZES: { ...D.PRIZES, pool: e.prize_pool },
    TIERS: byIndex(D.TIERS, e.tiers).map((t) => ({ ...t, fee: Number(t.fee) || t.fee })),
    EVENTS: byIndex(D.EVENTS, e.events),
    SCHEDULE: Object.fromEntries(Object.entries(D.SCHEDULE).map(([k, d]) => [k, { ...d, date: e.schedule?.[k]?.date || d.date,
      items: (e.schedule?.[k]?.items || d.items).map((i, n) => ({ ...i, icon: icons[i.title?.toLowerCase()] || d.items[n]?.icon || Star })) }])),
    RULES: e.rules,
    FAQS: e.faqs,
    TEAM: { faculty: byIndex(D.TEAM.faculty, e.team?.faculty), students: e.team?.students || D.TEAM.students },
  };
};

const Ctx = createContext(build({}));

export const SiteContentProvider = ({ children }) => {
  const [ov, setOv] = useState({});
  const reload = useCallback(() => api.get("/content").then((r) => setOv(r.data.data || {})).catch(() => {}), []);
  useEffect(() => { reload(); }, [reload]);
  const value = useMemo(() => ({ ...build(ov), reload }), [ov, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSite = () => useContext(Ctx);
