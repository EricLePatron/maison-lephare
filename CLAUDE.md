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
