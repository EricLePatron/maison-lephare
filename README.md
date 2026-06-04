# lePhare — Maison dédiée à la Santé Mentale

> Site web complet d'une maison de santé mentale associative — conçu, spécifié et piloté par un Product Manager en collaboration avec une équipe d'agents IA spécialisés.

**[→ Voir le site en production](https://maison-lephare.com)**

---

## Le projet

lePhare est une maison dédiée à la santé mentale à Mérignac (33). Elle réunit un cabinet pluri-professionnel, une association proposant des ateliers et groupes de parole, et un café inclusif ouvert au quartier.

Ce repo contient le site web complet : présentation du lieu, annuaire des professionnels avec prise de RDV, catalogue des ateliers, espace admin CMS, et tableau de bord analytics.

**Ce qui rend ce projet atypique :** il a été entièrement piloté par un Product Manager — de la définition des specs à la stratégie marketing — en s'appuyant sur une équipe d'agents IA spécialisés (voir section Agents ci-dessous).

---

## Stack technique

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Google Analytics](https://img.shields.io/badge/GA4-E37400?style=flat-square&logo=google-analytics&logoColor=white)

| Couche | Choix |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS + shadcn/ui (Radix UI) |
| Routing | React Router DOM v6 |
| Backend | Supabase (PostgreSQL + Edge Functions + Auth) |
| Analytics | Google Analytics 4 — events custom + Data API |
| Déploiement | Lovable (CI/CD depuis `main`) |
| Scripts | Node.js (ESM) — GA4 Data API v1 |

---

## Fonctionnalités

### Site public
- **Accueil** — présentation du lieu, des 3 piliers (cabinet / association / café), grille d'orientation
- **Le lieu** — histoire du château, valeurs, timeline, statistiques d'impact
- **Professionnels** — annuaire dynamique (Supabase), filtres par profession, fiches profil complètes avec bouton Doctolib/Calendly, badge "accepte nouveaux patients"
- **Ateliers** — catalogue géré depuis l'admin, inscription directe (AssoConnect)
- **Association** — présentation, activités, appel aux dons
- **Contact** — formulaire → Edge Function Supabase → email

### Back-office admin (accès protégé)
- CMS contenu (textes, images) — éditable par l'équipe sans code
- Gestion des professionnels (CRUD complet)
- Gestion des ateliers
- **Dashboard analytics** — tableau de bord GA4 en temps réel

### Tracking GA4 custom
Tous les événements business sont trackés avec paramètres :

```
don_click           → location (header_desktop / header_mobile / footer)
atelier_inscription_click → atelier_name, atelier_category, atelier_index
rdv_click           → pro_slug, pro_name, destination (doctolib/calendly)
pro_profile_view    → pro_slug, pro_name, pro_profession
pro_contact_click   → pro_slug, pro_name
contact_form_submit → success, error_message
nav_click           → link_label, destination, nav_location
```

### Dashboard analytics intégré

Un script Node.js (`scripts/fetch-analytics.mjs`) interroge la GA4 Data API et génère un `dashboard-data.json` statique servi dans l'admin. Il expose :
- Vue d'ensemble (sessions, users, bounce rate, durée)
- Tendance jour par jour / heure par heure
- Top pages + sources de trafic
- **Funnel RDV** par professionnel (vues fiche → clics RDV → taux de conversion)
- **Funnel Ateliers** (vues page → clics S'inscrire → détail par atelier)
- Clics dons (desktop vs mobile)

```bash
GA_CREDENTIALS=/path/to/service-account.json npm run dashboard
```

---

## Architecture agents IA

Ce projet est piloté par une équipe de 4 agents IA spécialisés, définis dans `.claude/agents/` :

| Agent | Rôle | Déclenchement |
|---|---|---|
| `analytics` | Analyse des métriques GA4, rapports chiffrés | Questions sur le trafic, conversions, tendances |
| `product-manager` | User stories, specs techniques, priorisation | Définition de features, arbitrages produit |
| `ux-designer` | Specs visuelles, design system, accessibilité | Changements d'interface, nouveaux composants |
| `head-of-marketing` | Stratégie acquisition, conversion, dons | Campagnes, copywriting, optimisation funnel |

Ces agents collaborent : le PM définit le quoi, l'UX designer le comment visuel, l'analytics mesure l'impact, le marketing optimise la conversion.

**Exemple de workflow multi-agents :**
> *"Analyser le funnel dons et proposer une stratégie d'optimisation"*
> → Analytics lit `dashboard-data.json` et produit les chiffres
> → Marketing analyse les moments de conversion inexploités
> → UX designer spécifie les nouveaux composants (`DonationCard`, `DonationBanner`)
> → PM priorise par impact/effort et rédige les user stories

---

## Design system

Identité visuelle cohérente avec le lieu :

| Token | Valeur | Usage |
|---|---|---|
| `primary` (terra cotta) | `hsl(24 55% 40%)` | CTAs, liens actifs, accents |
| `secondary` (sage) | `hsl(155 22% 55%)` | Sections, badges, backgrounds |
| `background` (cream) | `hsl(30 50% 96%)` | Fond global |
| Font titres | Playfair Display | `font-serif` |
| Font corps | Inter | `font-sans` |
| Font accent | Caveat | Citations, annotations manuscrites |

---

## Structure du projet

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
│   └── analytics.ts     # Toutes les fonctions de tracking GA4
├── pages/
│   ├── admin/           # Back-office (Login, Metrics, CMS...)
│   ├── Index.tsx        # Accueil
│   ├── Professionnels.tsx
│   ├── ProfessionnelProfile.tsx
│   ├── Ateliers.tsx
│   ├── Association.tsx
│   └── Contact.tsx
supabase/
└── functions/           # Edge Functions (contact-form, email...)
scripts/
└── fetch-analytics.mjs  # Collecte GA4 Data API → dashboard-data.json
.claude/
└── agents/              # Définitions des agents IA du projet
```

---

## Lancer le projet

```bash
# Cloner et installer
git clone https://github.com/EricLePatron/maison-lephare.git
cd maison-lephare
npm install

# Variables d'environnement
cp .env.example .env
# Remplir VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY

# Développement
npm run dev

# Dashboard analytics (nécessite un service account GA4)
GA_CREDENTIALS=/path/to/service-account.json npm run dashboard
```

---

## Ce que j'ai appris

Ce projet est avant tout une exploration de **ce que peut faire un Product Manager en 2025** avec les outils IA disponibles :

- **Piloter la totalité d'un produit web** sans être développeur — de la base de données aux Edge Functions
- **Construire une équipe d'agents spécialisés** qui travaillent en parallèle sur des dimensions complémentaires (tech, UX, data, marketing)
- **Mesurer ce qui compte** — chaque feature est accompagnée d'un événement GA4 qui permet de valider l'impact
- **Itérer vite** — du besoin à la production en quelques heures, avec une qualité de code maintenable

La frontière entre PM et builder s'estompe. Ce repo en est la démonstration.

---

*Site pour [lePhare — Maison dédiée à la Santé Mentale](https://maison-lephare.com), Mérignac (33)*
