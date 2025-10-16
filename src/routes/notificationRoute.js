import express from "express";
import { upload } from "/src/middleware/upload.js";
import { addNotificationController,fetchNotificationController } from "../controller/notificationController";
const router=express.Router();
router.post("/fetchNotification",upload.none(),fetchNotificationController);
router.post("/addNotification",upload.single("photo"),addNotificationController);
export default router;