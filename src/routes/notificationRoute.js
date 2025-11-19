import express from "express";
import upload from "../middleware/upload.js";
import { addNotificationController,deleteNotificationController,fetchNotificationController } from "../controller/notificationController.js";
const router=express.Router();
router.post("/fetchNotification",upload.none(),fetchNotificationController);
router.post("/addNotification",upload.single("photo"),addNotificationController);
router.post("/deleteNotification",upload.none(),deleteNotificationController);
router.post('/sendNotification', upload.single('photo'),async (req, res) => {
  const { token, title, body, data, photo } = req.body; // photo optional

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'token, title, and body are required!' });
  }

  try {
   
    await sendNotification(token, title, body, data || {});

    await axios.post(`${process.env.BASE_URL}/api/addNotification`, {
      title: title,
      subtitle: body,
      photo: photo || ''
    });

    res.status(200).json({ status: true, msg: 'Notification sent and logged!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, msg: `Internal Server Error ${err.message}` });
  }
});
export default router;