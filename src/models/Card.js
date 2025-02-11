import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/connect.js";

class Card extends Model {}

Card.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    id_list: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT },
    position: { type: DataTypes.INTEGER },
    color: { type: DataTypes.TEXT },
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
