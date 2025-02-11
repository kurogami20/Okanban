import Card from "./Card.js";
import List from "./List.js";
import Tag from "./Tag.js";

// association card/list
List.hasMany(Card, { foreignKey: "id_list", onDelete: "cascade", as: "card" });
Card.belongsTo(List, {
  foreignKey: "id_list",
  onDelete: "cascade",
  as: "list",
});

Card.belongsToMany(Tag, {
  through: "card_has_tag",

  foreignKey: "id_card",
  onDelete: "cascade",
  otherKey: "id_tag",
  as: "card",
});

Tag.belongsToMany(Card, {
  through: "card_has_tag",

  foreignKey: "id_tag",
  onDelete: "cascade",
  otherKey: "id_card",
  as: "tag",
});

export { Card, List, Tag };
