import express from "express";
import {upload} from "../middleware/upload.js";
import { addPostController,deletePostController} from "../controller/postController.js"
const router=express.Router();
router.post("/addPost",upload.single("photo"),addPostController);
router.delete("/deletePost",upload.none(),deletePostController);
export default router; 