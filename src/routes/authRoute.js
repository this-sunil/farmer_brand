import express from "express";
import { deleteUserController, getAllUserController, getProfileController, loginController, registerController, updateUserController } from "../controller/authController.js";
import upload from "../middleware/upload.js";
const router=express.Router();

router.post("/register",registerController);
router.post("/login",loginController);
router.post("/get-profile",getProfileController);
router.delete("/deleteUser",deleteUserController);
router.post("/getAllUser",getAllUserController);
router.post("/update-profile",upload.single("photo"),updateUserController);

export default router;