import express from "express";
import dotenv from "dotenv";

//middleware

import isAuth from "../middlewares/isAuth.js";

import {
  createPost,
  getPostByID,
  updatePostByID,
  deletePostByID,
  searchPost,
  likePost,
  getAllPost,
} from "../app/controllers/postController.js";

const router = express.Router();

dotenv.config();

router.post("/", isAuth, createPost);
router.get("/", getAllPost);
router.get("/search", searchPost);
router.post("/like", isAuth, likePost);
router.get("/:id", getPostByID);
router.put("/:id",isAuth, updatePostByID);
router.delete("/:id",isAuth, deletePostByID);

export default router;