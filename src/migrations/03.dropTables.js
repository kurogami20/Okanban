import sequelize from "../../data/sequelize.js";
import { Card, List, Tag, CardHasTag } from "../models/index.js";
async function dropTables() {
  await sequelize.drop({ cascade: true });
}

dropTables();
