# CLAUDE.md — Contexte projet LePhare

---

## 🚨 RÈGLE ABSOLUE — DÉPLOIEMENT EN PRODUCTION

> **Toute modification de code qui part sur `main` doit passer le protocole de validation complet. Sans exception.**

### Pourquoi cette règle existe
En juin 2026, un `git filter-branch` + force push a réécrit tous les SHAs de commits → Lovable ne savait plus à partir de quel commit déployer → **site blanc en production**. Cette règle existe pour que cela n'arrive plus jamais.

### Protocole obligatoire avant chaque push sur `main`

```bash
# 1. Vérification TypeScript — zéro erreur autorisée
npx tsc --noEmit

# 2. Build de production — doit se terminer sans erreur
npx vite build

# 3. État Git propre — pas de fichier parasite, pas de secret
git diff --cached
```

**Si l'une de ces étapes échoue → corriger avant de pusher. Jamais d'exception.**

### Interdits absolus (sans confirmation explicite de l'utilisateur)
- `git push --force` ou `git push -f` sur `main`
- `git reset --hard` sur des commits déjà poussés
- `git filter-branch` ou tout rewriting d'historique sur `main`
- Committer `.env`, des credentials JSON, ou tout secret

### Si un force push est inévitable
1. Prévenir l'utilisateur + expliquer le risque
2. Obtenir confirmation explicite
3. Immédiatement après : `git commit --allow-empty -m "chore: trigger fresh Lovable redeploy"`
4. Surveiller le déploiement Lovable jusqu'à confirmation de succès

### Agent responsable
L'agent `developer` (`.claude/agents/developer.md`) est le garant de ce protocole. Toute tâche de développement doit passer par lui.

---

## À propos de ce projet

Ce projet est le **site internet de LePhare**, une maison dédiée à la Santé Mentale située dans un château à Bordeaux.

L'usage de Claude est **strictement limité au site internet** : mise en avant de la structure, information du public, prise de contact. Claude n'intervient pas dans l'accompagnement ou la prise en charge des personnes concernées par la santé mentale.

---

## La structure LePhare

LePhare réunit sous un même toit trois entités complémentaires :

### 1. Le Cabinet pluri-professionnel
- 8 cabinets de consultation de 18 m², donnant sur un parc de 2 hectares
- Ouvert à tous les professionnels de la Santé Mentale : psychiatres, psychologues, neuropsychologues, ergothérapeutes, psychomotriciens, infirmiers, etc.
- Salle d'attente et espace détente pour l'équipe

### 2. L'Association LePhare
- 2 grandes salles de vie pour groupes de paroles, pair-aidance, ateliers thérapeutiques, café-débats, art-thérapie
- Événements réguliers autour de la Santé Mentale

### 3. Le Café LePhare
- Café ouvert à tout le quartier
- Objectif : déstigmatiser la santé mentale en ouvrant le lieu au grand public

---

## Objectifs du site internet

Le site doit :
- **Présenter** la vision et les activités de LePhare
- **Informer** sur les services (cabinet, association, café)
- **Attirer** des professionnels de santé mentale souhaitant s'installer en libéral
- **Permettre la prise de contact** avec Clémentine Espinasse
- **Communiquer** sur les événements et actualités de la maison

---

## Ton & identité

- Chaleureux, humain, accessible
- Sérieux sur la santé mentale sans être clinique ou stigmatisant
- Ouvert à tous (professionnels, patients, grand public, voisins de quartier)

---

## Contact porteur de projet

**Clémentine Espinasse**
- 📧 clementine.espinasse@gmail.com
- 💼 LinkedIn

---

## Skills disponibles — déclenchement automatique

Ces skills s'activent **automatiquement** quand le contexte correspond. Tu dois les invoquer sans que l'utilisateur le demande explicitement.

| Skill | Déclenche-toi quand… |
|-------|----------------------|
| `/deploy-checklist` | Avant tout `git push` sur `main` — vérifier tsc + build |
| `/code-review` | Avant un merge, "review ce code", diff important à valider |
| `/debug` | Message d'erreur, stack trace, comportement inattendu |
| `/incident-response` | Site down, erreur 500, déploiement cassé |
| `/architecture` | Choix technologique, décision de design, nouveau composant structurant |
| `/testing-strategy` | Nouvelle feature, "comment tester ça", couverture manquante |
| `/tech-debt` | Code legacy à refactoriser, "c'est sale", backlog technique |
| `/documentation` | README, runbook, doc API à créer ou mettre à jour |
| `/system-design` | Architecture service, conception API, système distribué |
| `/standup` | "Fais-moi un standup", résumé des commits récents |
| `/karpathy-guidelines` | Avant toute implémentation — vérifier les 4 principes |

