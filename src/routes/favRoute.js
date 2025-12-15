import express from "express";
import upload from "../middleware/upload.js"
import { addFavController, removeFavController } from "../controller/favController.js";
const router=express.Router();
router.post("/addFav",upload.none(),addFavController);
router.delete("/removeFav",upload.none(),removeFavController);
export default router;
