import express from "express";
import { deleteUserController, getAllUserController, getProfileController, loginController, registerController, updateUserController } from "../controller/authController.js";
import upload from "../middleware/upload.js";
const router=express.Router();

router.post("/register",upload.none(),registerController);
router.post("/login",upload.none(),loginController);
router.post("/get-profile",getProfileController);
router.delete("/deleteUser",upload.none(),deleteUserController);
router.post("/getAllUser",upload.none(),getAllUserController);
router.post("/update-profile",upload.single("photo"),updateUserController);

export default router;