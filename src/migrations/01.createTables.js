import sequelize from "../../data/sequelize.js";
import { Card, List, Tag, CardHasTag } from "../models/index.js";
async function sync() {
  await sequelize.sync({ force: true });
}

sync();
