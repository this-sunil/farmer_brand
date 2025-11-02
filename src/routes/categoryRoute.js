import express from "express";
import upload from "../middleware/upload.js";
import { addCategoryController, deleteCategoryController } from "../controller/categoryController.js";
const router=express.Router();
router.post("/addCategory",upload.single('photo'),addCategoryController);
router.delete("/deleteCategory",upload.none(),deleteCategoryController);
export default router;