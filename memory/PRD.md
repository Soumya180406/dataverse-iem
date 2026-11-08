# DataVerse 2K27 — PRD

## Original problem statement
Build a premium, modern, fully responsive website for a college technical and data science event named **DataVerse 2K27** (Tagline: Compete • Analyze • Conquer; 13–14 February 2027; IEM Kolkata; Organizer: Dept. of Basic Science and Humanities, IEM Kolkata, with Society for Data Science, IEM Student Chapter; Instagram @dataverse.2k27). Futuristic AI/data theme, dark navy/black with purple, neon cyan and gold, premium animations, smooth scrolling, responsive. Sections: Home (hero, countdown, register buttons), About, Events (Ideaforge, Poster Presentation, Data Treasure Hunt, Games Carnival, Workshops, Grand Auction), Schedule, Registration page with fees, Rules, Sponsors, Team, Gallery, FAQs & contact, Social media. (Original also asked for in-app registration, DB, admin dashboard, payment, email, QR.)

**User update:** "Registration payment integration, with payment verification. Email confirmation after successful registration. QR code generation for registered participants. NO NEED TO DO THIS. ONLY ADD A LINK OF GOOGLE FORM IN REGISTRATION" — https://docs.google.com/forms/d/e/1FAIpQLSdaK1MhtGwMgZxZ3ZYYsYs5ijW1JKD9i_-S2DoxlgmmVPEqgw/viewform?usp=publish-editor
Fees: Single 350, Double 399, Central 449. Solo only.

## Architecture
- React (CRA + Tailwind + shadcn + framer-motion) single-page site; routes `/` and `/register`.
- All editable content in `frontend/src/data/content.js` (events, schedule, rules, team, sponsors, gallery, FAQs, contact, form URL).
- FastAPI backend reduced to a health endpoint (no data stored; registrations live in Google Form).
- SEO: meta/OG tags, JSON-LD Event schema, robots.txt, sitemap.xml (replace YOUR-COLLEGE-DOMAIN).

## Implemented (2026-11-08)
- Hero with animated data-network canvas, live countdown, fee chips, register CTAs
- About, Events, tabbed Schedule (tentative), Rules, Sponsors/partners, Team, Gallery with lightbox, FAQ accordion, Contact + map + Instagram card, footer
- Register page: fee tiers + button to the Google Form (new tab)
- Mobile menu sheet, smooth section scrolling, responsive 390/768/1920 (tested)

## Placeholders to replace
Team names, contact email/phones, venue rooms, sponsor logos, refund policy line, sitemap domain.

## Backlog
- P1: Real team photos/names, sponsor logos, final schedule
- P2: Post-event photo gallery, embedded Instagram feed
