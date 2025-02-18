import express from "express";
import listController from "./controllers/listController.js";
import cardController from "./controllers/cardController.js";
import tagController from "./controllers/tagController.js";
import { controllerWrapper as cw } from "./utils/controllerWrapper.js";

const router = express.Router();

// *routes pour les listes
function list() {
  // get simple
  router.get("/api/v1/list", cw(listController.Getlist));
  // get by id
  router.get("/api/v1/list/:id", cw(listController.GetlistId));
  // post
  router.post("/api/v1/list", cw(listController.AddList));
  // patch
  router.patch("/api/v1/list/:id", cw(listController.ModifyList));
  // delete
  router.delete("/api/v1/list/:id", cw(listController.DeleteList));
}
list();

// *routes pour les cartes
function card() {
  // get simple
  router.get("/api/v1/card", cw(cardController.Getcard));
  // get by id
  router.get("/api/v1/card/:id", cw(cardController.GetcardId));
  // get by listid
  router.get("/api/v1/card/list/:id", cw(cardController.GetcardByList));
  // post
  router.post("/api/v1/card", cw(cardController.Addcard));
  // patch
  router.patch("/api/v1/card/:id", cw(cardController.Modifycard));
  // delete
  router.delete("/api/v1/card/:id", cw(cardController.Deletecard));
}
card();

// *routes pour les labels
function tag() {
  // get simple
  router.get("/api/v1/tag", cw(tagController.Gettag));
  // get by id
  router.get("/api/v1/tag/:id", cw(tagController.GettagId));
  // post
  router.post("/api/v1/tag", cw(tagController.Addtag));
  // patch
  router.patch("/api/v1/tag/:id", cw(tagController.Modifytag));
  // delete
  router.delete("/api/v1/tag/:id", cw(tagController.Deletetag));
}
tag();
export default router;
