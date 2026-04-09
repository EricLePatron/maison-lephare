#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "[deploy:local] git n'est pas installé."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "[deploy:local] npm n'est pas installé."
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[deploy:local] Ce dossier n'est pas un dépôt git."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[deploy:local] Remote 'origin' absent. Configure-le d'abord :"
  echo "  git remote add origin <repo_url>"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "[deploy:local] Le dépôt a des changements non commités."
  echo "Commit ou stash avant de déployer."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "[deploy:local] Build de l'application..."
npm run build

echo "[deploy:local] Push de la branche ${CURRENT_BRANCH} vers origin..."
git push origin "$CURRENT_BRANCH"

if [[ "$CURRENT_BRANCH" != "main" ]]; then
  cat <<MSG
[deploy:local] ✅ Push terminé sur ${CURRENT_BRANCH}.
[deploy:local] ℹ️ Cette branche n'est pas main : merge la PR dans main,
puis publie en production via Lovable (Share -> Publish).
MSG
  exit 0
fi

cat <<MSG
[deploy:local] ✅ Push terminé sur main.
[deploy:local] Prochaine étape : ouvrir Lovable puis Share -> Publish
pour déclencher la publication en production.
MSG
