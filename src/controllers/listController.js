import { Op } from "sequelize";
import { List } from "../models/index.js";
import z from "zod";

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
    try {
      const list = await List.findByPk(Number.parseInt(req.params.id));
      res.json(list);
    } catch (error) {
      res.status(500).send(console.log("Problème d'affichage de la liste"));
    }
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
    const id = Number.parseInt(req.params.id);

    const newData = req.body;

    const listSchema = z.object({
      name: z.string().min(1, "veuillez au moins mettre un caractère"),
      position: z.number().optional(),
    });

    const test = listSchema.safeParse(newData);

    if (!test.success) {
      // handle error then return
      test.error;
    } else {
      try {
        const positionBase = await List.findByPk(id, {
          attributes: ["position"],
        });

        const { name, position } = req.body;
        console.log(position);
        if (position !== positionBase || position === undefined) {
          // on met à jour avec la nouvelle position
          await List.update(
            {
              name,
              position,
            },
            { where: { id: id } }
          );
          // on change la position des listes qui se retrouve "en-dessous" en ignorant
          //   la liste que je viens de ùettre à jour
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
      } catch (error) {
        res.status(500).send(console.log("Problème d'affichage des listes"));
      }
    }
  },

  async DeleteList(req, res) {
    const id = Number.parseInt(req.params.id);
    try {
      // on recup la position maximale
      const maxPos = await List.max("position");
      //   on récupère la position de la liste a supp
      const positionToDel = await List.findByPk(id, {
        attributes: ["position"],
      });
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
    } catch (error) {
      res
        .status(500)
        .send(error, console.log("Problème d'affichage des listes"));
    }
  },
};

export default listController;
