import { Lightbulb, Presentation, Map, Gamepad2, GraduationCap, Gavel, BarChart3, Users, BookOpen, Star, Trophy, Gift, Award, ClipboardCheck, Mic, Utensils } from "lucide-react";

export const INSTAGRAM_URL = "https://www.instagram.com/dataverse.2k27/";
export const INSTAGRAM_HANDLE = "@dataverse.2k27";
export const REGISTRATION_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdaK1MhtGwMgZxZ3ZYYsYs5ijW1JKD9i_-S2DoxlgmmVPEqgw/viewform?usp=publish-editor";

export const NAV = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "prizes", label: "Prizes" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "schedule", label: "Schedule" },
  { id: "rules", label: "Rules" },
  { id: "sponsors", label: "Sponsors" },
  { id: "team", label: "Team" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
];

export const EVENTS = [
  { slug: "poster", name: "Poster Presentation", icon: Presentation, accent: "purple", tag: "Showcase your research & ideas",
    template: "/downloads/Poster_Template_A1_DataVerse2K27.pptx", templateLabel: "Download poster template (A1)",
    guide: "/downloads/Poster_Size_Guide_DataVerse2K27.pdf", templateNote: "Mandatory: A1 portrait (594 × 841 mm) using the official poster template, IEM & UEM logos kept.",
    blurb: "Turn your research, analysis or project into one powerful poster and walk the judges through your findings." },
  { slug: "ideaforge", name: "Ideaforge", icon: Lightbulb, accent: "cyan", tag: "Pitch your ideas. Create impact.",
    template: "/downloads/Ideaforge_PPT_Template_DataVerse2K27.pptx",
    blurb: "Pitch a data-driven solution to a real-world problem. Frame it, model it and defend it in front of the jury." },
  { slug: "games", name: "Games Carnival", icon: Gamepad2, accent: "gold", tag: "Play, compete and earn points!",
    blurb: "A burst of logic, probability and speed games. Play, compete and collect DataPoints through the carnival." },
  { slug: "workshops", name: "Workshops", icon: GraduationCap, accent: "cyan", tag: "Learn from industry experts",
    blurb: "Hands-on sessions led by industry experts on data science and AI. Learn beyond the classroom." },
  { slug: "treasure", name: "Data Treasure Hunt", icon: Map, accent: "purple", tag: "Solve clues. Unlock surprises.",
    blurb: "Crack clues hidden in datasets, charts and code across the campus. Fastest analyst to the final clue wins." },
  { slug: "auction", name: "Mega Auction", icon: Gavel, accent: "gold", tag: "Bid, win & take home something amazing!",
    blurb: "Spend the DataPoints you earned, bid on mystery boxes and take home amazing surprises. Open to Central Registration holders." },
];

export const VENUE = {
  name: "IEM Management Building",
  line: "EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
  days: "Saturday – Sunday",
};

export const PRIZES = {
  pool: "₹24,000+",
  perks: [
    { icon: Trophy, label: "Win cash prizes" },
    { icon: Gift, label: "Exciting goodies" },
    { icon: Award, label: "Certificates for all participants" },
  ],
};

export const HIGHLIGHTS = [
  { icon: BarChart3, label: "Earn DataPoints & top the leaderboard" },
  { icon: Users, label: "Network with experts & peers" },
  { icon: BookOpen, label: "Learn beyond the classroom" },
  { icon: Star, label: "Win. Bid. Celebrate. Create memories." },
];

export const FEE_NOTE = "Registration fees will be reimbursed for IEM students.";

export const TIERS = [
  { id: "central", label: "Central Registration", fee: 449, note: "All events, one pass", featured: true,
    perks: ["Access to all events", "Workshops, competitions & games", "Eligible for Mega Auction", "Exciting goodies & certificates"] },
  { id: "single", label: "Single Event", fee: 350, note: "Ideaforge or Poster Presentation",
    perks: ["Access to the selected event only", "Participation certificate", "Not eligible for Mega Auction"] },
  { id: "double", label: "Double Event", fee: 399, note: "Ideaforge + Poster Presentation",
    perks: ["Access to both selected events", "Participation certificate", "Not eligible for Mega Auction"] },
];

