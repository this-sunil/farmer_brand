import express from "express";
import { addPostController, deletePostController } from "../controller/postController.js";
import upload from "../middleware/upload.js";
const router=express.Router();
router.post("/addPost",upload.single("photo"),addPostController);
router.delete("/deletePost",upload.none(),deletePostController);
export default router;