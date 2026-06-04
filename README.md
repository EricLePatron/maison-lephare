# lePhare — Mental Health House

> Full-stack website for a mental health association — designed, specified and driven by a Product Manager working with a team of specialized AI agents.

**[→ Live site](https://maison-lephare.com)**

---

## The project

lePhare is a mental health house located in Mérignac, France. It brings together a multi-professional practice (psychiatrists, psychologists, therapists), an association running workshops and peer support groups, and an inclusive café open to the neighborhood.

This repo covers the full website: venue presentation, professional directory with appointment booking, workshop catalog, admin CMS, and an analytics dashboard.

**What makes this project unusual:** it was entirely driven by a Product Manager — from spec writing to marketing strategy — using a team of specialized AI agents working in parallel (see Agents section below).

---

## Tech stack

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Google Analytics](https://img.shields.io/badge/GA4-E37400?style=flat-square&logo=google-analytics&logoColor=white)

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router DOM v6 |
| Backend | Supabase (PostgreSQL + Edge Functions + Auth) |
| Analytics | Google Analytics 4 — custom events + Data API |
| Deployment | Lovable (CI/CD from `main`) |
| Scripts | Node.js (ESM) — GA4 Data API v1 |

---

## Features

### Public site
- **Home** — venue presentation, 3 pillars (practice / association / café), orientation grid
- **The place** — château history, values, timeline, impact statistics
- **Professionals** — dynamic directory (Supabase), filters by profession, full profile pages with Doctolib/Calendly booking, "accepting new patients" badge
- **Workshops** — catalog managed from the admin, direct registration (AssoConnect)
- **Association** — presentation, activities, donation CTA
- **Contact** — form → Supabase Edge Function → email

### Admin back-office (protected)
- Content CMS (text, images) — editable by the team without code
- Professional management (full CRUD)
- Workshop management
- **Analytics dashboard** — real-time GA4 dashboard

### Custom GA4 tracking
All business events are tracked with parameters:

```
don_click                 → location (header_desktop / header_mobile / footer)
atelier_inscription_click → atelier_name, atelier_category, atelier_index
rdv_click                 → pro_slug, pro_name, destination (doctolib/calendly)
pro_profile_view          → pro_slug, pro_name, pro_profession
pro_contact_click         → pro_slug, pro_name
contact_form_submit       → success, error_message
nav_click                 → link_label, destination, nav_location
```

### Built-in analytics dashboard

A Node.js script (`scripts/fetch-analytics.mjs`) queries the GA4 Data API and generates a static `dashboard-data.json` served in the admin. It exposes:
- Overview (sessions, users, bounce rate, avg duration)
- Daily / hourly trend
- Top pages + traffic sources
- **RDV funnel** per professional (profile views → RDV clicks → conversion rate)
- **Workshop funnel** (page views → registration clicks → per-workshop breakdown)
- Donation clicks (desktop vs mobile)

```bash
GA_CREDENTIALS=/path/to/service-account.json npm run dashboard
```

---

## AI agent architecture

This project is managed by a team of 4 specialized AI agents, defined in `.claude/agents/`:

| Agent | Role | Triggered by |
|---|---|---|
| `analytics` | GA4 metrics analysis, data reports | Traffic questions, conversion analysis, trends |
| `product-manager` | User stories, technical specs, prioritization | Feature definition, product decisions |
| `ux-designer` | Visual specs, design system, accessibility | UI changes, new components, responsive design |
| `head-of-marketing` | Acquisition strategy, conversion, donations | Campaigns, copywriting, funnel optimization |

These agents collaborate: the PM defines the what, the UX designer the visual how, analytics measures impact, and marketing optimizes conversion.

**Example multi-agent workflow:**
> *"Analyze the donation funnel and propose an optimization strategy"*
> → Analytics reads `dashboard-data.json` and produces the numbers
> → Marketing identifies unexploited conversion moments
> → UX designer specs new components (`DonationCard`, `DonationBanner`)
> → PM prioritizes by impact/effort and writes user stories

---

## Design system

Visual identity consistent with the venue's warm, accessible character:

| Token | Value | Usage |
|---|---|---|
| `primary` (terra cotta) | `hsl(24 55% 40%)` | CTAs, active links, accents |
| `secondary` (sage) | `hsl(155 22% 55%)` | Sections, badges, backgrounds |
| `background` (cream) | `hsl(30 50% 96%)` | Global background |
| Heading font | Playfair Display | `font-serif` |
| Body font | Inter | `font-sans` |
| Accent font | Caveat | Handwritten quotes, annotations |

---

## Project structure

```
src/
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # shadcn/ui components
├── hooks/
│   ├── useAuth.ts
│   ├── useProfessionnels.ts
│   ├── useSiteContent.ts
│   └── useTheme.ts
├── lib/
│   └── analytics.ts     # All GA4 tracking functions
├── pages/
│   ├── admin/           # Back-office (Login, Metrics, CMS...)
│   ├── Index.tsx        # Home
│   ├── Professionnels.tsx
│   ├── ProfessionnelProfile.tsx
│   ├── Ateliers.tsx
│   ├── Association.tsx
│   └── Contact.tsx
supabase/
└── functions/           # Edge Functions (contact-form, email...)
scripts/
└── fetch-analytics.mjs  # GA4 Data API → dashboard-data.json
.claude/
└── agents/              # AI agent definitions
```

---

## Getting started

```bash
# Clone and install
git clone https://github.com/EricLePatron/maison-lephare.git
cd maison-lephare
npm install

# Environment variables
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY

# Development
npm run dev

# Analytics dashboard (requires a GA4 service account)
GA_CREDENTIALS=/path/to/service-account.json npm run dashboard
```

---

## What I learned

This project is above all an exploration of **what a Product Manager can build in 2025** with available AI tools:

- **Own a full web product end-to-end** without being a developer — from database schema to Edge Functions
- **Build a team of specialized agents** working in parallel on complementary dimensions (tech, UX, data, marketing)
- **Measure what matters** — every feature ships with a GA4 event to validate its impact
- **Ship fast** — from idea to production in hours, with maintainable code quality

The boundary between PM and builder is fading. This repo is the proof.

---

*Built for [lePhare — Mental Health House](https://maison-lephare.com), Mérignac, France*
