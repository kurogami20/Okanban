import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/sequelize.js";

class List extends Model {}

List.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    position: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      
    },
  },
  {
    sequelize,
    tableName: "list",

    timestamps: true,

    createdAt: true,

    updatedAt: true,
  }
);

export default List;
