import express from "express";
import listController from "./controllers/listController.js";
import cardController from "./controllers/cardController.js";

const router = express();

// *route pour les listes
// get simple
router.get("/list", listController.Getlist);
// get by id
router.get("/list/:id", listController.GetlistId);
// post
router.post("/list", listController.AddList);
// patch
router.patch("/list/:id", listController.ModifyList);
// delete
router.delete("/list/:id", listController.DeleteList);

// *route pour les cartes
// get simple
router.get("/card", cardController.Getcard);
// get by id
router.get("/card/:id", cardController.GetcardId);
// post
router.post("/card", cardController.Addcard);
// patch
router.patch("/card/:id", cardController.Modifycard);
// delete
router.delete("/card/:id", cardController.Deletecard);

export default router;
