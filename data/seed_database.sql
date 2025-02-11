BEGIN;
-- Insertion des listes
INSERT INTO "list" ("name","position") VALUES
('Tâches Quotidiennes',0),
('Projets en Cours',1),
('Idées',2),
('En Attente',3),
('Terminé',4),
('Personnel',5),
('Professionnel',6),
('Courses',7),
('Lecture',8),
('Long Terme',9);

-- Insertion des tags
INSERT INTO "tag" ("name") VALUES
('Urgent'),
('Important'),
('Personnel'),
('Travail'),
('Famille'),
('Santé'),
('Loisirs'),
('Finance'),
('Formation'),
('Projet');

-- Insertion des cartes
INSERT INTO "card" ("name", "id_list", "content", "color","position") VALUES
('Faire les courses', 1, 'Acheter des fruits et légumes', '#FF5733',0),
('Réunion équipe', 1, 'Préparer la présentation du projet', '#33FF57',1),
('Lecture livre', 3, 'Finir le chapitre 3 du livre de développement', '#3357FF',0),
('Rendez-vous médecin', 4, 'Consultation annuelle', '#FF33F6',0),
('Payer les factures', 5, 'Électricité et internet', '#33FFF6',0),
('Appeler maman', 6, 'Prendre des nouvelles', '#FFB533',0),
('Réviser SQL', 7, 'Pratiquer les requêtes complexes', '#B533FF',0),
('Maintenance voiture', 8, 'Vidange à faire', '#33FFB5',0),
('Plan weekend', 9, 'Organiser sortie en famille', '#FF3333',0),
('Projet personnel', 10, 'Travailler sur l''application web', '#3333FF',0);

-- Association des tags aux cartes
INSERT INTO "card_has_tag" ("id_card", "id_tag") VALUES
(1, 1), -- Courses - Urgent
(1, 3), -- Courses - Personnel
(2, 4), -- Réunion - Travail
(2, 1), -- Réunion - Urgent
(3, 9), -- Lecture - Formation
(4, 6), -- Rendez-vous médecin - Santé
(5, 8), -- Factures - Finance
(6, 3), -- Appeler maman - Personnel
(7, 9), -- Réviser SQL - Formation
(8, 1); -- Maintenance voiture - Urgent

COMMIT;


BEGIN;

-- Note : Postgres, avec le fait d'ajouter IDENTITY BY DEFAULT au lieu de ALWAYS, ne met pas à jour le curseur de l'incrément de la séquence de façon implicite !
-- Il faut donc mettre à jour la valeur courante de chacune des séquences en séléctionnant l'id maximum de chaque table une fois le seeding terminé.
SELECT setval('list_id_seq', (SELECT MAX(id) from "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) from "card"));
SELECT setval('tag_id_seq', (SELECT MAX(id) from "tag"));


COMMIT;