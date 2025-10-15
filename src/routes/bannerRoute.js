import express from "express";
import upload from "../middleware/upload.js";
import { addBannerController, getBannerController, removeBannerController, updateBannerController } from "../controller/bannerController.js";
const router=express.Router();
// TODO : Banner Routes
router.post("/getBanner",upload.none(),getBannerController);
router.post("/addBanner",upload.single('photo'),addBannerController);
router.delete("/deleteBanner",upload.none(),removeBannerController);
router.post("/updateBanner",upload.none(),updateBannerController);
export default router;