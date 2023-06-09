import express from "express";
import dotenv from "dotenv";
import {
  createNotification,
  getNotification,
} from "../app/controllers/notificationController.js";
import isAuth from "../middlewares/isAuth.js";
const router = express.Router();

dotenv.config();

router.post("", createNotification);
router.get("/:id", getNotification);

export default router;
