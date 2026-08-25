# personal-crm

CRM personnel de prospection et de recherche d'emploi, packagé en application de
bureau. Il centralise les entreprises ciblées, les contacts, le suivi des
échanges, la collecte d'offres Welcome to the Jungle et les modèles de message.

## Stack

| Couche | Technologie |
| --- | --- |
| Enveloppe desktop | Tauri v2 (Rust) |
| Frontend | Next.js 16, App Router, export statique |
| Langage | TypeScript strict |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui (Base UI), Lucide |
| Thème | next-themes |
| Données CRM | mocks (défaut) ou Supabase (opt-in) |
| Secrets | trousseau OS via Rust (`keyring`) |

## Prérequis

- Node.js 20+
- pnpm 11+
- Rust stable + dépendances système 

## Démarrage

```bash
pnpm install
cp .env.local.example .env.local   # optionnel, pour Supabase plus tard

pnpm tauri:dev     # fenêtre desktop + hot reload
pnpm dev           # frontend seul dans le navigateur (mocks)
```

Dans le navigateur, Settings et la recherche d'offres restent en mock. Les
commandes keychain / Bright Data ne s'activent que dans la fenêtre Tauri.

## Scripts

| Script | Rôle |
| --- | --- |
| `pnpm dev` | Next.js en mode développement |
| `pnpm build` | Export statique dans `out/` |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm tauri:dev` | Application desktop (dev) |
| `pnpm tauri:build` | Bundle natif (release) |

## Pages

| Route | Contenu |
| --- | --- |
| `/` | Recherche d'offres, sélection, import d'entreprises |
| `/entreprise/` | Table, recherche, édition en Sheet |
| `/contact/` | Table, onglets, édition en Dialog, statut inline |
| `/templates/` | Grille de modèles, aperçu, copie presse-papiers |
| `/settings/` | Supabase public, jeton Bright Data, thème |

## Données

Par défaut, `lib/container` branche les repositories **mock**. Pour basculer
Contact / Entreprise vers Supabase :

```bash
# .env.local
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://….supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
```

Sans `NEXT_PUBLIC_DATA_SOURCE=supabase`, les URL Supabase seules ne changent
rien (évite un crash si les tables n'existent pas encore).

## Organisation

```
app/                pages App Router (toutes clientes)
components/         ui/, layout/, data-table/, domaines
hooks/              état et cas d'usage
lib/domain/         types métier
lib/repositories/   ports + mock / supabase / tauri
lib/container/      composition des implémentations
lib/tauri/          invoke typés (secrets, jobs, liens)
src-tauri/          Rust : secrets, search_jobs, ACL
docs/               architecture et sécurité
```

N-tier : composant → hook → port → adaptateur. Seul `lib/container` connaît les
classes concrètes.

## Contraintes export statique

Pas de Route Handler, Middleware, Server Actions, routes dynamiques ni
optimisation d'images. Les détails s'ouvrent en `Sheet` / `Dialog`. Les liens
externes passent par `lib/tauri/open-external.ts`.

## Sécurité (résumé)

Aucun secret dans le bundle. Les jetons sensibles sont saisis dans Settings et
stockés dans le trousseau OS ; Rust les lit pour `search_jobs` sans jamais les
renvoyer au frontend. Détail : [docs/security.md](docs/security.md).

Architecture : [docs/architecture.md](docs/architecture.md).

## Conventions

Règles dans `.cursor/rules/` (git, commits, TypeScript, Tauri, UI, taille des
fichiers). Résumé Cursor : `.cursorrules`.
