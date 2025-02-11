import Card from "./Card.js";
import List from "./List.js";
import Tag from "./Tag.js";

// association card/list
List.hasMany(Card, { foreignKey: "id_list", as: "card" });
Card.belongsTo(List, { foreignKey: "id_list", as: "list" });

Card.belongsToMany(Tag, {
  through: "card_has_tag",

  foreignKey: "id_card",
  otherKey: "id_tag",
  as: "card",
});

Tag.belongsToMany(Card, {
  through: "card_has_tag",

  foreignKey: "id_tag",
  otherKey: "id_card",
  as: "tag",
});
