import sequelize from "../../data/connect.js";
import { Card, List, Tag } from "../models/index.js";
async function dropTables() {
  await sequelize.drop({ cascade: true });
}

dropTables();
