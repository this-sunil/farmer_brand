import express from "express";
import upload from "../middleware/upload.js";
import { addFarmerController, deleteFarmerController, editFarmerController, getAllFarmerController } from "../controller/categoryController.js";
const router=express.Router();
router.post("/addFarmer",upload.single('photo'),addCategoryController);
router.delete("/deleteFarmer",upload.none(),deleteCategoryController);
router.post("/fetchFarmer",upload.none(),getAllCategory);
router.post("/editFarmer",upload.single('photo'),editCategoryController);
export default router;