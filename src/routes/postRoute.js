import express from "express";
import { addPostController, deletePostController, getAllPostController } from "../controller/postController.js";
import upload from "../middleware/upload.js";
import { uploadSingleFile } from "../middleware/uploadMiddleware.js";
const router=express.Router();
router.post("/addPost",uploadSingleFile("photo"),addPostController);
router.post("/deletePost",upload.none(),deletePostController);
router.post("/getAllPost",upload.none(),getAllPostController);
export default router;