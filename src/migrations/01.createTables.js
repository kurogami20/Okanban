import sequelize from "../../data/connect.js";
import { Card, List, Tag } from "../models/index.js";
async function sync() {
  await sequelize.sync({ force: true });
}

sync();
