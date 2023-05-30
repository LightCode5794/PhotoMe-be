import express from "express";
import dotenv from "dotenv";

//middleware
import isAuth from "../middlewares/isAuth.js";
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
  getNotifications
} from "../app/controllers/userController.js";
const router = express.Router();

dotenv.config();

router.post("/signup", signup);
router.post("/login", login);
router.post("/password", isAuth, updatePassword);
router.post("/follow", isAuth, followUser); //follow + hủy follow
router.get("/search", searchUserByName);
router.get("/:id/following", getFollowing);
router.get("/:id/follower", getFollower);
router.get("/:id/post", getPost);
router.get("/:id", getUserByID);
router.get("/:id/deviceToken", getDeviceTokenByID);
router.get("/:id/notification", getNotifications);
router.put("/:id", isAuth, updateUserByID);
router.put("/:id/deviceToken", updateDeviceToken);
router.delete("/:id", isAuth, deleteUserByID);

export default router;
