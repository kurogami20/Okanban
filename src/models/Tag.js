import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/connect.js";

class Tag extends Model {}

Tag.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    color: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "tag",

    timestamps: true,

    createdAt: true,

    updatedAt: true,
  }
);

export default Tag;
