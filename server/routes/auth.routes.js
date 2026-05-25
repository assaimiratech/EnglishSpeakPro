import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPasswordRequest,
  verifyForgotPasswordOtp,
} from "../controllers/auth.controller.js";
import {
  changePassword,
  changeEmailRequest,
  verifyEmail,
} from "../controllers/user.settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.post("/change-password", protect, changePassword);

router.post("/change-email", protect, changeEmailRequest);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", protect, forgotPasswordRequest);
router.post("/verify-forgot-password", protect, verifyForgotPasswordOtp);

export default router;
