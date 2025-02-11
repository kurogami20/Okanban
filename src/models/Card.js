import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/connect.js";

class Card extends Model {}

Card.init(
  {
    name: { type: DataTypes.TEXT, allowNull: false },
    id_list: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT },
    position: { type: DataTypes.INTEGER },
    color: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "card",
  }
);

export default Card;
