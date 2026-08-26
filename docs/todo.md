# Roadmap produit

Backlog priorisé pour faire progresser le CRM (note produit, pas tech).
Chaque pallier = ce qu’il manque pour gagner **0,5 point**.

État actuel estimé : **8 / 10**.


## 7,5 → 8 — La boucle d’envoi se ferme ✅

Trous corrigés :

1. **Templates** — composition + aperçu depuis la fiche contact.
2. **Interactions** — envoi enregistré ; pastilles « Canaux utilisés »
   alimentées.

Livré :

- [x] Depuis une fiche contact : choisir un template
- [x] Aperçu du message avec variables remplies
  (`Prénom`, `Entreprise`, etc.)
- [x] Copier le message (presse-papiers) en un clic
- [x] Enregistrer l’envoi (canal + date + template éventuel)
- [x] Mettre à jour la date du dernier message et le statut
  (ex. → Contacté) dans le même geste
- [x] Voir l’historique des messages sur la fiche


## 8 → 8,5 — Les relances se pilotent seules

Aujourd’hui « Relance 1 / Relance 2 » sont des étiquettes manuelles.
Les onglets Contacts sont seulement « Tous » et « En discussion ».

- [ ] Vue « À relancer » (contacts sans réponse depuis N jours)
- [ ] Suggestion de statut / template de relance adaptée
- [ ] (Optionnel) rappel discret du jour : combien de contacts
  à traiter


## 8,5 → 9 — Le volume suit

Cap actuel : ~10 entreprises, une seule source (WTTJ).

- [ ] Pagination des propositions (page suivante, ~10 entreprises
  nouvelles, sans doublons avec les pages précédentes ni avec
  la base)
- [ ] Deuxième source d’offres : Indeed (une source à la fois
  dans le formulaire)
- [ ] Champ source visible sur la proposition / l’entreprise
  importée


## 9 → 9,5 — Tu peux faire confiance à l’outil

- [ ] Export des données (contacts, entreprises, interactions)
  — CSV ou équivalent
- [ ] Premier lancement guidé : jeton Bright Data + zone SERP
  (sans devoir lire le README)
- [ ] Confirmation claire que les données sont bien persistées
  (mock vs Supabase)


## 9,5 → 10 — Quelqu’un d’autre que toi peut s’en servir

Hors scope solo immédiat ; cible « outil partageable ».

- [ ] Installeur signé + mises à jour automatiques
- [ ] Comptes / données séparées (plus de clé anon = accès total)
- [ ] Indicateurs de pipeline : taux de réponse par template,
  par source, par statut


## Hors priorité (volontairement plus tard)

- LinkedIn Emploi / scrape profils via Bright Data « Réseaux sociaux »
- JSON SERP complet (n’apporte pas de page 2)
- Fusion multi-sources dans une seule liste
- Extraction IA / prompts Bright Data
- Multi-comptes avant d’avoir fermé la boucle d’envoi
- Recherche WTTJ / Bright Data stable (pallier 7 → 7,5, hors
  de ce chantier)