**Règle** : si une demande correspond à l'une de ces catégories, invoquer le skill correspondant automatiquement, sans attendre que l'utilisateur tape `/nom-du-skill`.

---

## Plugins désactivés — suggestion d'activation

Certains plugins sont désactivés par défaut pour économiser les tokens. Si une question porterait clairement bénéfice d'un skill désactivé, **demander avant de répondre** :

> 💡 *"Cette demande bénéficierait du skill `/[nom]` (plugin `[plugin]` actuellement désactivé). Veux-tu que je l'active pour cette session ? (`claude plugin enable [plugin]`)"*

### Plugins désactivés et leurs skills

#### `taste-skill@taste-skill` — design premium (~1 103 tok always-on)
Suggérer d'activer si la demande porte sur :
- Direction artistique globale → `/taste-skill`
- Cohérence de marque / brand kit → `/brandkit`
- Assemblage multi-sections → `/stitch-skill`
- Style minimaliste → `/minimalist-skill`
- Style brutaliste → `/brutalist-skill`
- Génération d'image de référence design → `/imagegen-frontend-web`, `/imagegen-frontend-mobile`

*(Ne pas suggérer pour `/soft-skill` et `/redesign-skill` — déjà disponibles en local.)*

#### `marketing-skills@marketingskills` — marketing complet (~7 340 tok always-on)
Suggérer d'activer si la demande porte sur :
- Newsletter ou campagne email → `/emails`
- Test A/B → `/ab-testing`
- Plan éditorial, calendrier de contenu → `/content-strategy`
- Lancement atelier/service → `/launch`
- Stratégie de partenariat → `/co-marketing`
- Tarification, stratégie de dons → `/pricing`
- Email de prospection professionnels → `/cold-email`
- Programme de recommandation → `/referrals`
- Relations presse, partenariats locaux → `/public-relations`
- Stratégie communautaire → `/community-marketing`
- Plan marketing global → `/marketing-plan`
- Psychologie de la persuasion → `/marketing-psychology`
- Analyse concurrentielle → `/competitors`

*(Ne pas suggérer pour `/copywriting`, `/cro`, `/social`, `/seo-audit`, `/ai-seo` — déjà disponibles en local.)*

### Règles de suggestion
1. **Une seule suggestion par réponse** — ne pas proposer d'activer les deux plugins en même temps
2. **Suggérer, ne pas forcer** — si l'utilisateur refuse ou ignore, répondre sans le skill
3. **Économie d'abord** — si un skill local couvre 80% du besoin, ne pas suggérer le plugin
4. **Clarifier le bénéfice** — expliquer en une phrase pourquoi ce skill aiderait

---

## Principes de développement (Karpathy Guidelines)

> Guidelines dérivées des observations d'Andrej Karpathy sur les erreurs courantes des LLMs en développement.

### 1. Réfléchir avant de coder
- Formuler les hypothèses explicitement — si incertain, demander plutôt que supposer
- Si plusieurs interprétations existent, les présenter — ne pas choisir en silence
- Si une approche plus simple existe, le dire
- Si quelque chose est flou, s'arrêter et demander

### 2. Simplicité d'abord
- Le minimum de code qui résout le problème — rien de spéculatif
- Pas de features au-delà de ce qui a été demandé
- Pas d'abstractions pour du code à usage unique
- Si 200 lignes pourraient être 50, réécrire

### 3. Changements chirurgicaux
- Toucher uniquement ce qui est nécessaire
- Ne pas "améliorer" le code adjacent non concerné
- Ne pas refactoriser ce qui n'est pas cassé
- Signaler le code mort orphelin — ne pas le supprimer sans demande

### 4. Exécution orientée objectifs
- Définir des critères de succès vérifiables avant de commencer
- Pour les tâches multi-étapes, énoncer un plan avec une vérification à chaque étape
- Boucler jusqu'à vérification complète
