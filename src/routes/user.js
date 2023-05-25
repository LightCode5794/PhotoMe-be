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
  followUser,
  getPost,
  updateDeviceToken,
  getDeviceTokenByID,
} from "../app/controllers/userController.js";
const router = express.Router();

dotenv.config();

router.post("/signup", signup);
router.post("/login", login);
router.post("/password", updatePassword);
router.post("/follow", followUser); //follow + hủy follow
router.get("/search", searchUserByName);
router.get("/:id/following", getFollowing);
router.get("/:id/follower", getFollower);
router.get("/:id/post", getPost);
router.get("/:id", getUserByID);
router.get("/:id/deviceToken", getDeviceTokenByID);
router.put("/:id", updateUserByID);
router.put("/:id/deviceToken", updateDeviceToken);
router.delete("/:id", deleteUserByID);

export default router;
