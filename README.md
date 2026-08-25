# personal-crm

CRM personnel de prospection et de recherche d'emploi, packagé en application de
bureau. Il centralise les entreprises ciblées, les contacts approchés, l'état
d'avancement de chaque échange et les modèles de premier message.

## Stack

| Couche | Technologie |
| --- | --- |
| Enveloppe desktop | Tauri v2 (Rust) |
| Frontend | Next.js 16, App Router, export statique |
| Langage | TypeScript strict |
| Styles | Tailwind CSS v4 |
| Composants | shadcn/ui, icônes Lucide |
| Thème | next-themes |
| Données | mocks en mémoire, Supabase prévu |

## Prérequis

- Node.js 20 ou plus
- pnpm 11 ou plus
- Rust stable et les dépendances système de Tauri v2

## Démarrage

```bash
pnpm install
pnpm tauri dev     # fenêtre desktop, recharge à chaud
pnpm dev           # frontend seul dans le navigateur
```

## Build

```bash
pnpm build         # export statique dans out/
pnpm tauri build   # binaire natif dans src-tauri/target/release/
```

## Organisation

```
app/                pages App Router, toutes clientes
components/         UI : ui/ (shadcn), layout/, data-table/, <domaine>/
hooks/              logique métier et état
lib/domain/         types et invariants métier
lib/repositories/   ports et implémentations d'accès aux données
lib/container/      point de composition, choisit les implémentations
lib/tauri/          ponts typés vers les commandes Rust
src-tauri/          application Rust, commandes et capacités
```

Le découpage est N-tier strict : un composant ne parle jamais directement à une
source de données, il passe par un hook, qui dépend d'un port, qui est satisfait
par un adaptateur. Passer des mocks à Supabase se fait dans `lib/container/`.

## Contraintes de l'export statique

Tauri sert des fichiers statiques, il n'y a aucun serveur Node à l'exécution.
Route Handlers, Middleware, Server Actions, routes dynamiques et optimisation
d'images sont donc inutilisables. Les vues de détail s'ouvrent dans un `Sheet`
ou un `Dialog` plutôt que sur une route paramétrée.

## Sécurité

Aucune clé sensible n'est présente dans le bundle. Toute variable
`NEXT_PUBLIC_*` est inlinée en clair dans le JavaScript au moment du build et
reste lisible dans l'application distribuée : seule la clé `anon` Supabase,
protégée par des politiques RLS, y est admise.

Les jetons sensibles, à commencer par celui de Bright Data, sont saisis à
l'exécution dans la page Settings et stockés dans le trousseau du système par
les commandes Rust de `src-tauri/src/secrets.rs`. Aucune commande ne renvoie la
valeur d'un secret au frontend : les appels réseau qui en ont besoin sont
exécutés côté Rust.

## Conventions

Les règles de contribution sont versionnées dans `.cursor/rules/` :
workflow git, Conventional Commits, conventions TypeScript et SOLID, plafond de
200 lignes par fichier, contraintes Tauri et conventions d'interface.

Le résumé historique lu par Cursor se trouve dans `.cursorrules`.
