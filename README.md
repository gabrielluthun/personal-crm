# personal-crm

CRM personnel de prospection et de recherche d'emploi, packagé en application de
bureau (Tauri). Il centralise les entreprises ciblées, les contacts, le suivi
des échanges, la collecte d'offres (Welcome to the Jungle) et les modèles de
premier message.

Single-user : pas d'Auth Supabase. La clé `anon` dans le bundle est le secret
d'accès à la base — ne la partage pas.

## Stack

| Couche | Technologie |
| --- | --- |
| Enveloppe desktop | Tauri v2 (Rust) |
| Frontend | Next.js 16, App Router, export statique |
| Langage | TypeScript strict |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui (Base UI), Lucide |
| Thème | next-themes |
| Données CRM | mocks (défaut) ou Supabase UUID (opt-in) |
| Secrets | trousseau OS via Rust (`keyring`) — jeton Bright Data |

## Prérequis

- Node.js 20+
- pnpm 11+
- Rust stable + [dépendances système Tauri v2](https://v2.tauri.app/start/prerequisites/)
- Projet Supabase (optionnel) pour la persistance réelle

## Démarrage

```bash
pnpm install
cp .env.local.example .env.local   # URL + anon + DATA_SOURCE

pnpm tauri:dev     # fenêtre desktop + hot reload (recommandé)
pnpm dev           # frontend seul dans le navigateur
```

Dans le navigateur : mocks Settings / job search (pas de keychain ni d'appel
Bright Data). Les commandes Rust ne s'activent que dans la fenêtre Tauri.

Après toute modification des `NEXT_PUBLIC_*`, rebuild : elles sont inlinées au
build.

## Scripts

| Script | Rôle |
| --- | --- |
| `pnpm dev` | Next.js en développement |
| `pnpm build` | Export statique dans `out/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm tauri:dev` | Application desktop (dev) |
| `pnpm tauri:build` | Bundle natif (release) |

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Recherche d'offres, sélection, import d'entreprises |
| `/entreprise/` | Table, recherche, suppression confirmée, Sheet d'édition |
| `/contact/` | Table, onglets, Dialog, statut inline, suppression confirmée |
| `/templates/` | Grille de modèles, aperçu, copie presse-papiers |
| `/settings/` | Jeton Bright Data (keychain) + test de connexion, thème |

La config Supabase n'est **pas** dans Settings : uniquement via `.env.local`.

## Données

Identifiants : UUID (`gen_random_uuid` côté Postgres, `crypto.randomUUID` en mock).

`lib/container` choisit les adaptateurs via `NEXT_PUBLIC_DATA_SOURCE` :

| Valeur | Comportement |
| --- | --- |
| absent / autre | mocks (défaut code) |
| `supabase` | entreprises, contacts, templates, interactions → Supabase |

Settings et job search : Tauri si `isTauri()`, sinon mocks navigateur.

```bash
# .env.local (voir .env.local.example)
NEXT_PUBLIC_SUPABASE_URL=https://….supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
NEXT_PUBLIC_DATA_SOURCE=supabase
```

Schéma Postgres : exécuter `script.sql` (DROP + recreate UUID, tables
`entreprises` / `contacts` / `templates` / `interactions`, RLS anon ouverte,
sans Auth). Le fichier `*.sql` est gitignoré — le garder en local.

Sans `NEXT_PUBLIC_DATA_SOURCE=supabase`, URL + anon seules ne basculent pas les
adapters.

## Organisation

```
app/                pages App Router (toutes clientes)
components/         ui/, layout/, data-table/, domaines
hooks/              état et cas d'usage
lib/domain/         types métier (UUID, interaction, Bright Data probe…)
lib/repositories/   ports + mock / supabase / tauri
lib/container/      composition des implémentations
lib/tauri/          invoke typés (secrets, jobs, bright-data, liens)
lib/supabase/       client, types, mappers
src-tauri/          Rust : secrets, search_jobs, probe Bright Data, ACL
docs/               architecture et sécurité
```

N-tier : composant → hook → port → adaptateur. Seul `lib/container` connaît les
classes concrètes.

## Pont Tauri (résumé)

| Commande | Rôle |
| --- | --- |
| `set_secret` / `has_secret` / `delete_secret` | keychain — jamais de valeur en retour |
| `search_jobs` | lit le jeton en Rust ; fixtures filtrées (MVP HTTP) |
| `test_bright_data_connection` | probe API zones actives ; token reste en Rust |

Permissions : `allow-secret-commands`, `allow-job-search`,
`allow-bright-data-probe` (+ opener HTTPS / mailto).

## Contraintes export statique

Pas de Route Handler, Middleware, Server Actions, routes dynamiques ni
optimisation d'images. Détails en `Sheet` / `Dialog`. Liens externes via
`lib/tauri/open-external.ts`.

## Sécurité

Aucun jeton Bright Data dans le bundle. Saisie dans Settings → trousseau OS.
La clé `anon` Supabase est publique par construction : adaptée uniquement à un
CRM single-user sur ta machine. Détail : [docs/security.md](docs/security.md).

Architecture : [docs/architecture.md](docs/architecture.md).

## Conventions

Règles dans `.cursor/rules/` (git, commits, TypeScript, Tauri, UI, taille des
fichiers). Résumé Cursor : `.cursorrules`.
