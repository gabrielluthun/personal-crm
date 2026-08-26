# Personal CRM

Application de bureau pour **organiser sa prospection** et sa **recherche
d’emploi** : entreprises ciblées, contacts, messages types, et découverte
d’offres via Welcome to the Jungle.

Le CRM s’appuie sur **Bright Data**, un service cloud de collecte web
(proxy / SERP / scrape d’URL publiques).

Ici, on l’utilise surtout pour interroger des sources Internet
actualisées en temps réel depuis l’app desktop :

Requêtes → pages Welcome to the Jungle → propositions d’entreprises
(site web, page LinkedIn société).

Le jeton API reste dans le trousseau OS ; seuls les résultats métier
remontent à l’interface.

Ce n’est **pas** une collecte de profils LinkedIn, ni une API sociale :
le free plan Bright Data sert au SERP et au scrape d’URL publiques
uniquement.

## Ce qu'il est possible de faire

**Dashboard** — cherche des offres (mots-clés + ville), regarde les
entreprises proposées, importe celles qui t’intéressent dans le CRM.

**Entreprises** — liste filtrable, fiche latérale, liens LinkedIn / site /
WTTJ (icônes + filtres « Avec / Tous »).

**Contacts** — pipeline de suivi (À contacter → En discussion → …), fiche
avec téléphone, WhatsApp, URL LinkedIn, date de dernier message, notes,
et canaux déjà utilisés (dérivés des interactions).

**Templates** — modèles de messages avec pastilles
(`Prénom`, `Entreprise`, `Role`…) qui insèrent `{{first_name}}`,
`{{company_name}}`, etc.

**Settings** — saisie du jeton Bright Data (coffre du système) + test de
connexion.

## Stack


| Couche           | Techno                                                      |
| ---------------- | ----------------------------------------------------------- |
| Shell desktop    | **Tauri v2** (Rust)                                         |
| UI               | **Next.js 16** (App Router, export statique) + **React 19** |
| Styles           | **Tailwind CSS v4** + **shadcn/ui** (Base UI)               |
| Langage front    | **TypeScript** (strict)                                     |
| Données CRM      | **Supabase** (Postgres) ou mocks en mémoire                 |
| Secrets          | Trousseau OS via **keyring natif** de l'OS                  |
| Recherche offres | **Bright Data** SERP API (desktop uniquement)               |
| Package manager  | **pnpm** 11                                                 |


Le frontend est un site statique servi par Tauri (`output: 'export'`).
Pas de Route Handlers, pas de Server Actions, pas de middleware Next.

## Prérequis

- Node **20+**
- pnpm **11+**
- Rust + [dépendances système Tauri](https://v2.tauri.app/start/prerequisites/)
- (Optionnel) projet Supabase
- (Optionnel) compte Bright Data avec une zone **SERP** active

## Démarrage rapide

```bash
pnpm install
cp .env.local.example .env.local
pnpm tauri:dev
```

Sans rien configurer de plus : l’UI démarre avec des **données d’exemple**
en mémoire. Tu peux explorer toutes les pages tout de suite.


| Commande           | Effet                                       |
| ------------------ | ------------------------------------------- |
| `pnpm tauri:dev`   | App desktop (keychain + SERP si configurés) |
| `pnpm tauri:build` | Build du paquet natif                       |
| `pnpm dev`         | UI dans le navigateur (mocks uniquement)    |
| `pnpm typecheck`   | `tsc --noEmit`                              |
| `pnpm lint`        | ESLint                                      |


## Mode navigateur vs desktop

`pnpm dev` sert à itérer sur l’UI. Dans ce mode :

- pas de trousseau OS
- pas d’appels Bright Data réels
- recherche d’offres = fixtures TypeScript

La production, c’est `pnpm tauri:dev` / `pnpm tauri:build`.

## Brancher Supabase (données persistantes)

1. Crée un projet Supabase.
2. Ouvre le SQL Editor et colle le contenu de `script.sql`
  (fichier local, souvent ignoré par git).
   Attention : le script est un **recreate destructif**
   (`DROP` + recreate).
3. Renseigne `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…
NEXT_PUBLIC_DATA_SOURCE=supabase
```

1. Relance / rebuild : les variables `NEXT_PUBLIC_*` sont **inlinées au
  build**. Un changement d’env sans rebuild ne suffit pas en desktop.

Sans `NEXT_PUBLIC_DATA_SOURCE=supabase`, le CRM reste en mocks même si
l’URL Supabase est renseignée (opt-in volontaire).

## Brancher Bright Data (recherche réelle)

1. Dans l’app : **Settings** → colle ton jeton API → enregistrer
  (stockage dans le trousseau du Mac / Linux / Windows).
2. Clique **Tester la connexion** : tu dois voir des zones actives.
3. Sur le compte Bright Data, active une zone de type **SERP**
  (ex. `serp_api1`). Unlocker / Browser seuls ne suffisent pas pour
   la recherche Google du dashboard.
4. Relance une recherche depuis le Dashboard en desktop.

Le jeton **ne circule jamais** vers le frontend : seuls Rust et le
keychain le voient.

## Parcours type (utilisateur)

1. Settings → jeton Bright Data + probe OK.
2. Dashboard → Ville + domaine / mots-clés → Valider.
3. Coche les entreprises intéressantes → Ajouter la sélection.
4. Entreprise → complète notes / URLs si besoin.
5. Contact → crée un contact lié, mets le statut, renseigne WhatsApp /
  téléphone / LinkedIn.
6. Templates → prépare un icebreaker avec les pastilles.
7. Au fil des échanges, mets à jour le statut et la date du dernier
  message.

## Sécurité (en bref)

- **Bright Data** : trousseau OS, jamais dans `.env` ni dans le JS packagé.
- **Supabase** : seule la clé `anon` est dans le bundle. Ici la RLS
`anon` est ouverte (single-user) → traite cette clé comme un mot de
passe de ta base. Ne la committe pas, ne la publie pas.
- Pas de `service_role` dans l’app.
- Liens externes : ouverts hors webview (plugin opener), pas via
`target="_blank"`.

Détail : [docs/security.md](docs/security.md).

## Architecture (dev)

Découpage N-tier : UI → hooks → ports → repositories (mock / Supabase /
Tauri), composé dans `lib/container`.

Détail : [docs/architecture.md](docs/architecture.md).

## Git (équipe / solo)

- `main` = production (ne pas committer dessus).
- `develop` = intégration.
- Une feature = branche `feat/…` ou `chore/…`, un fichier modifié =
un commit (Conventional Commits, messages en anglais).

## Limites actuelles

- Recherche : pipeline SERP étapes 1–4 (offres WTTJ + enrichissement
entreprise). Pas d’enrichissement de profils LinkedIn personnes.
- Free plan Bright Data : SERP + scrape d’URL publiques, pas d’API
sociales LinkedIn.
- Single-user volontaire : pas d’auth multi-comptes.

