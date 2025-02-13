import { Op } from "sequelize";
import { CardHasTag, Tag } from "../models/index.js";
import z from "zod";
import { idParamsSchema } from "../schemas/utils.js";
import HttpError from "../utils/errors.js";

const tagSchema = z.object({
  name: z.string().nonempty(),
  id_card: z.number().int().positive().array().optional(),
});

const tagSchemaMod = tagSchema.partial();

const tagController = {
  async Gettag(req, res) {
    const tags = await Tag.findAll();
    res.json(tags);
  },
  async GettagId(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    const tag = await Tag.findByPk(id);
    res.json(tag);
  },
  async Addtag(req, res) {
    const newTag = req.body;
    const { name, id_card } = tagSchema.parse(newTag);
    if (await Tag.findOne({ where: { name: name } })) {
      throw new HttpError(505, "tag alredy exist");
    }
    const theNewTag = await Tag.create(
      { name },
      {
        returning: true,
      }
    );
    if (id_card !== undefined || "") {
      id_card.forEach(async (card, i) => {
        CardHasTag.create({
          id_card: card,
          id_tag: theNewTag.id,
        });
      });
    }
  },
  async Modifytag(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    const entry = req.body;
    const { name, id_card } = tagSchemaMod.parse(entry);
    if (await Tag.findOne({ where: { name: name } })) {
      throw new HttpError(505, "tag alredy exist");
    }

    const theNewTag = await Tag.update(
      { name },
      {
        returning: true,
      }
    );
    if (id_card !== undefined || "") {
      id_card.forEach(async (card, i) => {
        CardHasTag.update({
          where: { id_tag: id },
          id_card: card,
        });
      });
    }
  },
  async Deletetag(req, res) {
    const { id } = idParamsSchema.parse({ id: req.params.id });
    await Tag.destroy({ where: { id: id } });
  },
};

export default tagController;
