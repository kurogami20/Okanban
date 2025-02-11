import sequelize from "../../data/connect.js";
import { Card, List, Tag, CardHasTag } from "../models/index.js";
async function dropTables() {
  await sequelize.drop({ cascade: true });
}

dropTables();
