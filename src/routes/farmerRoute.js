import express from "express";
import upload from "../middleware/upload.js";
import { registerFarmerController ,deleteFarmerController, editFarmerController, getAllFarmerController, loginFarmerController } from "../controller/farmerController.js";
const router=express.Router();
router.post("/register-farmer",upload.single('photo'),registerFarmerController);
router.post("/login-farmer",upload.single('photo'),loginFarmerController);
router.delete("/deleteFarmer",upload.none(),deleteFarmerController);
router.post("/fetchFarmer",upload.none(),getAllFarmerController);
router.post("/editFarmer",upload.single('photo'),editFarmerController);

export default router;