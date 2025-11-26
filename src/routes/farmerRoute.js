import express from "express";
import upload from "../middleware/upload.js";
import { registerFarmerController ,deleteFarmerController, editFarmerController, getAllFarmerController, loginFarmerController } from "../controller/farmerController.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";
const router=express.Router();
router.post("/register-farmer",uploadSingleFile('photo'),registerFarmerController);
router.post("/login-farmer",upload.single('photo'),loginFarmerController);
router.delete("/deleteFarmer",upload.none(),deleteFarmerController);
router.post("/fetchFarmer",upload.none(),getAllFarmerController);
router.post("/editFarmer",uploadSingleFile('photo'),editFarmerController);

export default router;