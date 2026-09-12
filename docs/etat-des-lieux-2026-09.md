# État des lieux du site LePhare — Septembre 2026

> Étude réalisée par les agents **Analytics**, **UX Designer** et **Head of Marketing**, croisée avec une lecture du code source.
> Deux enjeux prioritaires : **(1) capitaliser sur le trafic mobile** · **(2) booster la réservation d'ateliers**.
> Date : 2026-09-12 · Données GA4 : instantané du 2026-09-11 (`public/dashboard-data.json`).

---

## Verdict global

Le site est en **fort momentum** : le trafic accélère nettement (≈ 58 → 106 sessions/jour en cadence sur 90j → 7j), et la page **/ateliers est déjà la 3ᵉ page la plus vue** du site (1 866 vues/90j), avec une intention d'inscription **remarquablement élevée** (~38 % de clic « S'inscrire »).

**Le problème n'est donc pas l'acquisition, mais la conversion.** Deux points de mesure encadrent le diagnostic :
1. **Mobile confirmé** : ~64 % des clics Google Search viennent du mobile (Search Console) — reste à mesurer l'écart de *conversion* mobile vs desktop côté GA4.
2. **On ne mesure pas les inscriptions réellement finalisées** (elles se terminent sur AssoConnect, hors tracking).

Et un signal SEO fort : **la recherche est quasi 100 % de marque** (« le phare merignac »…) → le site capte ceux qui connaissent déjà LePhare, mais reste peu découvrable par de nouveaux publics — un gisement d'acquisition inexploité.

La bonne nouvelle : la majorité des correctifs à fort impact sont **des quick wins** (données déjà présentes mais non affichées, composants déjà écrits mais non réutilisés).

---

## Chiffres de référence (90 jours, tous appareils)

| Métrique | Valeur |
|---|---|
| Sessions | 5 264 (cadence : 58,5/j sur 90j → **106/j sur 7j**) |
| Utilisateurs | 3 518 |
| Pages vues | 13 060 |
| Vues `/ateliers` | 1 866 (**3ᵉ page**, derrière `/` 3 693 et `/professionnels` 2 909) |
| Clics « S'inscrire » atelier | **708 (~37,9 % des vues /ateliers)** — en forte accélération |
| Inscriptions ateliers finalisées | **inconnu** (AssoConnect non tracké) |
| Clics RDV pros | 389 (meilleures fiches : 22–25 % vue→clic) |
| Clics « Faire un don » | 22 (très faible) |
| Soumissions formulaire contact | ~1 (anomalie probable — voir plus bas) |

> Sources : Direct 2 537 · Organic Search 1 931 · **Organic Social 430** · Referral 276.

---

## ENJEU 1 — Capitaliser sur le trafic mobile

### 1a. Le mobile est confirmé — via Google Search Console
**Données Search Console (clics depuis Google, dernier mois)** : Mobile **214** · Ordinateur **109** · Tablette **11** → sur 334 clics, **≈ 64 % mobile** (67 % avec la tablette). L'hypothèse « beaucoup de trafic mobile » est **confirmée**. Localité : France 330, requêtes « merignac » → cible **Mérignac**.

Nuance de mesure : ce chiffre concerne les arrivées **organiques (Google Search)**, pas le split toutes sources. Côté GA4, le collecteur `scripts/fetch-analytics.mjs` **n'interroge toujours pas `deviceCategory`** → on ne peut pas encore chiffrer les **écarts de conversion** mobile vs desktop (ateliers, RDV, dons).
→ **Correctif restant** : ajouter `deviceCategory` au collecteur GA4 pour mesurer la conversion par appareil (le *volume* mobile, lui, est désormais établi). *(Nécessite `GA_CREDENTIALS` pour re-fetch.)*

