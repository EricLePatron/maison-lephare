# Plan SEO local d'acquisition — Maison LePhare (Mérignac)

> Objectif : **remplir les ateliers** en captant de nouveaux publics via les requêtes **non-marque**.
> Complément de `docs/etat-des-lieux-2026-09.md`. Date : 2026-09-12.

> ⚠️ **À lire avant implémentation** : les correctifs **on-page** ci-dessous ont été relevés sur le **dépôt GitHub**, qui est **désynchronisé de la production** (cf. avertissement de l'état des lieux). Chaque correctif code doit être **revérifié sur le site live** avant d'être appliqué, et le repo doit d'abord être resynchronisé avec la production. La **stratégie** (requêtes cibles, contenu, GBP) n'est pas affectée par ce désync.

---

## Le constat qui cadre la stratégie

La recherche Google est **quasi 100 % de marque** (« le phare merignac » 64 clics, « maison le phare » 17…). Ces gens connaissent déjà LePhare. **Le SEO de marque est un plafond** : on ne grandit pas en rankant mieux sur son propre nom. Toute la croissance d'acquisition est dans les requêtes **non-marque** — les gens qui cherchent *un service* sans savoir que LePhare existe.

Deux réalités pour rester réaliste :
- **~64 % du trafic est mobile** → tout contenu lisible/actionnable au pouce.
- **100 % France, ancrage « merignac »** → jouer le **local d'abord** (facile), le régional « bordeaux » ensuite (concurrentiel).

---

## 🎯 Top 3 à lancer ce mois-ci (Impact fort × Effort faible)

1. **Corriger l'incohérence Bordeaux → Mérignac** dans le title d'accueil + le JSON-LD Organization. Votre page la plus vue et 100 % des requêtes disent « merignac », mais le SEO d'accueil dit « Bordeaux » → signal local incohérent. *(à vérifier sur prod : `Index.tsx`, `index.html`)*
2. **Créer/optimiser le Google Business Profile** (catégories, posts hebdo, avis). Zéro dev, effet quasi immédiat sur les recherches locales « près de moi » et Google Maps. *(Clémentine, hors code)*
3. **Réécrire le H1 + title de `/ateliers`** avec des mots-clés de découverte + ajouter des données structurées `Event`. Rend découvrable la page déjà la plus performante. *(à vérifier sur prod : `Ateliers.tsx`)*

---

## 1. Requêtes non-marque à cibler

Priorité = intention forte × faible difficulté locale. (Volumes non mesurables sans outil payant → estimation qualitative Mérignac/Bordeaux.)

| Priorité | Requête cible | Intention | Difficulté | Page cible | Pôle |
|:---:|---|---|:---:|---|:---:|
| 🥇 P1 | groupe de parole mérignac | Trouver un groupe local | Faible | `/ateliers` | Asso |
| 🥇 P1 | atelier santé mentale mérignac / bordeaux | Découvrir une activité | Faible | `/ateliers` | Asso |
| 🥇 P1 | café associatif / inclusif mérignac | Lieu convivial de quartier | Très faible | section café | Café |
| 🥇 P1 | louer salle atelier / réunion mérignac | Réserver un espace | Faible | `/location-salle` (hors sitemap !) | Asso |
| 🥈 P2 | groupe de parole bordeaux | Idem élargi | Moyenne | `/ateliers` | Asso |
| 🥈 P2 | art-thérapie mérignac | Atelier précis | Faible-Moy | article/atelier art-thérapie | Asso |
| 🥈 P2 | pair-aidance bordeaux / gironde | Niche on-brand | Faible | article + `/ateliers` | Asso |
| 🥈 P2 | thérapie de groupe bordeaux | Soin collectif | Moyenne | `/ateliers` | Asso/Cabinet |
| 🥉 P3 | art-thérapie bordeaux | Élargi | Élevée | article pilier | Asso |
| 🥉 P3 | psychologue / psychiatre mérignac | Prise de RDV | Élevée | `/professionnels` | Cabinet |
| 🥉 P3 | où parler de sa santé mentale à bordeaux | Longue traîne | Faible | blog | Asso/Café |
| 🥉 P3 | café-débat santé mentale bordeaux | Événementiel | Faible | `/actualites` + GBP | Café |

**Séquencement** : gagner d'abord les « …mérignac » (peu de concurrence, présence physique) avant les « …bordeaux » (bassin plus large, concurrentiel).

---

## 2. Plan de contenu orienté ateliers (réaliste pour une petite asso)

### A. Enrichir l'existant (priorité, effort faible)
1. **`/ateliers` — intro SEO** (2-3 phrases) avec mots-clés : « groupe de parole », « atelier santé mentale », « Mérignac / Bordeaux », « pair-aidance ».
2. **Ancres par thème d'atelier** : chaque thème récurrent (groupe de parole, art-thérapie, café-débat) → bloc `<h2>/<h3>` avec mot-clé + « à quoi ça ressemble ».
3. **Réactiver `/location-salle`** dans le sitemap + contenu « louer une salle à Mérignac ».

### B. Créer (effort moyen, 1-2 / mois max)
4. Article pilier **« À quoi ressemble un groupe de parole ? »** → répond à la peur n°1, longue traîne, CTA vers `/ateliers`.
5. Article **« L'art-thérapie, c'est quoi ? À Mérignac avec LePhare »**.
6. Page/section **« Le Café LePhare »** → « café associatif / inclusif », grand public.

### C. Format récurrent (acquisition ET conversion)
7. **Agenda « programmation du mois »** avec date + lieu visibles → contenu frais (`Event` schema) + déclencheur d'inscription.

> Chaque article se termine par un lien interne vers `/ateliers` : c'est le maillage qui transforme le trafic de découverte en inscriptions.

---

## 3. SEO on-page / technique — à revérifier sur prod puis handoff `developer`

### 🔴 Critique — cohérence géographique & indexation
- **Title d'accueil « à Bordeaux »** → aligner sur Mérignac. *(`src/pages/Index.tsx`)*
- **JSON-LD Organization « à Bordeaux »** alors que l'adresse est Mérignac (NAP incohérent) → « à Mérignac » (le bloc MedicalClinic est déjà correct). *(`index.html`)*
- **Sitemap incomplet** : manquent `/location-salle`, `/actualites`, fiches `/professionnels/[slug]` → ajouter + `<lastmod>`. *(`public/sitemap.xml`)*
- **Title statique `index.html` sans ville** → harmoniser sur Mérignac (utile aux crawlers/partages avant JS).

### 🟠 Important — on-page page ateliers (cœur d'acquisition)
- **H1 `/ateliers` sans mot-clé** → ex. « Ateliers & groupes de parole en santé mentale à Mérignac ». *(`Ateliers.tsx`)*
- **Aucune donnée structurée `Event`** → ajouter un schema `Event` par atelier (nom, `startDate`, `location` Mérignac, `offers`) → résultats enrichis Événements, puissant en local.

### 🟡 Moyen — hygiène
- NAP « 33 700 Merignac » (espace + sans accent) sur fiches pros → uniformiser « 33700 Mérignac ». *(`ProfessionnelProfile.tsx`)*
- `public/llms.txt` : ajouter `/location-salle`, `/actualites`.
- Meta description accueil vague (coquille « un lieu en maison ») → réécrire avec mot-clé + ville.

> **Déjà bon (à conserver)** : schema `MedicalClinic` (geo, areaServed Mérignac), schema `Person`+`MedicalClinic` sur fiches pros, canonical auto (`Seo.tsx`).

### Exemples title / meta prêts à l'emploi
- **Accueil** — Title : `Le Phare – Maison de la Santé Mentale à Mérignac (Bordeaux)` · Meta : `Un château à Mérignac dédié à la santé mentale : cabinets de consultation, ateliers, groupes de parole et café inclusif ouverts à tous.`
- **Ateliers** — Title : `Ateliers & groupes de parole santé mentale – Mérignac | Le Phare` · Meta : `Groupes de parole, art-thérapie et ateliers collectifs à Mérignac près de Bordeaux. Un cadre bienveillant pour échanger entre pairs. Voir les prochaines dates.`

---

## 4. Google Business Profile & SEO local off-site (Clémentine, sans code)

**Google Business Profile (priorité absolue)**
- Catégorie principale « Association » ou « Centre de santé mentale » ; secondaires « Café », « Salle de réunion ».
- 1 post/semaine = 1 atelier à venir (date + inscription).
- Avis : solliciter participants + clients café (email post-atelier, QR au café), répondre à chacun.
- Photos : château, parc 2 ha, salles, café. Attributs : accessible, LGBTQ+ friendly, horaires café.

**Citations locales** (NAP identique partout : « 12 rue Jean-Jacques Rousseau, 33700 Mérignac ») : Pages Jaunes, Petit Futé, HelloAsso, annuaires santé mentale (PSSM France). Partenaires linkables : mairie de Mérignac, CCAS, maisons de quartier, médecins du secteur, CPTS.

**Backlinks** : agendas associatifs Mérignac / Bordeaux Métropole, presse locale (Sud Ouest) sur un événement déstigmatisation → skill `/public-relations`.

---

## Mesure
- **Requêtes non-marque** → Search Console : hausse impressions/clics hors-marque (le vrai KPI de ce plan).
- **Contenu ateliers** → `atelier_inscription_click` / `atelier_cta_click` via canal Organic Search.
- **GBP** → trafic Organic + Maps, appels, itinéraires (stats natives GBP).
- **Location salle** → vues `/location-salle` + `contact_form_submit`.

> Rappel : l'inscription finale se termine sur AssoConnect (non trackée) → acquisition pilotée à l'impression/au clic, pas à l'inscription confirmée.

---

## Fichiers concernés (handoff `developer`, après resync + vérif prod)
- `src/pages/Index.tsx` — title/meta accueil « Bordeaux » → « Mérignac »
- `index.html` — title/meta base ; JSON-LD Organization « Bordeaux »
- `src/pages/Ateliers.tsx` — title/meta ; H1 ; intro SEO ; schema `Event`
- `public/sitemap.xml` — ajouter `/location-salle`, `/actualites`, fiches pros + `<lastmod>`
- `src/pages/ProfessionnelProfile.tsx` — NAP « 33 700 Merignac » → « 33700 Mérignac »
- `public/llms.txt` — ajouter `/location-salle`, `/actualites`
- `src/pages/LocationSalle.tsx` — enrichir « louer salle Mérignac » (optionnel)

> Tout changement code passe par l'agent `developer` avec `/deploy-checklist` (tsc + build) avant push. Les actions GBP / avis / citations / articles sont activables immédiatement sans dev.
