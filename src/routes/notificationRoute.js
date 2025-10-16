import express from "express";
import { upload } from "/src/middleware/upload.js";
import { addNotificationController,deleteNotificationController,fetchNotificationController } from "../controller/notificationController.js";
const router=express.Router();
router.post("/fetchNotification",upload.none(),fetchNotificationController);
router.post("/addNotification",upload.single("photo"),addNotificationController);
router.post("/deleteNotification",upload.none(),deleteNotificationController);
export default router;