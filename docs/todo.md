# Roadmap produit

Backlog priorisé pour faire progresser le CRM (note produit, pas tech).
Chaque pallier ≈ **0,5 point**.

État actuel estimé : **~9 / 10** (relances + pagination + source WTTJ|Indeed).


## Principes

1. **La recherche est le cœur** du produit.
2. **Une seule source d’offres à la fois** (WTTJ *ou* Indeed) —
   pas de fusion multi-boards.
3. Pipeline CRM = SERP fixe + dédup, **pas** un agent multi-outils.


## Livré ✅

### Boucle d’envoi (7,5 → 8)

- [x] Template + aperçu + copier / marquer envoyé + historique

### Relances (8 → 8,5)

- [x] Vues Tous / À relancer / En discussion
- [x] Progression de statut + template suggéré
- [x] Rappel Dashboard

### Volume + provenance (8,5 → 9)

- [x] Pagination (« Page suivante », ~10 entreprises nouvelles)
- [x] Dédup session + entreprises déjà en base
- [x] Badge source (WTTJ / Indeed) sur les propositions
- [x] Source conservée à l’import (`rawData`)
- [x] Sélecteur WTTJ | Indeed + parseur Indeed


## Explicitement hors scope (décision produit)

Ne pas faire pour l’instant :

- Probe SERP « réel » dans Settings (jeton accepté suffit)
- Lecture / scrape de fiches d’offre
- Filtres junior / ESN
- Export CSV / onboarding guidé / indicateur mock vs Supabase
- Installeur, multi-comptes, analytics pipeline
- Fusion multi-sources, LinkedIn Emploi, extraction IA, clone MCP


## Prochain sprint

À définir (hors scope listé ci-dessus).
