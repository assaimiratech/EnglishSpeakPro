import express from "express";
import {
  createLesson,
  getLessonsByTopic,
  getAllLessons,
  updateLesson,
  deleteLesson,
  uploadAudio,
} from "../controllers/lesson.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllLessons);
router.get("/:topicId", getLessonsByTopic);

// ADMIN ONLY
router.post("/", protect, adminOnly, createLesson);
router.put("/:id", protect, adminOnly, updateLesson);
router.delete("/:id", protect, adminOnly, deleteLesson);

// 🔥 AUDIO UPLOAD ROUTE (NEW)
router.post(
  "/upload/audio",
  protect,
  adminOnly,
  upload.single("audio"),
  uploadAudio,
);
export default router;
