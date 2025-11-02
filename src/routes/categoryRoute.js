import express from "express";
import upload from "../middleware/upload.js";
import { addCategoryController, deleteCategoryController, editCategoryController, getAllCategory } from "../controller/categoryController.js";
const router=express.Router();
router.post("/addCategory",upload.single('photo'),addCategoryController);
router.delete("/deleteCategory",upload.none(),deleteCategoryController);
router.post("/fetchCategory",upload.none(),getAllCategory);
router.post("/edit-Category",upload.single('photo'),editCategoryController);
export default router;