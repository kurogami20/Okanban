import { Op } from "sequelize";
import { List } from "../models/index.js";
import z from "zod";
import { idParamsSchema } from "../schemas/utils.js";

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
    });
    try {
      const list = await List.max("id");
      const newList = req.body;

      const zTest = listSchema.safeParse(newList);
      if (!zTest.success) {
        // handle error then return
        res.status(400).send("erreur");
        console.log(zTest.error);
      } else {
        // do something
        await List.create({
          name: newList.name,
          position: list + 1,
        });
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
      if (!positionBase) {
        throw new HttpError(404, "list not found");
      }

      const { name, position } = req.body;
      console.log(position);
      if (position !== positionBase || position === undefined) {
        // on met à jour avec la nouvelle position
        const list = await List.update(
          {
            name,
            position,
          },
          { where: { id: id } },
          { returning: true }
        );
        // on change la position des listes qui se retrouve "en-dessous" en ignorant
        //   la liste que je viens de ùettre à jour
        async function updatePosition() {
          const max_position = await List.max("position");
          await List.increment(
            {
              position: 1,
            },
            {
              where: {
                position: { [Op.between]: [position, max_position] },
              },
            }
          );

          await List.increment(
            {
              position: -1,
            },
            {
              where: {
                id: id,
              },
            }
          );
        }
        updatePosition();

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
    if (!positionToDel) {
      throw new HttpError(404, "list not found");
    }
    // si la position à supp = position max
    //   alors pas besoin de réduire les position des autres liste
    if (positionToDel === maxPos) {
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
            id: { [Op.ne]: id },
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
