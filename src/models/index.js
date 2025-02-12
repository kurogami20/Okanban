import Card from "./Card.js";
import List from "./List.js";
import Tag from "./Tag.js";
import CardHasTag from "./CardHasTag.js";
import sequelize from "../../data/sequelize.js";

// association card/list
List.hasMany(Card, { foreignKey: "id_list", onDelete: "cascade", as: "card" });

Card.belongsTo(List, {
  foreignKey: { name: "id_list", allowNull: false },
  onDelete: "cascade",
  as: "list",
});

Card.belongsToMany(Tag, {
  through: CardHasTag,

  foreignKey: "id_card",
  onDelete: "cascade",
  otherKey: "id_tag",
  as: "tag",
});

Tag.belongsToMany(Card, {
  through: CardHasTag,

  foreignKey: "id_tag",
  onDelete: "cascade",
  otherKey: "id_card",
  as: "card",
});

export { Card, List, Tag, CardHasTag, sequelize };
