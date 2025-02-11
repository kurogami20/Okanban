import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/connect.js";

class Tag extends Model {}

Tag.init(
  {
    name: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "tag",
  }
);

export default Tag;
