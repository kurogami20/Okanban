import { Op } from "sequelize";
import { Card, CardHasTag, Tag, List } from "../models/index.js";
import z from "zod";

const cardController = {
  async Getcard(req, res) {
    try {
      const allCard = await Card.findAll({
        order: [["id_list"]],
        include: [
          {
            association: "list",
          },
          {
            association: "tag",
          },
        ],
      });
      res.json(allCard);
    } catch (error) {
      res
        .status(500)
        .send(error, console.log("Problème d'affichage des cartes"));
    }
  },
  async GetcardId(req, res) {
    const id = Number.parseInt(req.params.id);
    try {
      const allCard = await Card.findByPk(id, {
        include: [
          {
            association: "list",
          },
          {
            association: "tag",
          },
        ],
      });
      res.json(allCard);
    } catch (error) {
      res
        .status(500)
        .send(error, console.log("Problème d'affichage des cartes"));
    }
  },
  async Addcard(req, res) {
    const cardSchema = z.object({
      id_list: z.number().min(1),
      name: z.string().min(1),
      content: z.string().optional(),
      color: z.string().max(7).optional(),
      tag: z.number().optional(),
    });
    const newCard = req.body;

    const test = cardSchema.safeParse(newCard);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      // do something
      try {
        const listCardPosition = await Card.max("position", {
          where: { id_list: newCard.id_list },
        });

        await Card.create({
          ...newCard,
          position: listCardPosition + 1,
        });
        // on vérifie si un tag a été associé
        if (newCard.tag !== undefined || "") {
          const newCardId = await Card.max("id");
          //   si il y a tag on ajoute l'association
          await CardHasTag.create({
            id_card: newCardId,
            id_tag: newCard.tag,
          });
        }
      } catch (error) {
        res
          .status(500)
          .send(error, console.log("Problème d'affichage des cartes"));
      }
    }
  },
  async Modifycard(req, res) {
    const cardSchema = z.object({
      id_list: z.number().min(1),
      name: z.string().min(1),
      content: z.string().optional(),
      color: z.string().max(7).optional(),
      tag: z.number().optional(),
      position: z.number().optional(),
    });
    const newCard = req.body;
    const id = Number.parseInt(req.params.id);
    const test = cardSchema.safeParse(newCard);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      // do something
      try {
        const positionBase = await Card.findByPk(id, {
          attributes: ["position"],
        });

        if (
          newCard.position !== positionBase ||
          newCard.position === undefined
        ) {
          // on met à jour avec la nouvelle position
          await Card.update(
            {
              ...newCard,
            },
            {
              where: { id: id },
            }
          );
          // on vérifie si un tag n'a  pas été associé
          if (newCard.tag === undefined || "") {
            await CardHasTag.destroy({
              where: { id_card: id },
            });
          } else {
            await CardHasTag.update(
              {
                id_tag: newCard.tag,
              },
              {
                where: { id_card: id },
              }
            );
          }
          const listCardPosition = await Card.max("position", {
            where: { id_list: newCard.id_list },
          });
          await Card.increment(
            {
              position: 1,
            },
            {
              where: {
                position: {
                  [Op.between]: [newCard.position, listCardPosition],
                },
              },
            }
          );

          await Card.increment(
            {
              position: -1,
            },
            {
              where: {
                id: id,
              },
            }
          );
        } else {
          // on met à jour avec l'ancienne position
          await Card.update(
            {
              name,
              position: positionBase,
            },
            { where: { id: id } }
          );
        }
      } catch (error) {
        res
          .status(500)
          .send(error, console.log("Problème d'affichage des cartes"));
      }
    }
  },
  async Deletecard(req, res) {
    const id = Number.parseInt(req.params.id);
    const card = await Card.findByPk(id);
    try {
      // on recup la position maximale
      const maxPos = await Card.max("position", {
        where: { id_list: card.id_list },
      });
      //   on récupère la position de la liste a supp
      const positionToDel = await Card.findByPk(id, {
        attributes: ["position"],
      });
      // si la position à supp = position max
      //   alors pas besoin de réduire les position des autres liste
      if (positionToDel === maxPos) {
        await Card.destroy({
          where: {
            id: id,
          },
        });
      } else {
        await Card.increment(
          {
            position: -1,
          },
          {
            where: {
              id: { [Op.ne]: id },
            },
          }
        );
        await Card.destroy({
          where: {
            id: id,
          },
        });
      }
    } catch (error) {
      res
        .status(500)
        .send(error, console.log("Problème d'affichage des listes"));
    }
  },
};

export default cardController;
