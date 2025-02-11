import { DataTypes, Model } from "sequelize";
import sequelize from "../../data/connect.js";

class List extends Model {}

List.init(
  {
    name: { type: DataTypes.TEXT, allowNull: false },
    position: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    tableName: "list",
  }
);

export default List;
