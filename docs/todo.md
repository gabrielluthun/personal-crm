# Roadmap produit

Backlog priorisé pour faire progresser le CRM (note produit, pas tech).
Chaque pallier ≈ **0,5 point**.

État actuel estimé : **8,5 / 10** (relances livrées ; recherche WTTJ
de nouveau opérationnelle après incident SERP Bright Data).

## Principes (ne pas perdre de vue)

1. **La recherche est le cœur de la fiabilité** du produit.
2. **Une seule source d’offres à la fois** (WTTJ *ou* Indeed *ou* …) —
   pas de fusion multi-boards.
3. Même clé API Bright Data que le MCP Cursor ≠ même pipeline :
   le CRM reste un **pipeline fixe** (SERP → dédup → option lecture
   de fiches), pas un agent multi-outils.
4. Ne pas ajouter de filtres métier (junior, ESN…) **avant** d’avoir
   lu les fiches d’offre.


## Avant tout — figer 8,5 sur `develop`

Branche `feat/follow-up-pipeline` (onglets À relancer, suggestion
template, rappel Dashboard) : **committer + merger** si ce n’est
pas déjà dans `develop`.


## 7,5 → 8 — Boucle d’envoi ✅

- [x] Template + aperçu variables depuis la fiche contact
- [x] Copier / marquer envoyé / historique / canaux


## 8 → 8,5 — Relances ✅

- [x] Vues Tous / À relancer / En discussion
- [x] Progression de statut à l’envoi + template suggéré
- [x] Rappel Dashboard (compteur)


## 8,5 → 9 — Recherche fiable + volume (PROCHAIN)

Objectif : radar **stable** et **plus profond** sur **une** source,
sans encore cloner le MCP.

### A — Santé du tuyau SERP (court, prioritaire)

Le test Settings « jeton accepté · N zones » ne détecte pas une
SERP qui répond vide (cas du 27 août : requêtes > 0, BW = 0).

- [ ] Probe **réel** : mini-requête SERP de test depuis Settings
  (succès = JSON `organic` non vide, sans exposer le secret)
- [ ] Message d’erreur distinct : jeton OK mais SERP hors service
- [ ] (Optionnel) afficher le nom de la zone `serp` utilisée

### B — Volume WTTJ

- [x] Pagination (« page suivante », ~10 entreprises nouvelles)
- [x] Dédup session (pages déjà vues)
- [x] Dédup avec les entreprises déjà en base
- [ ] Badge / champ `source` sur proposition + à l’import

### C — Source alternative (ensuite, toujours 1 à la fois)

- [ ] Sélecteur de source dans le formulaire (WTTJ | Indeed)
- [ ] Parseur Indeed dédié (même pipeline SERP, autre `site:`)

Hors de ce pallier : scrape systématique de toutes les fiches,
filtres junior/ESN, agent multi-étapes.


## 9 → 9,5 — Confiance autour des données

- [ ] Export CSV (contacts, entreprises, interactions)
- [ ] Premier lancement guidé (jeton + zone SERP)
- [ ] Indicateur clair mock vs Supabase


## 9,5 → 10 — Outil partageable (hors scope solo immédiat)

- [ ] Installeur signé + mises à jour auto
- [ ] Comptes / données séparées (RLS)
- [ ] Indicateurs pipeline (réponse / template / source / statut)


## Après volume stable — Qualité d’offre (1 source)

Pipeline cible :

`SERP (1 source) → dédup → lire N fiches → filtrer`

- [ ] Commande Tauri « Lire l’offre » (scrape Bright Data, URL
  de la source active)
- [ ] Extraire XP / salaire / signaux utiles sur la carte
- [ ] Auto-lecture plafonnée (ex. 5) + cache par URL (coûts)
- [ ] Filtres UI (junior, etc.) **uniquement** après enrichissement

But : même **garantie métier** que le MCP (offre lue), sans
multi-sources ni raisonnement libre.


## Hors priorité

- Fusion multi-sources dans une seule liste
- LinkedIn Emploi / scrape profils « réseaux sociaux »
- Extraction IA / prompts Bright Data (jugement type chat)
- Recoller le workflow MCP Cursor tel quel dans le Dashboard
- JSON SERP « complet » (n’apporte pas la page 2 à lui seul)


## Prochain sprint concret (ordre d’exécution)

1. ~~Merger `feat/follow-up-pipeline` → `develop`~~ ✅
2. **Probe SERP réel** (Settings)
3. ~~Pagination WTTJ + dédup~~ ✅ (branche `feat/job-search-pagination`)
4. Badge `source` puis Indeed en sélecteur (1 source à la fois)
5. Puis seulement : lecture bornée de fiches
