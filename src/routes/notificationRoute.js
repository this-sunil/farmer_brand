import express from "express";
import upload from "../middleware/upload.js";
import { addNotificationController,deleteNotificationController,fetchNotificationController, sendNotificationController } from "../controller/notificationController.js";
const router=express.Router();
router.post("/fetchNotification",upload.none(),fetchNotificationController);
router.post("/addNotification",upload.single("photo"),addNotificationController);
router.post("/deleteNotification",upload.none(),deleteNotificationController);
router.post('/sendNotification', upload.single('photo'),sendNotificationController);
export default router;