# Plan : Désactiver la surveillance automatique (Project Monitoring)

## Objectif
Réduire la consommation de crédits en désactivant les scans automatiques de Project Monitoring sur le projet LePhare.

## Contexte
Hier, le projet a consommé ~0,70 crédit pour Project Monitoring (scans de santé/sécurité en arrière-plan), sans action de l'utilisateur. L'utilisateur confirme vouloir désactiver cette surveillance.

## Étapes

1. **Vérifier l'état actuel**
   - Lister les findings pending du Project Monitoring pour avoir une vue avant désactivation.

2. **Désactiver Project Monitoring**
   - Aucun outil API/MCP n'est disponible pour couper la surveillance automatique.
   - La désactivation doit être faite manuellement depuis l'interface Lovable :
     - Ouvrir **More > Project Monitoring** (ou **Paramètres > Project Monitoring**)
     - Désactiver l'option de surveillance automatique / scans automatiques
   - Si l'interface ne propose pas de toggle, signaler à l'utilisateur la procédure exacte à suivre.

3. **Confirmer et informer**
   - Vérifier après désactivation qu'aucun nouveau scan n'est planifié.
   - Informer l'utilisateur de l'économie de crédits attendue (~0,70 crédit/jour).
   - Préciser l'impact : plus de détection automatique des problèmes de sécurité/performance ; les scans deviennent manuels sur demande.

## Non inclus dans ce plan
- Modification du code du site
- Suppression des findings existants
- Changement des paramètres de publication ou du backend Cloud
