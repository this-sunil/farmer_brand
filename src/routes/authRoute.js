import express from "express";
import upload from "../middleware/upload.js";
import { deleteUserController, getAllUserController, getProfileController, loginController, registerController, updateUserController } from "../controller/authController.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";
const router=express.Router();
router.post("/register",upload.none(),registerController);
router.post("/login",upload.none(),loginController);
router.post("/get-profile",upload.none(),getProfileController);
router.delete("/deleteUser",upload.none(),deleteUserController);
router.post("/getAllUser",upload.none(),getAllUserController);
router.post("/update-profile",uploadSingleFile("photo"),updateUserController);

export default router;