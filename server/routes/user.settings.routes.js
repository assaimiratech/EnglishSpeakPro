import express from "express";
import {
  changePassword,
  changeEmailRequest,
  verifyEmail,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/change-password", authMiddleware, changePassword);
router.post("/change-email", authMiddleware, changeEmailRequest);
router.get("/verify-email/:token", verifyEmail);

export default router;
