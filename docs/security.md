# Sécurité

Document de sécurité pour Personal CRM, application de bureau basée sur
Tauri et une interface web figée au build.

But : **aucun secret lisible dans le paquet installé**, peu de portes
ouvertes entre l’interface et le système, et tout ce qui touche un jeton
sensible reste côté natif (Rust).

## Hypothèses

Ce qu’on **suppose** vrai pour raisonner sur les risques :

- Tu contrôles la machine où tourne l’app.
- Quelqu’un de motivé peut ouvrir le binaire et lire le JavaScript
embarqué.

## Exigences

Ce qu’on **impose** (règles à respecter) :

- L’interface ne doit **jamais** recevoir la *valeur* d’un secret.
- Ne jamais publier ni versionner la clé anonyme Supabase : elle ouvre  
*ta* base.

## Décisions

Ce que **j'ai choisi** et implémenté :

- Usage **solo** : pas de comptes utilisateurs dans l’app.
- La clé anonyme Supabase sert de secret d’accès à la base (pas d’auth
multi-utilisateurs).
- Les appels réseau qui ont besoin d’un jeton partent du code natif,
pas de la page web.



## Ce qui ne doit jamais finir dans le paquet


| Interdit                                          | Pourquoi                                      |
| ------------------------------------------------- | --------------------------------------------- |
| Jeton Bright Data                                 | Permettrait d’utiliser ton compte de collecte |
| Clé admin Supabase (service role)                 | Accès total à la base, sans filet             |
| Secrets dans des variables « publiques » de build | Copiés en clair dans le JavaScript            |
| Mot de passe de session de l’ordinateur           | L’app ne le lit ni ne l’écrit jamais          |


**Autorisé** dans le front (donc visible dans le paquet) :

- l’adresse du projet Supabase
- la clé anonyme Supabase
- le choix mock / Supabase pour les données CRM

La clé anonyme doit être traitée comme un **mot de passe de ta base**.

Le fichier d’exemple d’environnement décrit ce contrat. Ne versionne
jamais ton vrai fichier d’environnement local.

Le script SQL du schéma ne contient pas de credentials. Mieux vaut le
garder hors du dépôt pour éviter le bruit ; ce n’est pas un secret.

## Où vit le jeton Bright Data

Ce n’est **pas** le mot de passe de connexion de ton Mac / PC.

- **Ce qui est enregistré** : le jeton API collé dans Réglages.
- **Où** : le trousseau / gestionnaire de mots de passe **de
l’ordinateur** (Keychain, Credential Manager, Secret Service…).
- **Qui le déverrouille** : ta session utilisateur (et éventuellement
Touch ID / Windows Hello), pas l’app elle-même.

Sur macOS : ouvre « Trousseau d’accès » et cherche l’entrée liée à
Personal CRM (service applicatif + nom du jeton Bright Data).

Important côté technique : la bibliothèque de trousseau doit être
compilée avec le support **natif** de chaque OS. Sinon elle bascule
silencieusement sur une mémoire temporaire : l’écran dit « enregistré »,
mais rien ne survit au redémarrage.

## Chemin d’un secret (de l’écran au réseau)

1. Tu saisis le jeton dans Réglages.
2. L’interface demande au shell natif de l’**écrire** une fois dans le
  trousseau.
3. Plus tard, seul le code Rust relit le jeton pour appeler Bright Data
  (recherche d’offres ou test de connexion).
4. L’interface ne reçoit que des **résultats métier** (liste
  d’entreprises, « connexion OK », nombre de zones…), jamais le jeton.



### Ce que l’interface a le droit de demander


| Action                          | Réponse                               |
| ------------------------------- | ------------------------------------- |
| Enregistrer le jeton            | Confirmation, sans renvoyer la valeur |
| Savoir s’il est présent         | Oui / non                             |
| L’effacer                       | Confirmation                          |
| Lancer une recherche            | Offres / entreprises                  |
| Tester la connexion Bright Data | Succès + infos non sensibles          |


Il n’existe **pas** d’action « lire le jeton ».

Seule une clé bien précise est acceptée pour le trousseau (celle du
jeton Bright Data). Toute autre clé est refusée.

## Permissions de l’application

