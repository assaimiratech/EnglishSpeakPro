import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import compression from "compression";

// routes
import authRoutes from "./routes/auth.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import premiumRoutes from "./routes/premium.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// error middleware
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// middleware
app.use(cors());
// enable gzip compression for responses (improves bandwidth and speed)
app.use(compression());
app.use(express.json());

// ensure uploads folder exists before serving or writing files
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir)); // Serve uploaded files at /uploads

// health check (important for deployment)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// 404 + error handler (LAST)
app.use(notFound);
app.use(errorHandler);

export default app;
