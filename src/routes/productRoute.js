import express from "express";
import upload from "../middleware/upload.js";
import { addProductController, addQtyController, deleteProductController, getAllProductController } from "../controller/productController.js";
const router=express.Router();
router.post("/addProduct",upload.single('photo'),addProductController);
router.post("/addQty",upload.none(),addQtyController);
router.post("/deleteProduct",upload.none(),deleteProductController);
router.post("/getAllProducts",upload.none(),getAllProductController);
export default router;