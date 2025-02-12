import { Op } from "sequelize";
import { Card, CardHasTag, Tag } from "../models/index.js";
import z from "zod";

const cardController = {
  async Getcard(req, res) {
    try {
      const allCard = await Card.findAll({
        order: [["id"]],
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
        await Card.create({
          ...newCard,
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
  Modifycard(req, res) {},
  Deletecard(req, res) {},
};

export default cardController;
