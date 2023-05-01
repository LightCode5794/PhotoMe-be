import express from "express";
import dotenv from "dotenv";
import {
  getAllCommentPost,
  createComment,
  replyComment,
  likeComment,
  updateComment,
  deleteComment,
} from "../app/controllers/commentController.js";

const router = express.Router();

dotenv.config();

router.get("/:id", getAllCommentPost); //id bài viết
router.post("/:id", createComment); //id bài viết
router.post("/:id/reply", replyComment); //id comment
router.post("/:id/like", likeComment); //id comment
router.put("/:id", updateComment); //id comment
router.delete("/:id", deleteComment); //id comment

export default router;
