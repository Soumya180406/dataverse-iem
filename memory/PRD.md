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

## Update (2026-11-08) — poster details added
- From user's poster: "A Data Science & Innovation Fest", "From Data to Impact", Sat–Sun, venue IEM Management Building, EP Block, Sector V, Kolkata 700091
- Event taglines, Grand Auction renamed Mega Auction
- Fee perks (Central ₹449 all events + Mega Auction; event-wise Ideaforge/Poster ₹350/₹399, no Mega Auction); IEM students reimbursed
- New Prizes section (₹24,000+ pool, mystery auction, highlights); partner logos cropped from poster (IEM, Lions Club, Rotary, IIC, SDS, UEM)
- Contact: dataverse2k27@gmail.com, 6291540402, 8777681364; scan-to-register QR of Google Form

## Update (2026-11-08) — Live leaderboard
- Public live DataPoints leaderboard: home section #leaderboard (top 10 + podium) and /leaderboard page (search), auto-refresh every 5s
- Organiser console /organiser protected by ORGANISER_PASSCODE (backend .env, header X-Organiser-Key, 10-fail/15-min lockout); user chose no login
- Add one participant, paste list from Google Form sheet (Name<TAB>College or Name, College; header row + duplicates skipped), +/- buttons, set exact score, remove
- Mongo collection `leaderboard` {id, name, college, points, key, updated_at}

## Placeholders to replace
Team names, contact email/phones, venue rooms, sponsor logos, refund policy line, sitemap domain.

## Backlog
- P1: Real team photos/names, sponsor logos, final schedule
- P2: Post-event photo gallery, embedded Instagram feed
