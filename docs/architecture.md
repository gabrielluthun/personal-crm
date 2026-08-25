# Architecture

Personal CRM suit un découpage N-tier strict, adapté à un frontend Next.js en
export statique servi par Tauri.

## Couches

```
┌─────────────────────────────────────────────┐
│  Présentation                               │
│  app/, components/                          │
└──────────────────┬──────────────────────────┘
                   │ hooks uniquement
┌──────────────────▼──────────────────────────┐
│  Métier / orchestration                     │
│  hooks/, lib/services/                      │
└──────────────────┬──────────────────────────┘
                   │ ports (interfaces)
┌──────────────────▼──────────────────────────┐
│  Accès données                              │
│  lib/repositories/{ports,mock,supabase,tauri}│
└──────────────────┬──────────────────────────┘
                   │ compose
┌──────────────────▼──────────────────────────┐
│  Composition                                │
│  lib/container/registry.ts                  │
└─────────────────────────────────────────────┘
```

Règles :

1. Un composant n'importe jamais un repository concret.
2. Un hook dépend d'un port obtenu via le container / `RepositoryProvider`.
3. Les types du domaine vivent dans `lib/domain` et ne sont pas dupliqués.
4. Les littéraux métier (statuts, libellés) ont une source unique.

## Domaine

| Module | Rôle |
| --- | --- |
| `contact-status` | 8 statuts de prospection + libellés FR |
| `entreprise` | Cible commerciale |
| `contact` | Personne liée à une entreprise |
| `job-offer` | Résultat de recherche WTTJ-like |
| `template` | Modèle de message avec variables |
| `shared/*` | `Result`, erreurs, `Id`, timestamps |

Les opérations asynchrones renvoient `Result<T, DomainError>` plutôt que de
lancer des exceptions non typées.

## Ports

Définis dans `lib/repositories/ports/` :

| Port | Responsabilité |
| --- | --- |
| `EntreprisePort` | CRUD + liste filtrée |
| `ContactPort` | CRUD + filtre par entreprise / statut |
| `JobSearchPort` | Recherche d'offres |
| `TemplatePort` | Lecture des modèles |
| `SettingsPort` | Présence / écriture secrets + settings publics |

Les adaptateurs mock, Supabase et Tauri implémentent ces ports. Ajouter une
source = nouvel adaptateur + une branche dans `createRepositories`.

## Composition (`lib/container`)

`resolveDataSource()` lit `NEXT_PUBLIC_DATA_SOURCE` :

- défaut / absent → `mock`
- `supabase` → repositories Contact & Entreprise Supabase

Indépendamment de la source CRM :

- `isTauri()` → `TauriSettingsRepository` + `TauriJobSearchRepository`
- sinon → mocks Settings / JobSearch (navigateur)

Le frontend ne choisit jamais l'adaptateur lui-même.

## Pont Tauri

| Module TS | Commande Rust | Notes |
| --- | --- | --- |
| `lib/tauri/secrets.ts` | `set_secret`, `has_secret`, `delete_secret` | jamais de valeur en retour |
| `lib/tauri/job-search.ts` | `search_jobs` | token lu en Rust |
| `lib/tauri/open-external.ts` | plugin opener | hors webview |

Côté Rust (`src-tauri/src/`) :

- `secrets.rs` — keychain, allowlist de clés
- `job_search.rs` — fixtures MVP + point d'extension HTTP Bright Data
- `permissions/` + `capabilities/default.json` — ACL minimale

## Flux typiques

### Édition d'un contact

`ContactEditDialog` → `useContactForm` → `ContactPort.update` → mock ou
Supabase → invalidation de la ressource async dans le hook de liste.

### Recherche d'offres (desktop)

Formulaire Dashboard → `useJobSearch` → `JobSearchPort.search` → invoke
`search_jobs` → Rust lit `bright_data_token` → filtre fixtures (MVP) → DTO
camelCase → cartes UI. Le token ne traverse pas l'IPC.

### Import depuis une offre

Sélection d'offres → création d'`Entreprise` via `EntreprisePort` à partir du
nom / URLs de l'offre.

## Migration vers Supabase

1. Créer les tables alignées sur `lib/supabase/database.types.ts`.
2. Activer RLS ; n'exposer que la clé `anon` côté client.
3. Renseigner `.env.local` (URL + anon).
4. `NEXT_PUBLIC_DATA_SOURCE=supabase`.
5. Vérifier Contact / Entreprise ; Templates et JobSearch restent mock / Tauri.

Les mappers dans `lib/supabase/mappers.ts` convertissent les lignes SQL vers
les types domaine.

## Limites MVP connues

- `search_jobs` ne fait pas encore d'appel HTTP Bright Data (fixtures filtrées).
- Templates et Settings publics (URL Supabase) ne sont pas persistés côté cloud.
- Pas de sync multi-appareils hors Supabase opt-in.

## Taille des fichiers

Plafond 200 lignes (cible 150). Scinder par responsabilité : colonnes / table /
toolbar / form / dialog / hook, un module Rust par domaine de commandes.
