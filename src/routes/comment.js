import express from "express";
import dotenv from "dotenv";
//middleware
import isAuth from "../middlewares/isAuth.js";

import {
  getAllCommentPost,
  createComment,
  replyComment,
  likeComment,
  updateComment,
  deleteComment,
  getAllReplyComment
} from "../app/controllers/commentController.js";

const router = express.Router();

dotenv.config();

router.get("/:id", getAllCommentPost); //id bài viết
router.get("/:id/reply", getAllReplyComment); //id comment
router.post("/like", isAuth, likeComment);
router.post("/:id", isAuth, createComment); //id bài viết
router.post("/:id/reply", isAuth, replyComment); //id comment
router.put("/:id", isAuth, updateComment); //id comment
router.delete("/:id", isAuth, deleteComment); //id comment

export default router;
