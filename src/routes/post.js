import express from "express";
import dotenv from "dotenv";
import {
  createPost,
  getPostByID,
  updatePostByID,
  deletePostByID,
  searchPost,
  likePostByID,
} from "../app/controllers/postController.js";

const router = express.Router();

dotenv.config();

router.post("/", createPost);
router.get("/search", searchPost);
router.post("/:id/like", likePostByID);
router.get("/:id", getPostByID);
router.put("/:id", updatePostByID);
router.delete("/:id", deletePostByID);

export default router;
