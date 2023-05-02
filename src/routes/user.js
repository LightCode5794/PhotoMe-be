import express from "express";
import dotenv from "dotenv";
import {
  login,
  signup,
  getUserByID,
  searchUserByName,
  updateUserByID,
  deleteUserByID,
  updatePassword,
  getFollower,
  getFollowing,
  followingUser,
  getPost,
} from "../app/controllers/userController.js";
const router = express.Router();

dotenv.config();

router.post("/signup", signup);
router.post("/login", login);
router.post("/password", updatePassword);
router.get("/search", searchUserByName);
router.get("/:id/following", getFollowing);
router.get("/:id/follower", getFollower);
router.get("/:id/post", getPost);
router.post("/:id/following", followingUser); //follow + hủy follow
router.get("/:id", getUserByID);
router.put("/:id", updateUserByID);
router.delete("/:id", deleteUserByID);

export default router;
