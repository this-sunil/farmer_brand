import express from "express";
import { deleteUserController, getAllUserController, getProfileController, loginController, registerController } from "../controller/authController.js";
const router=express.Router();
router.post("/register",registerController);
router.post("/login",loginController);
router.post("/get-profile",getProfileController);
router.delete("/deleteUser",deleteUserController);
router.post("/getAllUser",getAllUserController);

export default router;