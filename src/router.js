import express from "express";
import listController from "./controllers/listController.js";
import cardController from "./controllers/cardController.js";
import { controllerWrapper as cw } from "./schemas/controllerWrapper.js";

const router = express();

// *route pour les listes
// get simple
router.get("/list", cw(listController.Getlist));
// get by id
router.get("/list/:id", cw(listController.GetlistId));
// post
router.post("/list", cw(listController.AddList));
// patch
router.patch("/list/:id", cw(listController.ModifyList));
// delete
router.delete("/list/:id", cw(listController.DeleteList));

// *route pour les cartes
// get simple
router.get("/card", cw(cardController.Getcard));
// get by id
router.get("/card/:id", cw(cardController.GetcardId));
// post
router.post("/card", cw(cardController.Addcard));
// patch
router.patch("/card/:id", cw(cardController.Modifycard));
// delete
router.delete("/card/:id", cw(cardController.Deletecard));

export default router;
