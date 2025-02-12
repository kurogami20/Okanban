import express from "express";
import listController from "./controllers/listController.js";

const router = express();
// *route pour les listes
// get simple
router.get("/list", listController.Getlist);
// get by id
router.get("/list/:id", listController.GetlistId);
// post
router.post("/list", listController.AddList);
// patch
router.patch("/list/modify/:id", listController.ModifyList);
export default router;
