BEGIN;

-- Insertion des listes
INSERT INTO "list" ("name") VALUES
('Projets en cours'),
('À faire'),
('En attente'),
('En développement'),
('Tests'),
('Documentation'),
('Maintenance'),
('Idées'),
('Archivé'),
('Urgent');

-- Insertion des cartes
INSERT INTO "card" ("name", "id_list", "color") VALUES
('Mise à jour du site web', 1, '#FF5733'),
('Correction de bugs', 2, '#33FF57'),
('Réunion client', 3, '#3357FF'),
('Développement API', 4, '#FF33F6'),
('Tests unitaires', 5, '#33FFF6'),
('Rédaction documentation', 6, '#F6FF33'),
('Optimisation base de données', 7, '#FF8033'),
('Brainstorming nouvelles fonctionnalités', 8, '#33FF80'),
('Ancien projet X', 9, '#8033FF'),
('Problème critique serveur', 10, '#FF3333');

-- Insertion des tags
INSERT INTO "tag" ("name") VALUES
('Urgent'),
('Bug'),
('Feature'),
('Documentation'),
('Backend'),
('Frontend'),
('Design'),
('Testing'),
('Performance'),
('Security');

-- Association des tags aux cartes
INSERT INTO "card_has_tag" ("id_card", "id_tag") VALUES
(1, 6), -- Mise à jour du site web - Frontend
(1, 7), -- Mise à jour du site web - Design
(2, 2), -- Correction de bugs - Bug
(2, 1), -- Correction de bugs - Urgent
(3, 3), -- Réunion client - Feature
(4, 5), -- Développement API - Backend
(5, 8), -- Tests unitaires - Testing
(6, 4), -- Rédaction documentation - Documentation
(7, 9), -- Optimisation base de données - Performance
(8, 3), -- Brainstorming - Feature
(9, 4), -- Ancien projet X - Documentation
(10, 1), -- Problème critique - Urgent
(10, 10); -- Problème critique - Security

COMMIT;


BEGIN;

-- Note : Postgres, avec le fait d'ajouter IDENTITY BY DEFAULT au lieu de ALWAYS, ne met pas à jour le curseur de l'incrément de la séquence de façon implicite !
-- Il faut donc mettre à jour la valeur courante de chacune des séquences en séléctionnant l'id maximum de chaque table une fois le seeding terminé.
SELECT setval('list_id_seq', (SELECT MAX(id) from "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) from "card"));
SELECT setval('tag_id_seq', (SELECT MAX(id) from "tag"));


COMMIT;