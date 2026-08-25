# Sécurité

Modèle de menace et contrôles pour une application Tauri + Next.js exportée en
statique. L'objectif : aucun secret extractible du bundle, surface IPC minimale.

## Hypothèses

- L'utilisateur possède la machine ; le trousseau OS est le coffre des jetons.
- Un attaquant peut décompiler le binaire et lire le JavaScript embarqué.
- La webview ne doit jamais recevoir la valeur d'un secret.
- Les appels réseau qui nécessitent un jeton s'exécutent en Rust.

## Ce qui ne doit jamais être dans le bundle

| Interdit | Pourquoi |
| --- | --- |
| Jeton Bright Data | Permettrait l'usurpation du compte scraping |
| Service role Supabase | Contourne RLS |
| Tout secret en `NEXT_PUBLIC_*` | Inliné au build, lisible dans `out/` |

Admis côté client : URL Supabase + clé `anon` **uniquement si** des politiques
RLS strictes protègent les tables.

`.env.local.example` documente ce contrat. Les secrets runtime passent par
Settings → commandes Rust → keychain.

## Flux des secrets

```
Settings (UI)
    │  saisie du jeton
    ▼
invoke set_secret(key, value)     ← valeur traverse l'IPC une fois, en écriture
    │
    ▼
OS keychain (service com.personalcrm.app)
    │
    ▼
read_secret_internal(key)         ← Rust uniquement, pas de commande Tauri
    │
    ▼
search_jobs / futur client HTTP   ← résultat métier seulement vers le front
```

Commandes exposées au frontend :

- `set_secret` — écrit
- `has_secret` — booléen
- `delete_secret` — efface

Aucune commande `get_secret`. Allowlist de clés dans `secrets.rs`
(`bright_data_token`, `supabase_anon_key`).

## Capacités Tauri

`src-tauri/capabilities/default.json` n'accorde que :

- `core:default`
- `opener:allow-open-url` (liens externes hors webview)
- `allow-secret-commands`
- `allow-job-search`

Pas de `fs:default`, pas de `shell:allow-execute`. Chaque nouvelle commande
ajoute une permission explicite dans `src-tauri/permissions/`.

## CSP

Définie dans `tauri.conf.json`. Principes :

- `default-src 'self'`
- scripts locaux uniquement
- `connect-src` limité à `self`, IPC et `https://*.supabase.co`
- `object-src 'none'`

Toute nouvelle origine `connect-src` exige une justification (API tierce
appelée depuis la webview — à éviter si Rust peut le faire).

## Frontière navigateur vs desktop

`isTauri()` protège tout accès à `invoke`, keychain et APIs desktop. En
`pnpm dev` navigateur :

- Settings secrets → mock en mémoire
- Job search → fixtures TS
- Pas d'appel Rust

Cela évite les crashes et rappelle que le mode navigateur n'est pas le runtime
de production.

## Liens externes

Ouvrir une URL avec `target="_blank"` dans la webview piège l'utilisateur sans
barre d'adresse. Utiliser `lib/tauri/open-external.ts` (plugin opener).

## Menaces et mitigations

| Menace | Mitigation |
| --- | --- |
| Extraction du jeton depuis le JS | Jamais stocké côté front ; keychain + Rust |
| Commande IPC arbitraire | Allowlist permissions + clés |
| XSS → exfiltration | CSP stricte, pas de HTML non contrôlé |
| Fuite via logs | Les commandes ne loggent pas les valeurs |
| Confusion mock / prod | `NEXT_PUBLIC_DATA_SOURCE` opt-in explicite |

## Checklist avant release

- [ ] Aucun secret dans `.env*` commité
- [ ] `grep -R NEXT_PUBLIC_ .` ne révèle que URL / anon / data source
- [ ] Capabilities inchangées sauf besoin documenté
- [ ] `search_jobs` (ou équivalent) ne renvoie jamais le token
- [ ] Build `pnpm tauri:build` testé sur la machine cible
