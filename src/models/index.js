import Card from "./Card.js";
import List from "./List.js";
import Tag from "./Tag.js";
import CardHasTag from "./CardHasTag.js";

// association card/list
List.hasMany(Card, { foreignKey: "id_list", onDelete: "cascade", as: "card" });
Card.belongsTo(List, {
  foreignKey: "id_list",
  onDelete: "cascade",
  as: "list",
});

Card.belongsToMany(Tag, {
  through: CardHasTag,

  foreignKey: "id_card",
  onDelete: "cascade",
  otherKey: "id_tag",
  as: "card",
});

Tag.belongsToMany(Card, {
  through: CardHasTag,

  foreignKey: "id_tag",
  onDelete: "cascade",
  otherKey: "id_card",
  as: "tag",
});

export { Card, List, Tag, CardHasTag };
