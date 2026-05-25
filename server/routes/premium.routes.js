import express from "express";
import {
  createPremiumRequest,
  getAllRequests,
  updateRequestStatus,
} from "../controllers/premium.controller.js";

import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// USER
router.post("/", protect, createPremiumRequest);

// ADMIN
router.get("/", protect, adminOnly, getAllRequests);
router.put("/:id", protect, adminOnly, updateRequestStatus);

export default router;
