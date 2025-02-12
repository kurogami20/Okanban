import "dotenv/config";
import { Sequelize } from "sequelize";
// import pg from "pg";

const sequelize = new Sequelize(process.env.PG_URL, {
  define: {
    // Sequelize utilise par défaut le camelCase pour gérer la BDD
    // Ici on lui dit que l'on veut utiliser le snake_case côté BDD
    underscored: true,
  },
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
export default sequelize;
