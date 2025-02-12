import { sequelize } from "../models/index.js";
async function sync() {
  await sequelize.sync({ force: true });
}

sync();

await sequelize.close();
