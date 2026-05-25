import express from "express";
import {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
} from "../controllers/topic.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getTopics);

// ADMIN ONLY
router.post("/", protect, adminOnly, createTopic);
router.put("/:id", protect, adminOnly, updateTopic);
router.delete("/:id", protect, adminOnly, deleteTopic);

export default router;
