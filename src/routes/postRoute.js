import express from "express";
import { addPostController, deletePostController, getAllPostController } from "../controller/postController.js";
import upload from "../middleware/upload.js";
const router=express.Router();
router.post("/addPost",upload.single("photo"),addPostController);
router.post("/deletePost",upload.none(),deletePostController);
router.post("/getAllPost",upload.none(),getAllPostController);
export default router;