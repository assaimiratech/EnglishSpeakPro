import express from "express";
import {
  createTopic,
  getTopics,
  getTopicsAdmin,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getTopics);

// ADMIN ONLY
router.get("/admin", protect, adminOnly, getTopicsAdmin);
router.get("/admin/list", protect, adminOnly, getTopicsAdmin);
router.post("/", protect, adminOnly, createTopic);
router.put("/:id", protect, adminOnly, updateTopic);
router.delete("/:id", protect, adminOnly, deleteTopic);

export default router;
