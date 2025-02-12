import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/sequelize.js";

class CardHasTag extends Model {}

CardHasTag.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_card: { type: DataTypes.INTEGER, allowNull: false },
    id_tag: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "card_has_tag",

    timestamps: true,

    createdAt: true,

    updatedAt: true,
  }
);

export default CardHasTag;