### 1a-bis. La recherche est quasi 100 % de marque → gisement SEO d'acquisition
Requêtes Search Console : « le phare merignac » (64 clics), « maison le phare » (17), « le phare association »… **Presque personne n'arrive via une requête non-marque.** Autrement dit, le site capte les gens qui **connaissent déjà** LePhare (bouche-à-oreille, réputation locale) mais **ne se fait pas découvrir** par de nouveaux publics cherchant un service (« atelier santé mentale Mérignac », « groupe de parole Bordeaux », « café associatif Mérignac »).
→ **Opportunité** : contenu/SEO local sur des requêtes non-marque (pages ateliers optimisées, articles, Google Business Profile) pour élargir l'audience au-delà du cercle déjà acquis. L'incohérence **Bordeaux/Mérignac** dans les titres (relevée par l'UX) nuit directement à ce SEO local — à corriger.

### 1b. Frictions mobiles confirmées dans le code
| Friction | Sévérité | Fichier |
|---|---|---|
| Grille ateliers **2 colonnes forcées** dès 320px → cartes illisibles | Majeur | `src/pages/Ateliers.tsx` (l.225, l.323) |
| **Touch targets < 44px** sur CTA « S'inscrire », chips de filtre, burger | Majeur | `Ateliers.tsx`, `Header.tsx`, `Index.tsx` |
| **Hero home 1,3 Mo** (LCP), sans WebP ni `srcset` → perf mobile dégradée | Majeur | `src/pages/Index.tsx`, `assets/chateau-hero.jpg` |
| Page **Contact sans formulaire ni téléphone** → pas de click-to-call | Majeur | `src/pages/Contact.tsx` |
| **Aucun CTA visible sur mobile** hors burger (don + contact cachés) | Majeur | `src/components/layout/Header.tsx` |
| Domaine email incohérent (`.com` vs `.fr`) → leads perdus silencieusement | Majeur | `Contact.tsx`, `Footer.tsx`, `CarteAtelier.tsx`, `Actualites.tsx` |

### 1c. Leviers pour convertir le trafic mobile
- **Barre CTA sticky mobile** (bas d'écran) : « Voir les ateliers » + « Nous appeler » — visible sans ouvrir le burger.
- **Téléphone cliquable `tel:`** + bouton **Itinéraire** (Google Maps) sur Contact.
- **Boutons de partage natifs** (Web Share API) sur ateliers/actus → WhatsApp/Instagram.
- **Google Business Profile** optimisé (photos, catégorie, avis, 1 post/semaine) : SEO local mobile, zéro développement.

---

## ENJEU 2 — Booster la réservation d'ateliers

### 2a. Le point le plus grave : la date de l'atelier n'est jamais affichée — **BLOQUANT**
*(Constat remonté indépendamment par l'UX et le Marketing.)*
Le champ `date_evenement` existe en base et sert à trier/déterminer passé-futur, mais **il n'est jamais rendu à l'écran** sur `/ateliers`. On ne sait pas *quand* a lieu l'atelier — l'information n°1 pour décider de s'inscrire.
**Ironie** : le composant `CarteAtelier.tsx` affiche déjà parfaitement date + heure… mais il n'est pas utilisé sur la page ateliers. → **Quick win majeur.**

### 2b. Les ateliers gratuits n'ont souvent aucun CTA → cul-de-sac — **BLOQUANT**
Le bouton « S'inscrire » ne s'affiche **que si `lien_inscription` existe** (`Ateliers.tsx:284`). Les ateliers gratuits animés par les bénévoles n'ont typiquement pas de billetterie externe → **carte sans aucun moyen d'agir**. Un fallback (`mailto:` pré-rempli ou `/contact`) existe déjà dans `CarteAtelier.tsx` — il suffit de le généraliser. **Jamais de carte sans CTA.**

### 2c. La conversion finale n'est pas mesurée
« S'inscrire » ouvre `lien_inscription` (AssoConnect) **dans un nouvel onglet, hors-site**. On mesure les 708 clics d'intention mais **pas les inscriptions finalisées** → pilotage à l'aveugle. De plus, l'ouverture d'onglet externe n'est pas signalée (pas d'icône « lien externe »).

### 2d. On ne sait pas quel atelier attire
Le site envoie bien `atelier_name`, mais la **custom dimension `customEvent:atelier_name` n'est pas enregistrée dans l'admin GA4** → la ventilation par atelier est vide. Correctif purement côté admin GA4.

### 2e. Infos manquantes + dette technique
- Tarif affiché « **Payant** » sans montant ; **lieu/durée/public cible** jamais affichés (champs `format`, `public_cible`, `objectifs` présents en base, non exploités).
- **Deux implémentations de carte atelier** divergentes : la page ateliers réimplémente une carte *inférieure* alors que `CarteAtelier.tsx` (date, pill de statut, liste d'attente, `min-h-[44px]`) existe. → **Unifier sur `CarteAtelier`** résout d'un coup 2a, 2b et une partie des frictions mobiles.

### 2f. Leviers de conversion & acquisition
- **Rareté / preuve sociale** : « Plus que X places », badge « Populaire », et sur complet → « Être prévenu·e de la prochaine session » (au lieu d'un badge inerte).
- **« Ajouter à mon agenda »** (.ics) sur chaque atelier → réduit les no-show.
- **Verbatims de participants** + photo d'ambiance des salles.
- **Acquisition** : 1 Reel Instagram par atelier (canal mobile n°1 local), newsletter mensuelle « programmation du mois », partenariats locaux (mairie Mérignac, médecins de quartier, CCAS).
- **Rétention** : email post-atelier + séries récurrentes (« groupe de parole, tous les 2ᵉ jeudis ») + liste « prévenez-moi ».

---

## Les améliorations principales — feuille de route priorisée

### 🥇 À lancer en premier (quick wins, effort faible / impact élevé)
1. **Afficher date + heure + lieu sur chaque carte atelier** — la donnée existe, elle est juste ignorée. Lève le blocage n°1. *(`Ateliers.tsx`)*
2. **Grille `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`** au lieu de 2 colonnes forcées. *(`Ateliers.tsx`)*
3. **CTA de secours pour les ateliers sans lien** (mailto/contact) — débloque les ateliers gratuits. *(`Ateliers.tsx`)*
4. **`min-h-[44px]` sur tous les CTA/chips mobiles** — accessibilité, public parfois âgé/fragilisé.
5. **Unifier le domaine email** (`.com` vs `.fr`) partout — stoppe la perte silencieuse de leads.

### 🥈 Débloquer la mesure (sinon on optimise à l'aveugle)
6. **Ajouter `deviceCategory`** au collecteur GA4 → l'enjeu mobile devient chiffrable.
7. **Enregistrer la custom dimension `atelier_name`** dans l'admin GA4 → performance par atelier.
8. **Tracker la conversion finale** (retour AssoConnect / event de confirmation) ou internaliser l'inscription des ateliers de l'asso via un formulaire.

### 🥉 Amplifier (effort moyen / impact élevé)
9. **Barre CTA sticky mobile** + **téléphone cliquable** + **formulaire de contact** (composants shadcn déjà installés).
10. **Optimiser les images** (`chateau-hero.jpg` 1,3 Mo → < 200 Ko WebP + `srcset`).
11. **Rareté + « ajouter à l'agenda » + preuve sociale** sur les ateliers.
12. **Unifier sur le composant `CarteAtelier`** (résout 2a/2b/touch targets d'un coup).

### 📣 Sans développement (activable tout de suite)
- Google Business Profile optimisé + 1 post/semaine.
- 1 Reel Instagram par atelier + newsletter mensuelle + partenariats locaux.

---

## Points à investiguer (gains rapides potentiels)
- **Fiches pros à 0 % de RDV malgré du trafic** (`isabelle-verges` 134 vues, `dr-fatiha-kheffache` 111, `juliette-coupeau` 94) : bouton RDV probablement absent/cassé.
- **Formulaire de contact ≈ 1 soumission / 90j** pour 3 518 utilisateurs : anomalie de tracking **ou** de parcours (cohérent avec l'absence de vrai formulaire).
- **Taux de rebond à 0,6 %** : valeur anormalement basse → configuration GA4 à vérifier.
- **Hygiène du funnel pros** : slugs parasites/doublons (`lea-marinelli`/`lea-marrinelli`, UUIDs, URLs externes) qui polluent l'analyse.

---

## Limites de l'étude
- Données GA4 = instantané du 2026-09-11 (pas de re-fetch : `GA_CREDENTIALS` absent de l'environnement).
- Aucune segmentation par appareil ni période comparative T vs T-1 dans les données actuelles.
- L'étude est **un état des lieux, pas une implémentation** : les items « code » doivent passer par l'agent `developer` avec le protocole `/deploy-checklist` (tsc + build) avant tout push sur `main`.
