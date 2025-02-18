import { Op } from "sequelize";
import { List } from "../models/index.js";
import z from "zod";
import { idParamsSchema } from "../schemas/utils.js";
import HttpError from "../utils/errors.js";

const listController = {
  async Getlist(req, res) {
    try {
      const lists = await List.findAll({
        order: [["position"]],
      });
      res.json(lists);
    } catch (error) {
      res.status(500).send(console.log("Problème d'affichage des listes"));
    }
  },
  async GetlistId(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });

    const list = await List.findByPk(id);
    if (!list) {
      throw new HttpError(404, "list not found");
    }
    res.json(list);
  },

  async AddList(req, res) {
    const listSchema = z.object({
      name: z.string().min(1, "veuillez au moins mettre un caractère"),
      position: z.number().int().positive().optional(),
    });
    try {
      const maxPosition = await List.max("position");
      const newList = req.body;

      const zTest = listSchema.safeParse(newList);
      if (!zTest.success) {
        // handle error then return
        res.status(400).send("erreur");
      } else {
        console.log(newList.position);
        if (newList.position === undefined) {
          // do something
          await List.create({
            name: newList.name,
            position: maxPosition + 1,
          });
        } else {
          await List.increment(
            {
              position: 1,
            },
            {
              where: {
                position: {
                  [Op.gte]: newList.position,
                },
              },
            }
          );

          await List.create({
            ...newList,
          });
        }
      }
    } catch (error) {
      res.status(500).send(console.log("Problème d'affichage de la liste"));
    }
  },

  async ModifyList(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });

    const newData = req.body;

    const listSchema = z.object({
      name: z
        .string()
        .min(1, "veuillez au moins mettre un caractère")
        .optional(),
      position: z.number().int().positive().optional(),
    });

    const test = listSchema.safeParse(newData);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      const positionBase = await List.findByPk(id, {
        attributes: ["position"],
      });
      if (!positionBase && positionBase.position !== 0) {
        throw new HttpError(404, "list not found");
      }

      const { name, position } = req.body;
      console.log(position);
      if (position !== positionBase.position || position === undefined) {
        // on change la position des listes qui se retrouve "en-dessous" en ignorant
        //   la liste que je viens de ùettre à jour
        if (positionBase.position > position) {
          await List.increment(
            {
              position: 1,
            },
            {
              where: {
                position: {
                  [Op.between]: [position, positionBase.position - 1],
                },
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
                  [Op.between]: [positionBase.position + 1, position],
                },
              },
            }
          );
        }

        // on met à jour avec la nouvelle position
        const list = await List.update(
          {
            name,
            position,
          },
          { where: { id: id } },
          { returning: true }
        );
        res.json(list);
      } else {
        // on met à jour avec l'ancienne position
        await List.update(
          {
            name,
            position: positionBase,
          },
          { where: { id: id } }
        );
      }
    }
  },

  async DeleteList(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });

    // on recup la position maximale
    const maxPos = await List.max("position");
    //   on récupère la position de la liste a supp
    const positionToDel = await List.findByPk(id, {
      attributes: ["position"],
    });
    console.log(maxPos);
    console.log(positionToDel.position);
    if (!positionToDel.position && positionToDel.position !== 0) {
      throw new HttpError(404, "list not found");
    }
    // si la position à supp = position max
    //   alors pas besoin de réduire les position des autres liste
    if (positionToDel.position === maxPos) {
      await List.destroy({
        where: {
          id: id,
        },
      });
    } else {
      await List.increment(
        {
          position: -1,
        },
        {
          where: {
            position: { [Op.gt]: positionToDel.position },
          },
        }
      );
      await List.destroy({
        where: {
          id: id,
        },
      });
    }
  },
};

export default listController;
