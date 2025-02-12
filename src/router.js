import express from "express";
import { Card } from "./models/index.js";

const router = express();

router.get("/list", async function list(req, res) {
  const cards = await Card.findAll();

  res.json(cards);
});

export default router;
