import { CalendarPlus } from "lucide-react";
import { CONTACT } from "@/data/content";

const details = (day) => `${day.items.map((i) => `${i.start} – ${i.end}: ${i.title}`).join("\n")}\n\nInstagram: @dataverse.2k27`;

const googleUrl = (day) => {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `DataVerse 2K27 – ${day.label}`,
    dates: `${day.cal.start}/${day.cal.end}`,
    details: details(day),
    location: CONTACT.address,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
};

const downloadIcs = (id, day) => {
  const esc = (s) => s.replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DataVerse 2K27//EN", "BEGIN:VEVENT",
    `UID:dataverse2k27-${id}@dataverse`, `DTSTAMP:${day.cal.start}`,
    `DTSTART:${day.cal.start}`, `DTEND:${day.cal.end}`,
    `SUMMARY:${esc(`DataVerse 2K27 – ${day.label}`)}`, `DESCRIPTION:${esc(details(day))}`,
    `LOCATION:${esc(CONTACT.address)}`,
    "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:DataVerse 2K27 starts in 1 hour", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = `DataVerse-2K27-${day.label.replace(/\s/g, "-")}.ics`; a.click();
  URL.revokeObjectURL(url);
};

export const AddToCalendar = ({ id, day, accent }) => (
  <div className="flex flex-wrap gap-2">
    <button type="button" onClick={() => downloadIcs(id, day)} data-testid={`add-calendar-${id}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 ${accent}`}>
      <CalendarPlus className="h-4 w-4" /> Add to calendar
    </button>
    <a href={googleUrl(day)} target="_blank" rel="noopener noreferrer" data-testid={`google-calendar-${id}`}
      className="inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:text-white">
      Google Calendar
    </a>
  </div>
);
