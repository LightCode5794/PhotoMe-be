import express from "express";
import dotenv from "dotenv";
import {
  login,
  signup,
  getUserByID,
  searchUserByName,
  updateUserByID,
} from "../app/controllers/userController.js";
const router = express.Router();

dotenv.config();

router.post("/signup", signup);
router.post("/login", login);
router.get("/search", searchUserByName);
router.get("/:id", getUserByID);
router.put("/:id", updateUserByID);


export default router;
