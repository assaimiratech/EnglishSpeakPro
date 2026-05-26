import express from "express";
import {
  createLesson,
  getLessonsByTopic,
  getPublishedLessons,
  getAllLessons,
  updateLesson,
  deleteLesson,
  uploadAudio,
} from "../controllers/lesson.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */
router.get("/", getPublishedLessons);
router.get("/topic/:topicId", getLessonsByTopic);

/* =========================
   ADMIN ROUTES
========================= */
router.get("/admin", protect, adminOnly, getAllLessons);

router.post("/", protect, adminOnly, createLesson);
router.put("/:id", protect, adminOnly, updateLesson);
router.delete("/:id", protect, adminOnly, deleteLesson);

/* =========================
   AUDIO UPLOAD
========================= */
router.post(
  "/upload/audio",
  protect,
  adminOnly,
  upload.single("audio"),
  uploadAudio,
);

export default router;
