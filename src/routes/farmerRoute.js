import express from "express";
import upload from "../middleware/upload.js";
import { addFarmerController, deleteFarmerController, editFarmerController, getAllFarmerController } from "../controller/farmerController.js";
const router=express.Router();
router.post("/addFarmer",upload.single('photo'),addFarmerController);
router.delete("/deleteFarmer",upload.none(),deleteFarmerController);
router.post("/fetchFarmer",upload.none(),getAllFarmerController);
router.post("/editFarmer",upload.single('photo'),editFarmerController);
export default router;