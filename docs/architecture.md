# Architecture

Document d’architecture pour Personal CRM.

L’app est un **bureau** (coque Tauri) qui affiche une **interface web
figée au build** (Next.js en export statique).

Pas de serveur Node à l’exécution.


## Idée générale

Deux mondes, clairement séparés :

1. **Interface + métier CRM** (TypeScript) — écrans, formulaires,
   entreprises, contacts, templates. La persistance est derrière des
   contrats, pas dans les pages.

2. **Couche native** (Rust / Tauri) — fenêtre, trousseau, appels
   Bright Data, ouverture de liens hors de la fenêtre.

Rust intervient dès qu’il faut un **secret** ou le **système d’exploitation**.


## Pourquoi un découpage en couches

Sans règles, `app/entreprise/page.tsx` importerait le client Supabase, et
le Dashboard appellerait Bright Data depuis le navigateur.

Changer de base, tester sans réseau, ou cacher le jeton API voudrait
dire retoucher chaque écran.

Ce qui se passe vraiment quand on ouvre Entreprises :

```
app/entreprise/page.tsx
        │  appelle useEntreprises()
        ▼
hooks/use-entreprises.ts
        │  appelle entreprises.list() / create() / update()
        │  (type EntreprisePort — une liste d’opérations, pas une techno)
        ▼
MockEntrepriseRepository            défaut, navigateur, démo
ou SupabaseEntrepriseRepository     si le build active Supabase
```

La page et le hook ignorent laquelle des deux classes tourne. Ils ne
voient que `list`, `create`, `update`, `delete`.

Qui instancie la bonne classe ? Un seul fichier, **une fois** au
démarrage : `lib/container/registry.ts`.

- **CRM** (entreprises, contacts, interactions, templates) : mémoire
  (mock) ou Postgres (Supabase).

- **Trousseau et Bright Data** : simulation dans le navigateur,
  commandes Rust dans l’app Tauri.

Passer des données d’exemple à une vraie base, c’est changer une
variable de build. Les pages ne bougent pas.


## Les couches

Trois étages dans l’ordre d’un clic, plus un branchement à part :

```
Présentation     app/, components/
                      │  hooks seulement
                      ▼
Orchestration    hooks/   (+ lib/services/ pour de la logique pure)
                      │  contrats = types *.port.ts
                      ▼
Accès données    lib/repositories/{mock,supabase,tauri}/
```

`lib/container/` n’est **pas** un quatrième étage dans cet
enchaînement. C’est le câblage : il choisit, au démarrage, quelles
classes brancher derrière les contrats.

Ensuite les appels descendent écran → hook → repository, sans
repasser par le container.

### Règles

1. Un composant n’importe jamais une classe `*Repository` ni le client
   Supabase.

2. Un hook obtient ses dépendances via `useRepositories()` (fourni par
   le `RepositoryProvider` du layout).

3. Les types métier vivent dans `lib/domain/` et ne sont pas recopiés
   ailleurs.

4. Les libellés métier (statuts, variables de templates…) ont **une**
   source de vérité.


## Domaine métier

Ce que l’app manipule, indépendamment du stockage :

| Concept                       | Rôle                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Statut de contact             | Pipeline de prospection (À contacter → … → Terminé)                            |
| Entreprise                    | Cible (nom, URLs LinkedIn / site / WTTJ, notes…)                               |
| Contact                       | Personne liée à une entreprise ; téléphone, WhatsApp, date de dernier message… |
| Interaction                   | Message envoyé ; sert aussi à dériver les « canaux utilisés » sur la fiche     |
| Offre / résultat de recherche | Sortie du pipeline Bright Data (dashboard)                                     |
| Template                      | Modèle de message avec variables                                               |
| Variables de template         | Pastilles FR → jetons `{{…}}` anglais                                          |
| Résultat de test Bright Data  | Connexion OK + nombre de zones, sans jeton                                     |
| Utilitaires partagés          | Résultat typé succès/erreur, identifiants UUID, horodatages                    |

Les opérations asynchrones renvoient un **résultat typé**
(succès ou erreur métier), pas une exception opaque.


## Contrats d’accès (ports)

| Contrat            | Responsabilité                                         |
| ------------------ | ------------------------------------------------------ |
| Entreprises        | Créer, lire, modifier, supprimer, lister / filtrer     |
| Contacts           | Idem + filtres statut / entreprise                     |
| Interactions       | Historique d’envois + liste par contact                |
| Templates          | CRUD des modèles                                       |
| Recherche d’offres | Lancer une recherche + tester la connexion Bright Data |
| Réglages           | Savoir si le jeton est présent, l’écrire, l’effacer    |

Derrière chaque contrat :

