# DataVerse 2K27 — Official Event Website

**Compete • Analyze • Conquer**

| | |
|---|---|
| **Production URL** | https://dataverse-iem.emergent.host |
| **Requested college domain** | https://dataverse.iem.edu.in |
| **Event dates** | 13–14 February 2027 |
| **Venue** | Institute of Engineering & Management (IEM), Kolkata |
| **Instagram** | [@dataverse.2k27](https://www.instagram.com/dataverse.2k27) |

---

## 1. Project Overview

This is the official website for **DataVerse 2K27**, a college technical and data science event. It is a full-stack web application with:

- A responsive public website with event information, schedule, rules, prizes, team, sponsors, gallery and FAQs.
- Registration through the official Google Form.
- A **public live leaderboard** at `/leaderboard`.
- A **secure admin dashboard** at `/admin`, using Google Sign-In and role-based access. Organisers use it to manage games, participants, scores, users and website text.
- Downloadable templates for the Ideaforge and Poster Presentation events.

## 2. Event Details and Objectives

**Organised by** the Department of Basic Science and Humanities, Institute of Engineering & Management, Kolkata, in association with the Society for Data Science, IEM Student Chapter.

**Event categories**
- Ideaforge
- Poster Presentation
- Data Treasure Hunt
- Games Carnival
- Workshops
- Grand Auction

**Objectives**
- Give students a competitive platform for data science, analytics and innovation.
- Encourage hands-on problem solving, creative presentation and teamwork.
- Give participants and visitors live, transparent score tracking during the event.

## 3. Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| React 19 (Create React App + CRACO) | Single-page application |
| React Router DOM | Client-side routing |
| Tailwind CSS + shadcn/ui (Radix UI primitives) | Styling and UI components |
| Framer Motion | Animations and transitions |
| lucide-react | Icons |
| Axios | HTTP requests to the backend API |
| @clerk/react | Google Sign-In for the admin dashboard |
| sonner | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API (all routes under the `/api` prefix) |
| Uvicorn | ASGI server |
| Motor (async MongoDB driver) | Database access |
| Pydantic | Request validation |
| PyJWT + httpx | Verifying Clerk session tokens and fetching user profiles |
| openpyxl | Excel (`.xlsx`) score export |
| python-dotenv | Loading environment variables |
| pytest | Backend API tests |

### Database
- **MongoDB**, a persistent document database. It is accessed only by the backend.

### Utility scripts
- `python-pptx`-based Python scripts in `/scripts` generate the downloadable PPT/poster templates. LibreOffice converts the poster size guide to PDF.

## 4. System Architecture

```
┌────────────────────────┐        HTTPS         ┌──────────────────────────┐
│   Browser (Visitor /   │ ───────────────────▶ │   React Frontend (SPA)   │
│   Organiser / Admin)   │                      │   routes: / /register    │
└──────────┬─────────────┘                      │   /leaderboard /admin    │
           │                                    └────────────┬─────────────┘
           │ Google Sign-In (Clerk)                          │ REST  /api/*
           ▼                                                 ▼
┌────────────────────────┐   session token     ┌──────────────────────────┐
│  Clerk Authentication  │ ──────────────────▶ │   FastAPI Backend        │
│  (Google accounts)     │   verified by API   │   server.py              │
└────────────────────────┘                     │   admin_api.py           │
                                               │   clerk_auth.py          │
┌────────────────────────┐                     └────────────┬─────────────┘
│  Google Form           │◀── Register buttons              │ Motor
│  (registrations)       │    open in new tab               ▼
└────────────────────────┘                     ┌──────────────────────────┐
                                               │   MongoDB                │
                                               └──────────────────────────┘
```

- The frontend reads the API base URL from `REACT_APP_BACKEND_URL` and calls `${REACT_APP_BACKEND_URL}/api/...`.
- Public endpoints (`GET /api/leaderboard`, `GET /api/content`) need no login.
- Every `/api/admin/*` and user-management endpoint needs a valid Clerk session token and an authorised role. The backend checks this on every request.

## 5. Database Architecture and Data Flow

### Collections
| Collection | Contents |
|---|---|
| `users` | Signed-in organisers: Clerk user id, name, email, role (`super_admin`, `admin`, `member`), environment |
| `games` | Event games: id, name, maximum score, display order, created time |
| `participants` | Leaderboard entries: id, name, college/team, per-game `scores`, computed `total`, timestamps |
| `score_history` | Audit log of score actions: action type, values, admin name and email, timestamp |
| `site_content` | Admin-edited website text (single document with key `main`) |

### Data flow
1. **Score entry:** an admin enters a score in `/admin`. The backend validates it (it must be a number between 0 and the game's maximum score) and stores it.
2. **Totals and ranking:** the backend recalculates the participant's `total` in the same database update. Leaderboard queries sort by `total` (descending), then by name.
3. **Audit:** every score change, deletion and reset is written to `score_history` with the admin's identity and the time.
4. **Public display:** `/leaderboard` and the home-page leaderboard section reload the data every 5 seconds (paused while the browser tab is hidden).
5. **Website text:** content edited in the admin Content tab is saved to `site_content`. The public site reads it through `GET /api/content`, and the built-in defaults are used where nothing has been edited.

All leaderboard and admin data is stored in MongoDB. Nothing is kept only in browser storage.

## 6. Registration System

- Every **Register** button on the site (top menu, hero, fee boxes, event cards, home-page call-to-action, footer) opens the **official Google Form** in a new tab.
- The `/register` page shows the fee structure and a link to the same form.
- Fee structure (solo participation):

| Type | Fee |
|---|---|
| Single event registration | ₹350 |
| Double event registration | ₹399 |
| Central registration | ₹449 |

- Registration responses are collected and managed in Google Forms / Google Sheets. The website does not store registration data.
- To add participants to the leaderboard, organisers paste rows from the form's response sheet into the admin dashboard (see below).

## 7. Admin Dashboard (`/admin`)

**Access**
- Organisers sign in with **Google** (Clerk).
- Email addresses listed in the `ADMIN_EMAIL` environment variable become **Super Admin** on first sign-in.
- Any other account starts as **Member** and cannot use the dashboard until a Super Admin or Admin promotes it.

**Roles**
| Role | Permissions |
|---|---|
| Super Admin | Everything: games, participants, scores, history, exports, website text and user roles. Can grant any role. The last Super Admin cannot be demoted. |
| Admin | Manages games, participants, scores, history, exports and website text. Can grant roles up to Admin. |
| Member | No dashboard access |

**Dashboard tabs**
- **Scores:** enter or update a score for each participant and game. Includes a "reset all scores" action with a confirmation dialog.
- **Participants:** add, edit and delete participants or teams. Bulk import accepts rows pasted from the Google Form sheet (one per line, `Name, College` or tab-separated). Duplicates and invalid rows are reported.
- **Games:** add, edit and delete games, and set each game's maximum score.
- **History:** a timestamped log of score changes, showing which admin made each change.
- **Users:** view signed-in organisers and change their roles.
- **Content:** edit the main website text.
- **Export:** download scores as **CSV** or **Excel (.xlsx)**.

Destructive actions (deleting participants or games, resetting scores) always ask for confirmation first.

## 8. Live Leaderboard and Score Management

- Public page: **`/leaderboard`** (also embedded on the home page).
- Shows rank, participant/team name, total **DataPoints** and individual game scores.
- **Gold, silver and bronze** styling for the top three, plus a podium view.
- Responsive: a table on desktop and stacked cards on mobile.
- Read-only for visitors. Any attempt to change data without an authorised session is rejected with `401` or `403`.

## 9. Testing and Quality Assurance

- **Backend tests** (`/app/backend/tests`, pytest) cover:
  - authentication and authorisation (unauthenticated `401`, insufficient role `403`)
  - role assignment rules
  - creating, updating and deleting games and participants
  - score validation and total recalculation
  - bulk import
  - history logging
  - CSV/Excel export
  - production-readiness checks
- **Frontend testing:** automated browser tests of the public pages, registration links, leaderboard, admin sign-in and dashboard flows, at desktop and mobile widths.
- Test reports are stored in `/app/test_reports/` (iterations 1–5). The final production-readiness run passed all backend checks and all frontend flows.
- A static deployment-readiness check (no hard-coded secrets or URLs, correct ports and environment use) passed before publishing.

> ⚠️ Some legacy test files (for example the reset and content tests in `test_admin_api.py`) change data. Run them only against a test database, never against production data.

## 10. Project Folder Structure

```
/app
├── backend/
│   ├── server.py            # FastAPI app, CORS, router registration, MongoDB client
│   ├── admin_api.py         # Leaderboard, content, users/roles, admin CRUD, history, export
│   ├── clerk_auth.py        # Clerk config endpoint and session-token verification
│   ├── requirements.txt
│   └── tests/               # pytest suites
├── frontend/
│   ├── public/
│   │   ├── index.html       # SEO meta tags
│   │   ├── robots.txt, sitemap.xml
│   │   ├── images/          # Logos, faculty photos, gallery images
│   │   └── downloads/       # Ideaforge PPT, A1 poster template, poster size guide (PDF)
│   ├── src/
│   │   ├── App.js           # Routes: /, /register, /leaderboard, /admin, /sign-in, /sign-up
│   │   ├── pages/           # Home, Register, Leaderboard, AdminPage, AuthPages
│   │   ├── components/
│   │   │   ├── sections/    # Hero, About, Events, Schedule, Prizes, Rules, Sponsors, Team, Gallery, Faq, Contact, LeaderboardSection
│   │   │   ├── site/        # Navbar, Footer, Countdown, AddToCalendar, DataNetwork, Reveal
│   │   │   ├── leaderboard/ # LeaderboardView
│   │   │   ├── admin/       # Scores, Participants, Games, History, Users, Content tabs
│   │   │   ├── auth/        # ClerkAuthProvider
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── context/         # SiteContent (editable website text)
│   │   ├── data/content.js  # Default event content and Google Form URL
│   │   ├── hooks/           # useLeaderboard (5-second refresh)
│   │   └── lib/api.js       # API base URL
│   └── package.json
├── scripts/                 # Template generators (Ideaforge PPT, poster template and guide)
└── test_reports/            # QA reports
```

## 11. Installation and Execution

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB (local or hosted)
- A Clerk application with Google sign-in enabled

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# create backend/.env (see Section 12)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend
```bash
cd frontend
yarn install
# create frontend/.env (see Section 12)
yarn start          # development server on http://localhost:3000
yarn build          # production build in frontend/build
```

### Run backend tests
```bash
cd backend
pytest tests/test_iter5_prod_ready.py tests/test_iter5_role_logic.py
```

### Regenerate templates (optional)
```bash
python scripts/make_ideaforge_template.py
python scripts/make_poster_template.py     # needs LibreOffice (soffice) to create the PDF
```

## 12. Environment Variable Setup

Never commit `.env` files or real values to the repository.

### `backend/.env`
| Variable | Description |
|---|---|
| `MONGO_URL` | MongoDB connection string |
| `DB_NAME` | Database name |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins (for example `https://dataverse.iem.edu.in`) |
| `ADMIN_EMAIL` | Comma-separated Google email(s) that become Super Admin on first sign-in |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key (server only, keep private) |

### `frontend/.env`
| Variable | Description |
|---|---|
| `REACT_APP_BACKEND_URL` | Public base URL of the backend, with no trailing slash and no `/api` |

## 13. Production Hosting

- The application is hosted on the **Emergent** platform at **https://dataverse-iem.emergent.host**.
- The platform builds and serves both the React frontend and the FastAPI backend. Requests with the `/api` prefix go to the backend.
- MongoDB in production is a managed, persistent database provided by the hosting platform.
- Production secrets (Clerk keys, `ADMIN_EMAIL`, database settings) are managed in the hosting platform's secrets settings, not in the code.
- To publish changes, redeploy from the Emergent dashboard.

## 14. Custom Domain Configuration (`dataverse.iem.edu.in`)

The IEM IT/DNS administrator must add these records in the DNS zone for `iem.edu.in`:

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| A | `dataverse` | `162.159.142.117` | Auto / 3600 |
| A | `dataverse` | `172.66.2.113` | Auto / 3600 |

Steps:
1. Add both A records above (and remove any existing conflicting `A`, `AAAA` or `CNAME` records for `dataverse`).
2. In the Emergent deployment settings, link the custom domain `dataverse.iem.edu.in` to this app.
3. Wait for DNS propagation (usually minutes, up to 24–48 hours). The SSL certificate is issued automatically once the domain resolves.
4. Check the records with:
   ```bash
   nslookup dataverse.iem.edu.in
   ```
5. In the Clerk dashboard, add `https://dataverse.iem.edu.in` as an allowed domain/origin so Google Sign-In works on the college domain.
6. In `frontend/public/sitemap.xml`, replace the `YOUR-COLLEGE-DOMAIN` placeholder with `dataverse.iem.edu.in`, then redeploy.

## 15. Maintenance and Future Development

**Routine maintenance**
- **Event text:** edit it in `/admin` → Content (no code change needed), or change the defaults in `frontend/src/data/content.js`.
- **Registration link:** update `REGISTRATION_FORM_URL` in `frontend/src/data/content.js`.
- **Organiser access:** promote or demote organisers in `/admin` → Users. Keep at least one Super Admin.
- **Before the event:** create the games and their maximum scores, then bulk-import participants from the Google Form sheet.
- **After the event:** export the final scores (CSV/Excel) for records.
- **Images and logos:** replace the files in `frontend/public/images/` and keep the same file names.
- **Templates:** edit the scripts in `/scripts` and regenerate the files in `frontend/public/downloads/`.
- **Dependencies:** update with `yarn` (frontend) and `pip` followed by `pip freeze > requirements.txt` (backend), then run the tests.
- **Data safety:** avoid bulk deletes. Back up MongoDB before score resets or major changes.

**Possible future development**
- A full-screen "projector mode" leaderboard for venue displays.
- Per-event leaderboards in addition to the overall DataPoints table.
- Reusing the platform for future DataVerse editions by changing the event content and games.

---

© DataVerse 2K27 — Department of Basic Science and Humanities, IEM Kolkata, in association with the Society for Data Science, IEM Student Chapter.
