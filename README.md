# Personal CRM

CRM perso de prospection / recherche d'emploi (app de bureau Tauri).
Single-user, pas d'auth dans l'app.

## Lancer

Prérequis : Node 20+, pnpm 11+, Rust + [deps Tauri](https://v2.tauri.app/start/prerequisites/).

```bash
pnpm install
cp .env.local.example .env.local
pnpm tauri:dev      # app desktop
pnpm tauri:build    # paquet natif
pnpm dev            # UI navigateur seulement (pas de keychain / Bright Data réel)
```

## Config

- **Bright Data** : jeton API dans Settings (keychain). Recherche dashboard =
  SERP réel en desktop (`pnpm tauri:dev`). Prérequis : une zone **SERP** active
  sur le compte Bright Data. Navigateur (`pnpm dev`) = fixtures uniquement.
- **Supabase** : uniquement via `.env.local`. 

```bash
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
NEXT_PUBLIC_DATA_SOURCE=supabase
```

Sans `DATA_SOURCE=supabase` : données d'exemple en mémoire.
Schéma : exécuter `script.sql` dans Supabase (recreate destructif).
Rebuild / relance après toute modif des `NEXT_PUBLIC_*`.

## Sécurité

- Jeton Bright Data = keychain, jamais dans le bundle.
- Clé anon Supabase = accès total à ta base dans ce mode : ne pas la publier.

[docs/security.md](docs/security.md) · [docs/architecture.md](docs/architecture.md)