L’app n’a qu’un jeu de droits minimal, déclarés explicitement :

- droits de base du shell Tauri
- ouverture de liens https / mailto **hors** de la fenêtre de l’app
- gestion présence / écriture / suppression du jeton
- recherche d’offres
- test de connexion Bright Data

Pas d’accès fichier large, pas d’exécution de commandes shell
arbitraires.

Ajouter une capacité = décision documentée, pas un réflexe.

## Filet de la fenêtre web (CSP)

La page embarquée ne peut parler qu’à elle-même, au pont natif, et à
Supabase en HTTPS.

Bright Data n’est **pas** joint depuis la page : tout passe par Rust.
Inutile (et déconseillé) d’ouvrir la fenêtre web vers les serveurs
Bright Data.

## Navigateur de développement vs application installée

En mode « site dans le navigateur » (itération UI) :

- le jeton n’est **pas** dans le vrai trousseau (simulation mémoire)
- la recherche d’offres est factice
- pas d’appels natifs réels

La version qui compte pour la sécurité, c’est l’**application de
bureau** packagée.

## Liens externes

Ouvrir un lien « comme un onglet » *dans* la fenêtre de l’app laisse
l’utilisateur sans barre d’adresse et sans moyen clair de revenir.

Les liens métier s’ouvrent donc dans le navigateur / l’app du système,
via le pont prévu à cet effet.

## Base Supabase (usage solo)

- Pas de login multi-utilisateurs.
- Les règles d’accès côté base sont volontairement ouvertes pour la
clé anonyme : qui a la clé a le droit de lire et modifier tes
données CRM.

Conséquences pratiques :

1. Ne versionne ni ne publie ton fichier d’environnement.
2. N’emballe jamais la clé admin (service role) dans l’app.
3. Après un changement d’adresse ou de clé publique, **reconstruis**
  l’app : ces valeurs sont figées au moment du build.



## Menaces et réponses


| Risque                                      | Réponse                                                     |
| ------------------------------------------- | ----------------------------------------------------------- |
| Quelqu’un lit le jeton dans le JavaScript   | Impossible s’il n’y est jamais ; trousseau + Rust           |
| L’interface invente une commande dangereuse | Liste blanche de permissions et de clés                     |
| Page compromise qui exfiltre des données    | Politique stricte sur ce que la page peut charger / appeler |
| Fuite dans les journaux                     | Les opérations sensibles ne journalisent pas les valeurs    |
| On croit être en prod avec des faux secrets | Le mode base réelle est un choix explicite au build         |
| Jeton Bright Data faux ou révoqué           | Test de connexion sans jamais renvoyer le jeton             |
| Clé anonyme fuitée                          | Rotation chez Supabase + rebuild                            |
| Trousseau « faux » (mémoire seule)          | Compiler avec le support natif de l’OS                      |




## En cas de fuite ou de machine compromise

**Jeton Bright Data exposé** — régénère-le chez Bright Data, efface
l’ancien dans Réglages, resaisis le nouveau.

**Clé anonyme Supabase exposée** — régénère-la dans le tableau de bord
Supabase, mets à jour ton environnement local, reconstruis l’app.

**Machine déjà sous contrôle d’un tiers** — le trousseau de *ta*
session est alors accessible. Change les jetons et la clé anonyme, et
considère la machine comme non sûre.

## Checklist avant une release

- [ ] Aucun vrai secret versionné dans le dépôt

- [ ] Les seules valeurs « publiques » embarquées sont adresse Supabase,
  clé anonyme, et mode de données

- [ ] Le trousseau est bien branché en mode natif (pas mémoire seule)

- [ ] Aucune permission large ajoutée sans justification

- [ ] Recherche et test de connexion ne renvoient jamais le jeton

- [ ] Les liens externes ne s’ouvrent pas piégés dans la fenêtre

- [ ] Build desktop testé sur ta machine



## Où regarder dans le code (optionnel)

Pour qui développe : logique trousseau et liste des clés autorisées ;
dépendances natives du trousseau ; liste des permissions de la fenêtre ;
politique de sécurité de la page ; pont front pour écrire / tester la
présence d’un secret (jamais le lire) ; exemple de fichier
d’environnement.