import { Op } from "sequelize";
import { Card, CardHasTag } from "../models/index.js";
import z from "zod";
import { idParamsSchema } from "../schemas/utils.js";
import HttpError from "../utils/errors.js";

const cardController = {
  async Getcard(req, res) {
    const allCard = await Card.findAll({
      order: [["position"]],
    });
    res.json(allCard);
  },
  async GetcardId(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    console.log(id);
    const allCard = await Card.findByPk(id);
    if (!allCard) {
      throw new HttpError(404, "card not found");
    }

    res.json(allCard);
  },

  async GetcardByList(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    console.log(id);
    const allCard = await Card.findAll({
      order: [["position"]],

      where: { id_list: id },
      include: [
        {
          association: "tag",
        },
      ],
    });
    if (!allCard) {
      throw new HttpError(404, "cards not found");
    }

    res.json(allCard);
  },

  async Addcard(req, res) {
    const cardSchema = z.object({
      id_list: z.number().min(1),
      name: z.string().min(1),
      content: z.string().optional(),
      color: z.string().max(7).optional(),
      tag: z.number().int().positive().array().optional(),
    });
    const newCard = req.body;

    const test = cardSchema.safeParse(newCard);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      // do something

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
        newCard.tag.forEach(async (id, i) => {
          await CardHasTag.create({
            id_card: newCardId,
            id_tag: id,
          });
        });
      }
    }
  },
  async Modifycard(req, res) {
    const cardSchema = z.object({
      id_list: z.number().int().positive().min(1).optional(),
      name: z.string().min(1).optional(),
      content: z.string().optional(),
      color: z.string().max(7).optional(),
      tag: z.number().int().positive().array().optional(),
      position: z.number().int().positive().optional(),
    });
    const newCard = req.body;
    const { id } = idParamsSchema.parse({ id: req.params.id });
    const test = cardSchema.safeParse(newCard);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      // do something

      const positionBase = await Card.findByPk(id, {
        attributes: ["position"],
      });
      if (!positionBase) {
        throw new HttpError(404, "card not found");
      }

      const idList = await Card.findByPk(id, {
        attributes: ["id_list"],
      });

      if (
        (idList.id_list !== newCard.id_list && newCard.id_list !== undefined) ||
        ""
      ) {
        if (
          newCard.position !== positionBase.position ||
          newCard.position === undefined
        ) {
          // on vérifie si un tag n'a  pas été associé
          if (newCard.tag === undefined || "") {
            await CardHasTag.destroy({
              where: { id_card: id },
            });
          } else {
            newCard.tag.forEach(async (id, i) => {
              await CardHasTag.update({
                where: { id_card: id },
                id_tag: id,
              });
            });
          }
          if (positionBase.position > newCard.position) {
            await List.increment(
              {
                position: 1,
              },
              {
                where: {
                  position: {
                    [Op.between]: [newCard.position, positionBase.position - 1],
                  },
                  id_list: newCard.id_list,
                },
              }
            );
          } else {
            await Card.increment(
              {
                position: -1,
              },
              {
                where: {
                  position: {
                    [Op.between]: [positionBase.position + 1, newCard.position],
                  },
                  id_list: newCard.id_list,
                },
              }
            );
          }
          // on met à jour avec la nouvelle position
          const card = await Card.update(
            {
              ...newCard,
            },
            {
              where: { id: id },
              returning: true,
            }
          );
          res.json(card);
        } else {
          // on met à jour avec l'ancienne position
          await Card.update(
            {
              name: newCard.name,
              position: positionBase,
            },
            { where: { id: id } }
          );
        }
      } else {
        if (
          newCard.position !== positionBase.position ||
          newCard.position === undefined
        ) {
          // on vérifie si un tag n'a  pas été associé
          if (newCard.tag === undefined || "") {
            await CardHasTag.destroy({
              where: { id_card: id },
            });
          } else {
            newCard.tag.forEach(async (id, i) => {
              await CardHasTag.update({
                where: { id_card: id },
                id_tag: id,
              });
            });
          }
          if (positionBase.position > newCard.position) {
            await Card.increment(
              {
                position: 1,
              },
              {
                where: {
                  position: {
                    [Op.between]: [newCard.position, positionBase.position - 1],
                  },
                  id_list: idList.id_list,
                },
              }
            );
          } else {
            await List.increment(
              {
                position: -1,
              },
              {
                where: {
                  position: {
                    [Op.between]: [positionBase.position + 1, newCard.position],
                  },
                  id_list: idList.id_list,
                },
              }
            );
          }
          // on met à jour avec la nouvelle position
          const card = await Card.update(
            {
              ...newCard,
            },
            {
              where: { id: id },
              returning: true,
            }
          );
          res.json(card);
        } else {
          // on met à jour avec l'ancienne position
          await Card.update(
            {
              name: newCard.name,
              position: positionBase,
            },
            { where: { id: id } }
          );
        }
      }
    }
  },
  async Deletecard(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    const card = await Card.findByPk(id);

    // on recup la position maximale
    const maxPos = await Card.max("position", {
      where: { id_list: card.id_list },
    });
    //   on récupère la position de la liste a supp
    const positionToDel = await Card.findByPk(id, {
      attributes: ["position"],
    });
    if (!positionToDel) {
      throw new HttpError(404, "card not found");
    }
    // si la position à supp = position max
    //   alors pas besoin de réduire les position des autres liste
    if (positionToDel.position === maxPos) {
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
            position: { [Op.gt]: positionToDel.position },
          },
        }
      );
      await Card.destroy({
        where: {
          id: id,
        },
      });
    }
  },
};

export default cardController;