export const SCHEDULE = {
  day1: { label: "Day 01", date: "Saturday, 13 Feb 2027", theme: "blue", cal: { start: "20270213T033000Z", end: "20270213T110000Z" }, items: [
    { start: "9:00 AM", end: "9:30 AM", title: "Registration", sub: "& Welcome Kit Distribution", icon: ClipboardCheck },
    { start: "9:30 AM", end: "10:00 AM", title: "Opening Ceremony", icon: Mic },
    { start: "10:00 AM", end: "11:00 AM", title: "Workshop 1", sub: "Industry Expert Session", icon: GraduationCap },
    { start: "11:10 AM", end: "1:30 PM", title: "Poster Presentation", sub: "Competition", icon: Presentation },
    { start: "1:30 PM", end: "2:30 PM", title: "Lunch Break", icon: Utensils },
    { start: "2:30 PM", end: "4:30 PM", title: "Data Treasure Hunt", icon: Map },
  ] },
  day2: { label: "Day 02", date: "Sunday, 14 Feb 2027", theme: "pink", cal: { start: "20270214T040000Z", end: "20270214T120000Z" }, items: [
    { start: "9:30 AM", end: "10:30 AM", title: "Ideaforge", sub: "Idea Pitch Competition", icon: Lightbulb },
    { start: "10:30 AM", end: "1:30 PM", title: "Games Carnival", sub: "10 Exciting Games", icon: Gamepad2 },
    { start: "1:30 PM", end: "2:30 PM", title: "Lunch Break", icon: Utensils },
    { start: "2:30 PM", end: "4:00 PM", title: "Workshop 2", sub: "Emerging Technologies Session", icon: GraduationCap },
    { start: "4:00 PM", end: "4:30 PM", title: "Prize Distribution Ceremony", icon: Trophy },
    { start: "4:30 PM", end: "5:30 PM", title: "Mega Auction", sub: "Mystery Prizes Await!", icon: Gavel },
  ] },
};

export const RULES = [
  { title: "General", items: [
    "All registrations are individual (solo). One registration per email address.",
    "Carry a valid college ID card on both days.",
    "Report at the registration desk at least 30 minutes before your event.",
    "Decisions of the judges and organising committee are final.",
  ] },
  { title: "Registration & Fees", items: [
    "Central Registration ₹449 covers all events and the Mega Auction.",
    "Event-wise registration (Ideaforge / Poster Presentation): Single ₹350, Double ₹399 — not eligible for the Mega Auction.",
    "Registration fees will be reimbursed for IEM students.",
    "Register only through the official DataVerse 2K27 Google Form.",
    "Fill in your details exactly as on your college ID.",
    "[Refund policy — to be confirmed by the organisers]",
  ] },
  { title: "Ideaforge Presentation", items: [
    "Every Ideaforge participant must use the official DataVerse 2K27 PPT template (download it from the Ideaforge event card).",
    "Maximum 6 slides: Title, Problem Statement, Proposed Solution, Data & Methodology, Impact & Feasibility, Conclusion.",
    "Do not remove or change the IEM and UEM logos, the header or the footer.",
    "Presentations that do not follow the template may be disqualified.",
  ] },
  { title: "Poster Presentation", items: [
    "Poster size: A1 portrait — 594 mm × 841 mm. Download the size guide from the Poster Presentation event card.",
    "Every participant must use the official DataVerse 2K27 poster template with the IEM and UEM logos.",
    "Sections: Introduction, Objective, Data & Methodology, Results & Analysis, Conclusion, References.",
    "Posters that do not follow the size or template may be disqualified.",
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
    { name: "Department of Basic Science & Humanities, IEM Kolkata", role: "Organiser" },
    { name: "Society for Data Science, IEM Student Chapter", role: "In association with" },
  ],
  logos: [
    { src: "/images/logo_iem.png", name: "Institute of Engineering & Management" },
    { src: "/images/logo_lions.png", name: "The Lion's Club of Kolkata, IEM" },
    { src: "/images/logo_rotary.png", name: "Rotary Club of Salt Lake Silicon Valley" },
    { src: "/images/logo_iic.png", name: "Institution's Innovation Council (Ministry of Education Initiative)" },
    { src: "/images/logo_sds.png", name: "Society for Data Science, IEM Student Chapter" },
    { src: "/images/logo_uem.png", name: "University of Engineering & Management" },
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
  { q: "When and where is DataVerse 2K27?", a: "Saturday–Sunday, 13–14 February 2027 at IEM Management Building, EP Block, Sector V, Bidhannagar, Kolkata 700091." },
  { q: "How much is the registration fee?", a: "Central Registration ₹449 gives access to all events, workshops, competitions & games, the Mega Auction, goodies and certificates. Event-wise registration for Ideaforge / Poster Presentation is ₹350 for a single event or ₹399 for both (no Mega Auction)." },
  { q: "Do IEM students get a refund?", a: "Yes — registration fees will be reimbursed for IEM students." },
  { q: "What can I win?", a: "A total prize pool of ₹24,000+ with cash prizes, exciting goodies, mystery auction prizes and certificates for all participants." },
  { q: "Can I register as a team?", a: "No. All registrations for DataVerse 2K27 are individual (solo)." },
  { q: "How do I register?", a: "Click 'Register' and open the official DataVerse 2K27 Google Form. Fill in your details and the events you want to take part in." },
  { q: "Where do I get updates?", a: "Follow @dataverse.2k27 on Instagram for announcements, timings and results." },
  { q: "Who can participate?", a: "Students interested in data science and technology. Carry a valid college ID on event days." },
];

export const CONTACT = {
  email: "dataverse2k27@gmail.com",
  phones: ["6291540402", "8777681364"],
  address: "IEM Management Building, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091",
  map: "https://maps.google.com/maps?q=IEM%20Management%20Building%20EP%20Block%20Sector%20V%20Kolkata%20700091&output=embed",
};
