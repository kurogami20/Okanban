import { Card, List, Tag, CardHasTag } from "../models/index.js";

async function seedTables() {
  const lists = await List.bulkCreate(
    [
      { name: "Tâches Quotidiennes", position: 0 },
      { name: "Projets en Cours", position: 1 },
      { name: "Idées", position: 2 },
      { name: "En Attente", position: 3 },
      { name: "Terminé", position: 4 },
      { name: "Personnel", position: 5 },
      { name: "Professionnel", position: 6 },
      { name: "Courses", position: 7 },
      { name: "Lecture", position: 8 },
      { name: "Long Terme", position: 9 },
    ],
    { validate: true }
  );

  // Insert tags
  const tags = await Tag.bulkCreate(
    [
      { name: "Urgent", color: "#ab00ff" },
      { name: "Important" },
      { name: "Personnel" },
      { name: "Travail" },
      { name: "Famille" },
      { name: "Santé" },
      { name: "Loisirs" },
      { name: "Finance" },
      { name: "Formation" },
      { name: "Projet" },
    ],
    { validate: true }
  );

  // Insert cards
  const cards = await Card.bulkCreate(
    [
      {
        name: "Faire les courses",
        id_list: 1,
        content: "Acheter des fruits et légumes",
        color: "#FF5733",
        position: 0,
      },
      {
        name: "Réunion équipe",
        id_list: 1,
        content: "Préparer la présentation du projet",
        color: "#33FF57",
        position: 1,
      },
      {
        name: "Lecture livre",
        id_list: 3,
        content: "Finir le chapitre 3 du livre de développement",
        color: "#3357FF",
        position: 0,
      },
      {
        name: "Rendez-vous médecin",
        id_list: 4,
        content: "Consultation annuelle",
        color: "#FF33F6",
        position: 0,
      },
      {
        name: "Payer les factures",
        id_list: 5,
        content: "Électricité et internet",
        color: "#33FFF6",
        position: 0,
      },
      {
        name: "Appeler maman",
        id_list: 6,
        content: "Prendre des nouvelles",
        color: "#FFB533",
        position: 0,
      },
      {
        name: "Réviser SQL",
        id_list: 7,
        content: "Pratiquer les requêtes complexes",
        color: "#B533FF",
        position: 0,
      },
      {
        name: "Maintenance voiture",
        id_list: 8,
        content: "Vidange à faire",
        color: "#33FFB5",
        position: 0,
      },
      {
        name: "Plan weekend",
        id_list: 9,
        content: "Organiser sortie en famille",
        color: "#FF3333",
        position: 0,
      },
      {
        name: "Projet personnel",
        id_list: 10,
        content: "Travailler sur l'application web",
        color: "#3333FF",
        position: 0,
      },
    ],
    { validate: true }
  );

  // Insert card-tag associations
  await CardHasTag.bulkCreate(
    [
      { id_card: 1, id_tag: 1 }, // Courses - Urgent
      { id_card: 1, id_tag: 3 }, // Courses - Personnel
      { id_card: 2, id_tag: 4 }, // Réunion - Travail
      { id_card: 2, id_tag: 1 }, // Réunion - Urgent
      { id_card: 3, id_tag: 9 }, // Lecture - Formation
      { id_card: 4, id_tag: 6 }, // Rendez-vous médecin - Santé
      { id_card: 5, id_tag: 8 }, // Factures - Finance
      { id_card: 6, id_tag: 3 }, // Appeler maman - Personnel
      { id_card: 7, id_tag: 9 }, // Réviser SQL - Formation
      { id_card: 8, id_tag: 1 }, // Maintenance voiture - Urgent
    ],
    { validate: true }
  );

  // Update sequences (this is handled automatically by Sequelize)
}

seedTables();
await sequelize.close();
