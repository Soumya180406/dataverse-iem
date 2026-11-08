import { Lightbulb, Presentation, Map, Gamepad2, GraduationCap, Gavel } from "lucide-react";

export const INSTAGRAM_URL = "https://www.instagram.com/dataverse.2k27/";
export const INSTAGRAM_HANDLE = "@dataverse.2k27";
export const REGISTRATION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdaK1MhtGwMgZxZ3ZYYsYs5ijW1JKD9i_-S2DoxlgmmVPEqgw/viewform?usp=publish-editor";

export const NAV = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "schedule", label: "Schedule" },
  { id: "rules", label: "Rules" },
  { id: "sponsors", label: "Sponsors" },
  { id: "team", label: "Team" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
];

export const EVENTS = [
  { slug: "ideaforge", name: "Ideaforge", icon: Lightbulb, accent: "cyan", tag: "Idea Pitching",
    blurb: "Pitch a data-driven solution to a real-world problem. Frame it, model it and defend it in front of the jury." },
  { slug: "poster", name: "Poster Presentation", icon: Presentation, accent: "purple", tag: "Research",
    blurb: "Turn your research, analysis or project into one powerful poster and walk the judges through your findings." },
  { slug: "treasure", name: "Data Treasure Hunt", icon: Map, accent: "gold", tag: "Puzzle Trail",
    blurb: "Crack clues hidden in datasets, charts and code across the campus. Fastest analyst to the final clue wins." },
  { slug: "games", name: "Games Carnival", icon: Gamepad2, accent: "cyan", tag: "Fun Zone",
    blurb: "A burst of logic, probability and speed games. Play, compete and collect points through the carnival." },
  { slug: "workshops", name: "Workshops", icon: GraduationCap, accent: "purple", tag: "Hands-on",
    blurb: "Hands-on sessions on data science and AI tools. Bring your laptop and leave with something you built." },
  { slug: "auction", name: "Grand Auction", icon: Gavel, accent: "gold", tag: "Strategy",
    blurb: "Bid smart with a fixed budget, build the strongest portfolio and outplay every other bidder in the room." },
];

export const TIERS = [
  { id: "single", label: "Single Event", fee: 350, count: 1, note: "Pick any one event" },
  { id: "double", label: "Double Event", fee: 399, count: 2, note: "Pick any two events" },
  { id: "central", label: "Central Registration", fee: 449, count: 6, note: "All six events, one pass", featured: true },
];

export const SCHEDULE = {
  day1: { label: "Day 01", date: "13 Feb 2027", items: [
    { time: "09:30", title: "Reporting & Check-in", place: "Registration Desk", kind: "General" },
    { time: "10:00", title: "Inauguration Ceremony", place: "[Auditorium]", kind: "General" },
    { time: "11:00", title: "Ideaforge — Round 1", place: "[Venue TBA]", kind: "Ideaforge" },
    { time: "11:30", title: "Poster Presentation", place: "[Venue TBA]", kind: "Poster Presentation" },
    { time: "14:00", title: "Workshop Session", place: "[Lab TBA]", kind: "Workshops" },
    { time: "15:30", title: "Games Carnival", place: "[Venue TBA]", kind: "Games Carnival" },
  ] },
  day2: { label: "Day 02", date: "14 Feb 2027", items: [
    { time: "10:00", title: "Data Treasure Hunt", place: "Across Campus", kind: "Data Treasure Hunt" },
    { time: "11:30", title: "Ideaforge — Finals", place: "[Venue TBA]", kind: "Ideaforge" },
    { time: "14:00", title: "Grand Auction", place: "[Venue TBA]", kind: "Grand Auction" },
    { time: "16:30", title: "Prize Distribution & Closing", place: "[Auditorium]", kind: "General" },
  ] },
};

export const RULES = [
  { title: "General", items: [
    "All registrations are individual (solo). One registration per email address.",
    "Carry a valid college ID card on both days.",
    "Report at the registration desk at least 30 minutes before your event.",
    "Decisions of the judges and organising committee are final.",
  ] },
  { title: "Registration & Payment", items: [
    "Fees: Single Event ₹350, Double Event ₹399, Central Registration (all events) ₹449.",
    "Register only through the official DataVerse 2K27 Google Form.",
    "Fill in your details exactly as on your college ID.",
    "[Refund policy — to be confirmed by the organisers]",
  ] },
  { title: "Code of Conduct", items: [
    "Respect fellow participants, volunteers, judges and campus property.",
    "Plagiarism or use of unfair means leads to immediate disqualification.",
    "Follow the event-specific instructions shared by each event coordinator.",
    "Keep the campus clean and follow all IEM Kolkata rules.",
  ] },
];

export const SPONSORS = {
  partners: [
    { name: "Institute of Engineering & Management", role: "Host Institute" },
    { name: "Department of Basic Science & Humanities", role: "Organiser" },
    { name: "Society for Data Science, IEM Student Chapter", role: "Association Partner" },
  ],
  slots: ["Title Sponsor", "Co-Sponsor", "Tech Partner", "Media Partner"],
};

export const TEAM = [
  { name: "[Faculty Name]", role: "Faculty Convener", group: "Faculty" },
  { name: "[Faculty Name]", role: "Faculty Coordinator", group: "Faculty" },
  { name: "[Student Name]", role: "Student Coordinator", group: "Core" },
  { name: "[Student Name]", role: "Technical Lead", group: "Core" },
  { name: "[Student Name]", role: "Events Lead", group: "Core" },
  { name: "[Student Name]", role: "Sponsorship & PR Lead", group: "Core" },
  { name: "[Student Name]", role: "Design & Media Lead", group: "Core" },
  { name: "[Student Name]", role: "Logistics Lead", group: "Core" },
];

export const GALLERY = [
  { src: "/images/img7.jpg", alt: "Students collaborating on laptops", span: "md:col-span-2 md:row-span-2" },
  { src: "/images/img4.jpg", alt: "Coding on a laptop at a hackathon", span: "" },
  { src: "/images/img2.jpg", alt: "Glowing data matrix", span: "" },
  { src: "/images/img9.jpg", alt: "Students working side by side", span: "md:col-span-2" },
  { src: "/images/img5.jpg", alt: "Participant typing during a coding event", span: "" },
  { src: "/images/img8.jpg", alt: "Participant at a tech workshop", span: "" },
  { src: "/images/img6.jpg", alt: "Code on screen", span: "md:col-span-2" },
];

export const FAQS = [
  { q: "When and where is DataVerse 2K27?", a: "13–14 February 2027 at Institute of Engineering & Management (IEM), Kolkata." },
  { q: "How much is the registration fee?", a: "Single Event ₹350, Double Event ₹399, and Central Registration ₹449 which covers all six events." },
  { q: "Can I register as a team?", a: "No. All registrations for DataVerse 2K27 are individual (solo)." },
  { q: "How do I register?", a: "Click 'Register' and open the official DataVerse 2K27 Google Form. Fill in your details and the events you want to take part in." },
  { q: "Where do I get updates?", a: "Follow @dataverse.2k27 on Instagram for announcements, timings and results." },
  { q: "Who can participate?", a: "Students interested in data science and technology. Carry a valid college ID on event days." },
];

export const CONTACT = {
  email: "[contact email]",
  phones: ["[Coordinator 1 — phone]", "[Coordinator 2 — phone]"],
  address: "Institute of Engineering & Management, Salt Lake, Sector V, Kolkata, West Bengal",
  map: "https://maps.google.com/maps?q=Institute%20of%20Engineering%20and%20Management%20Salt%20Lake%20Kolkata&output=embed",
};
