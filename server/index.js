import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { connectDB } from "./lib/db.js";
import { verifyToken, isAdmin } from "./middlewares/auth.middleware.js";

import authRoute from "./routes/auth.route.js";
import studentRoute from "./routes/student.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);

const corsOptions = {
    origin: [
      "http://localhost:5173",
      "https://campus-stay-jade.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: { error: "Too many requests. Please try again later." }
});

app.use("/api/auth", apiLimiter, authRoute);

app.use("/api/admin", apiLimiter, verifyToken, isAdmin, adminRoute);
app.use("/api/student", apiLimiter, verifyToken, studentRoute);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});