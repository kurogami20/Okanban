import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/sequelize.js";

class Card extends Model {}

Card.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    id_list: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
    color: { type: DataTypes.STRING(7), defaultValue: "#353535" },
  },
  {
    sequelize,
    tableName: "card",

    timestamps: true,

    createdAt: true,

    updatedAt: true,
  }
);

export default Card;
