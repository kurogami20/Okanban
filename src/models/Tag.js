import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/sequelize.js";

class Tag extends Model {}

Tag.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false, unique: true },
    color: { type: DataTypes.STRING(7), defaultValue: "#62009d" },
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
