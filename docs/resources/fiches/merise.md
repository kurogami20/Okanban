# Méthode Merise

- [Méthode Merise](#méthode-merise)
  - [Définitions](#définitions)
    - [MCD - Modèle Conceptuel de Données](#mcd---modèle-conceptuel-de-données)
    - [MLD - Modèle Logique de Données](#mld---modèle-logique-de-données)
    - [MPD - Modèle Physique de Données](#mpd---modèle-physique-de-données)
    - [En résumé](#en-résumé)
  - [Exemple](#exemple)
    - [Un problème à traiter](#un-problème-à-traiter)
    - [MCD](#mcd)
    - [MLD](#mld)
    - [MPD](#mpd)
  - [Modélisation alternative (avec `id`)](#modélisation-alternative-avec-id)

## Définitions

Le `MCD`, le `MLD` et le `MPD` sont tous des modèles utilisés dans la conception de bases de données relationnelles pour décrire différents niveaux de modélisation. Ils découlent d'une méthodologie appelée `Merise`.

### MCD - Modèle Conceptuel de Données

<details><summary>
Le MCD est l'une des premières étapes de la modélisation de base de données.
</summary>

- Il s'agit d'une **représentation abstraite des entités, des associations et des contraintes qui existent dans le domaine du problème à résoudre**.
- Le `MCD` est généralement créé à l'aide de **diagrammes entité-association (ER)** qui montrent les **entités** (objets ou concepts du monde réel), leurs **attributs** et les relations entre elles.
- Le `MCD` se concentre sur la définition des concepts sans entrer dans les détails techniques de mise en œuvre.
  
</details>

### MLD - Modèle Logique de Données

<details><summary>
Le MLD est l'étape suivante de la modélisation de base de données.
</summary>

- Il s'agit de convertir le `MCD` en une représentation plus proche de la structure d'une base de données relationnelle.
- Le MLD se concentre sur la conversion des entités, des attributs et des associations en **tables**, **colonnes** et **clés**. On utilise généralement le modèle de données relationnel (`tables`, `clés primaires`, `clés étrangères`, etc.) pour représenter le `MLD`.
- C'est à ce stade que des décisions sur la normalisation et la dénormalisation sont prises pour optimiser la structure de la base de données.

</details>

### MPD - Modèle Physique de Données

<details><summary>
Le MPD est la dernière étape de la modélisation de base de données.
</summary>

Il s'agit de traduire le `MLD` en une représentation spécifique au système de gestion de base de données (`SGBD`) choisi.

- Cela implique de définir les **types de données**, les **index**, les **contraintes d'intégrité** et d'autres détails techniques nécessaires pour mettre en œuvre efficacement la base de données sur un SGBD particulier.
- Le MPD détermine comment les données sont stockées physiquement sur le disque et comment elles sont accessibles.

</details>

### En résumé

- le `MCD` est un modèle abstrait des concepts et des associations.
- le `MLD` est une représentation plus structurée en utilisant des tables et des clés
- le `MPD` est la mise en œuvre concrète du modèle dans un SGBD spécifique avec des détails techniques.

## Exemple

### Un problème à traiter

Un roboticien a besoin d'un système pour gérer son parc de robots.

- Le parc est composé de plusieurs **robots** qui portent chacun une référence (unique au monde), un nom d'usage, une date de fabrication.
- Les robots passent par différents **ateliers** pour leur maintenance. Un atelier porte un nom (unique), est situé dans une section du parc, et possède un code couleur.
- Dans chaque atelier, on retrouve des **outils** de maintenance. Un outil porte un nom, un code barre, une taille, un prix. Un outil ne peut pas se trouver dans deux ateliers à la fois, et les ateliers ne s'échangent pas les outils.

<details><summary>
Exemples de données pour le problème
</summary>

- Le robot `TKTMOCHI42` surnommé `Rigatonik` (2011) doit passer par les ateliers `Montage` (section `B9`), `Lustrage` (`B42`), `Déboulonnage` (`B42`) pour être réparé.
- L'atelier `Montage` utilise une :
  - une clé à molette taille 35mm acheté 17€
  - un lubrifiant WD40 acheté 10€
- L'atelier `Lustrage` utilise :
  - un tampon de polissage 3m acheté 40€
  - un lubrifiant WD40 acheté 9.5€

</details>

### MCD

![mcd](./mocodo/MCD.png)

<details><summary>
Notes et explications
</summary>

- Les **entités** sont : `Robot`, `Atelier`, `Outil`.
  - on les note généralement au singulier et en langue naturelle.

- Les **attributs** d'un robot sont : `reference`, `nom d'usage`, `date de fabrication`
  - on les note également en langue naturelle.

- Les **discriminants** sont soulignés.
  - ils caractérisent de manière unique une entité. À noter ici :
    - l'énoncé ne fournit pas de discriminant pour un `outil` (car on peut avoir 2 lubrifiants WD40 qui ont certes la même référence, mais un pour chaque atelier). On doit donc rajouter un déterminant artificiellement : `code outil`.
    - de même, **il arrive régulièrement d'ajouter artificiellement un `code robot` et `code atelier` comme discriminent pour les autres tables, par cohérence et simplification.**

- Les **associations** et leurs **cardinalités** sont notées entre deux entités.
  - les cardinalités précisent la nature de l'association. Il existe 3 types d'associations :
    - `One-to-One`
    - `One-to-Many`
    - `Many-to-Many`
  - les cardinalités possibles, de part et d'autres de l'association, possibles sont :
    - `(0,1)` : _un chimiste a entre 0 et 1 élève_
    - `(0,N)` : _un chimiste a entre 0 et N élèves_
    - `(1,1)` : _un chimiste a 1 et 1 seul élève_ (cette cardinalité est plus rarement croisée en pratique)
    - `(1,N)` : _un chimiste a au moins 1 élève_

</details>

<details><summary>
Lecture des associations et cardinalités
</summary>

Pour connaître le type d'association entre 2 ententités on utilise les cardinalité maximum de chaque côté. Ainsi une association `1N <--> 01` donnera une association `1N` (One-to-Many)

```text
ROBOT ---0,N--- [Maintient] ---0,N--- ATELIER
           ^^^                    ^^^
            ici, max(0,N) = N      ici, max(0,N) = N     --> C'est donc une relation N-N : Many-To-Many

Lecture de droite à gauche : "un robot est maintenu par entre 0 et N ateliers".
Lecture de gauche à droite : "un atelier maintient entre 0 et N robots".
```
  
```text
ATELIER ---0,N--- [Appartient] ---1,1--- OUTIL
           ^^^                    ^^^
            ici, max(0,N) = N      ici, max(1,1) = 1     --> C'est donc une relation 1-N : One-To-Many

Lecture de droite à gauche : "un atelier possède entre 0 et N outils".
Lecture de gauche à droite : "un outil appartient à 1 et 1 seul atelier".
```
  
</details>

<details><summary>
Avertissements et ouverture
</summary>
  
Le MCD est un exercice "académico-franco-français". Il faut donc être rigoureux sur :

- son vocabulaire (`entité`, `attributs`, `discriminants`, `association`, `cardinalité`)
- ce qui y figure et comment (`rectangle` pour les entités, `arrondi` pour les associations, cardinalités de part et d'autre de l'association...)
- ce qui n'y figure pas (pas d'`ID`, pas de `clé étrangère`, pas de `tables de liaison`, pas de `type` de données, pas d'éléments spécifiques à un système de gestion de base de données...)

</details>

### MLD

[Version texte]

- **ATELIER** (<ins>nom</ins>, section, couleur)
- **MAINTIENT** (<ins>_#référence_</ins>, <ins>_#nom_</ins>)
- **OUTIL** (<ins>code outil</ins>, description, gtin-13, prix, _#nom_)
- **ROBOT** (<ins>référence</ins>, nom d'usage, date de fabrication)

<details><summary>
Notes et explications
</summary>

- Le MLD est un exercice moins académique.
  - une version textuelle ou graphique fera très bien l'affaire.
  - il n'y a pas de conventions strictes sur la représentation des clés primaires et étrangères.
  - le MLD n'étant pas spécifique à un SGBD particulier, on ne précise normalement pas les types de données (`TEXT`, `DATE`, `INTEGER`...). Mais il arrive de les croiser sur certains MLD : restez ouvert donc !

- Le MLD est un exercice de transformation :
  - les entités deviennent des `tables`, on transforme les noms en `snake_case
  - les attributs deviennent des `champs` (ou `colonnes`), on transforme les noms en `snake_case
  - Les discriminants deviennent des clé primaires simple ou composites (il est également possible à ce stade d'ajouter des clés primaires simple en colonne id. Dans ce cas on on prendra soin de supprimer les "code …" inutiles)
  - les cardinalités se traduisent :
    - par des `clés étrangères` (d'une table) qui pointent vers la clé étrangère (d'une autre table)
    - et/ou par des `tables de liaison`, via le même méchanisme, détaillé ensuite.
  
</details>

<details><summary>
Règles de traduction des associations
</summary>

Selon le type d'association, il **suffit** de traduire de la manière suivante.

- `One-To-One` : **il suffit d'ajouter un champ sur une des deux tables**.
  - il est rare de devoir traduire une association One-To-One, car on modélise généralement et directement par un attribut (scalaire) dans le MCD.
  - il peut-être intéressant dans le cas ou l'on veut séparer les informations pour améliorer les performance de la gestion d'information. Où si la relation peut évoluer. (Par exemple la possession d'un vehicule par une personne. Cette personne peut la céder à une autre)

- `One-To-Many` : **il suffit d'ajouter une clé étrangère qui pointe vers la clé primaire de l'autre table**.
  - note : on rajoute la clé étrangère côté où la cardinalité max vaut 1.
  - exemple : _un chat appartient a 1 et 1 seul chenil, chenil qui accueille entre 0 et N chats_, on rajoute donc un `#nom chenil` sur la table des `CHAT`, qui pointe vers le champ  `nom` de la table `CHENIL`.
  
- `Many-To-Many` : **il suffit d'ajouter une table de liaison qui porte 2 clés étrangères vers les tables initiales**.
  - note : il faut donner un nom explicite à la table de liaison pour faciliter la maintenance du système.
  - exemple : _un élève peut avoir plusieurs profs, un prof peut avoir plusieurs élèves_ , on créé donc la table `AFFECTATION` (ou simplement `PROF_ETUDIANTS`) de la manière suivante : `AFFECTATION : #nom etudiant, #nom prof`
  
</details>
  
<details><summary>
Explications des autres champs
</summary>

- On souligne la clé primaire de chaque table.
- On précise les clés étrangères et vers quelle table elles pointent. Ici, le champ `#nom` pointe vers le champ `nom` (clé primaire) de la table `atelier`.
- `#référence` et `#nom` de la table d'association `MAINTIENT` sont une clé primaire composite
  
</details>

### MPD

On choisit le SGBD qui va accueillir les données, par exemple `PostgreSQL`, et on traduit techniquement le MLD.

A ce stade on prendra soin, si cela n'est pas le cas dans le MLD de traduire en `anglais` tous les noms des `tables` et des `champs`, et de les transformer en `snake_case`

```sql
CREATE TABLE robot (
  reference TEXT NOT NULL PRIMARY KEY,
  -- Il est important d'ajouter la contrainte not null, car la 2 valeurs null de déclencheront pas de souci d'insertion
  name TEXT NOT NULL,
  manufactoring_date DATE NOT NULL
);

CREATE TABLE workshop (
  name TEXT NOT NULL PRIMARY KEY,
  section TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE tool (
  id INT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  gtin13 TEXT NOT NULL,
  price DECIMAL(15, 4) NOT NULL,
  workshop_name TEXT NOT NULL REFERENCES workshop(name) -- Clé étrangère : assure la cohérence et l'intégrité de la BDD. On ne peut pas insérer un workshop_name qui n'existe pas dans la table workshop
  -- Vu que la cardinalité minimum entre OUTIL et ATELIER est 1, il faut ajouter la contrainte NOT NULL à la référence
);

CREATE TABLE robot_workshop_assignation (
  robot_reference TEXT REFERENCES robot(reference),
  workshop_name TEXT REFERENCES workshop(name),
  PRIMARY KEY ( robot_reference, workshop_name) -- Clé primaire sur deux champs.
);
```

<details><summary>
Format alternatif (sans script)
</summary>
  
On peut très bien exposer le MPD sans pour autant écrire le script SQL, par exemple. Mais c'est plus fastidieux.

**[robot]**

| Champ | type | clé primaire | clé étrangère | contraintes | notes  |
| -- | -- | -- | -- | -- | -- |
| reference | TEXT | ✅ | | unique, not null | la référence unique d'un robot |
| name | TEXT | | | not null | le surnom donné par l'entreprise au robot |
| manufactoring_date | DATE | | | not null | la date de fabrication du robot |

**[workshop]**

| Champ | type | clé primaire | clé étrangère | contraintes | notes  |
| -- | -- | -- | -- | -- | -- |
| name | TEXT | ✅ | | unique, not null | le nom unique d'un atelier |
| section | TEXT | | | not null | la section de l'atelier |
| color | TEXT |  | | not null | la code couleur de l'atelier |

**[tool]**

| Champ | type | clé primaire | clé étrangère | contraintes | notes  |
| -- | -- | -- | -- | -- | -- |
| id | INTEGER | ✅ | | unique, not null | l'identifiant de l'outil |
| name | TEXT | | | not null | le nom de l'outil |
| gtin13 | TEXT | | | not null | Le code barre de l'outil |
| price | DECIMAL | | | not null | Le prix de l'outil |
| workshop_name | TEXT | | ✅ | not null | La clé étrangère qui relie un outil a une atelier |

**[robot_workshop_assignation]**

| Champ | type | clé primaire | clé étrangère | contraintes | notes  |
| -- | -- | -- | -- | -- | -- |
| robot_reference | TEXT | ✅ | ✅ | not null | La clé étrangère qui relie à une robot |
| workshop_name | TEXT | ✅ | ✅ | not null | La clé étrangère qui relie à un atelier |
</details>


## Modélisation alternative (avec `id`)

Il arrive très régulièrement **d'ajouter, pour toutes les entités/tables, des `code entité` (MCD), qui se traduisent en `id` (MLD)**, pour toutes les entités/tables, par cohérence et simplicité. C'est peut-être l'approche la plus courante.


<details><summary>
MPD (et quelques bonus)
</summary>

```sql
CREATE TABLE robot (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  -- ici pas la peine d'ajouter le contrainte NOT NULL car l'ajout de valeur est gérer par le SGBD lui-même
  reference TEXT NOT NULL UNIQUE,
  -- comme c'est l'id qui devient la clé primaire on ajoute une contrainte unique à la colonen refence afin de conserver le discriminant du MCD
  name TEXT NOT NULL,
  manufactoring_date DATE NOT NULL
);

CREATE TABLE workshop (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  section TEXT,
  color VARCHAR(7)
);

CREATE TABLE tool (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  gtin13 TEXT NOT NULL,
  price DECIMAL(15,4),
  workshop_id INT NOT NULL REFERENCES workshop(id)
);

CREATE TABLE robot_workshop_assignation (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  robot_id INT NOT NULL REFERENCES robot(id),
  workshop_id INT NOT NULL REFERENCES workshop(id),
  UNIQUE (robot_id, workshop_id) -- Contrainte d'unicité sur deux champs.
);
```
  
</details>