- **mock** — mémoire, pour le navigateur / démo

- **Supabase** — CRM persistant (entreprises, contacts, interactions,
  templates)

- **Tauri** — réglages (trousseau) + recherche d’offres (Rust)


## Composition au démarrage

Deux leviers indépendants.

**Données CRM**

- par défaut : mocks en mémoire
- Postgres seulement si `NEXT_PUBLIC_DATA_SOURCE=supabase` au build

Avoir l’URL Supabase dans l’environnement **ne suffit pas** : le mode
réel est un opt-in volontaire (évite de pointer une base vide ou
absente par accident).

**Desktop vs navigateur**

- dans l’app Tauri : trousseau OS + recherche Bright Data réelle
- dans le navigateur (`pnpm dev`) : simulations mémoire / fixtures


## Rôle de Rust

Rust ne remplace pas le CRM. Il apporte :

| Rôle     | Exemple                                                            |
| -------- | ------------------------------------------------------------------ |
| Coque    | Fenêtre, permissions, politique de la page embarquée               |
| Secrets  | Jeton Bright Data dans le trousseau OS                             |
| Collecte | SERP Google → offres WTTJ → enrichissement site / LinkedIn société |
| Liens    | Ouvrir une URL dans le navigateur du système                       |

Le jeton Bright Data est lu **uniquement** en Rust pour les appels
réseau. L’interface reçoit des listes d’entreprises ou un « test OK »,
jamais le secret.

Détail sécurité : voir [security.md](security.md).


## Contraintes imposées par l’export statique

Le front Next est compilé en fichiers HTML/JS servis par Tauri.

Donc **pas** de :

- routes API Next
- middleware Next
- Server Actions
- pages dynamiques du type `/contact/[id]`

Conséquences UI :

- toutes les pages sont clientes

- le détail d’un contact / d’une entreprise s’ouvre en **panneau latéral**
  (Sheet), pas en navigation d’URL paramétrée

- les liens externes passent par le pont natif, pas par un onglet piégé
  dans la webview


## Parcours typiques

### Éditer un contact

Panneau latéral → formulaire → contrat Contacts → mock ou Supabase.

Les pastilles de canaux viennent des interactions déjà enregistrées
pour ce contact.

### Chercher des offres (desktop)

1. Dashboard → hook de recherche → commande native.
2. Rust lit le jeton et la zone SERP.
3. Résultats Google centrés WTTJ → jusqu’à 10 entreprises
   (le nom vient du slug d’URL, pas du titre Google).
4. Enrichissement site / page LinkedIn société.
5. Propositions à l’écran → import dans Entreprises.

### Préparer un template

Liste + éditeur → pastilles en français qui insèrent des jetons
anglais dans le sujet ou le corps → enregistrement via le contrat
Templates.


## Brancher Supabase

1. Exécuter le script SQL de schéma (recreate destructif, sans Auth).

2. Renseigner l’adresse du projet, la clé anonyme, et activer le mode
   Supabase au build.

3. Reconstruire l’app : ces valeurs sont **figées** dans le JavaScript
   au moment du build.

4. Pas de login : la clé anonyme ouvre le CRUD. Ne pas la publier.

Les créations laissent souvent l’identifiant à Postgres (UUID).
Des adaptateurs convertissent les lignes SQL ↔ objets du domaine.


## Limites assumées aujourd’hui

- Recherche : étapes « offres + entreprises », pas les profils LinkedIn
  personnes.

- Bright Data free : SERP / pages publiques, pas d’API sociales.

- Champs techniques d’ingestion (payload brut, date de scrape) prêts
  mais peu remplis automatiquement.

- Un seul utilisateur volontaire : pas de multi-comptes.


## Conventions de code

- Plafond **200 lignes** par fichier (cible 150) ; scinder par
  responsabilité (colonnes, toolbar, formulaire, panneau, hook…).

- Commits : Conventional Commits en anglais, un fichier modifié =
  un commit.

- Branches : partir de `develop`, jamais committer directement sur
  `main`.


## Où regarder dans le code

| Rôle                    | Chemin                                          |
| ----------------------- | ----------------------------------------------- |
| Pages                   | `app/`                                          |
| Composants              | `components/`                                   |
| Hooks                   | `hooks/`                                        |
| Types métier            | `lib/domain/`                                   |
| Contrats                | `lib/repositories/ports/`                       |
| Mock / Supabase / Tauri | `lib/repositories/{mock,supabase,tauri}/`       |
| Câblage                 | `lib/container/registry.ts`                     |
| Pont TypeScript → Rust  | `lib/tauri/`                                    |
| Commandes natives       | `src-tauri/src/` (secrets, Bright Data, offres) |
