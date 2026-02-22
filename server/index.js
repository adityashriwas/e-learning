import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import path from "path";

dotenv.config();

// call database connection here
connectDB();
const app = express();
const _dirname = path.resolve();
const PORT = process.env.PORT || 3000;
const jsonParser = express.json();
const rawFrontendOrigins =
  process.env.FRONTEND_URL || "http://localhost:5173,http://127.0.0.1:5173";
const allowedOrigins = rawFrontendOrigins
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isDevelopment = process.env.NODE_ENV !== "production";
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const rateLimitMaxRequests = Number(process.env.RATE_LIMIT_MAX || 300);
const requestLog = new Map();
const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (isDevelopment && localhostPattern.test(origin)) return true;
  return false;
};

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


app.options("*", cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/purchase/webhook") {
    return next();
  }
  return jsonParser(req, res, next);
});
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/purchase/webhook") {
    return next();
  }

  const now = Date.now();
  const clientKey = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const entry = requestLog.get(clientKey);

  if (!entry || now - entry.windowStart > rateLimitWindowMs) {
    requestLog.set(clientKey, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= rateLimitMaxRequests) {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later.",
    });
  }

  entry.count += 1;
  requestLog.set(clientKey, entry);
  return next();
});

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requestLog.entries()) {
    if (now - entry.windowStart > rateLimitWindowMs) {
      requestLog.delete(key);
    }
  }
}, rateLimitWindowMs).unref();


app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
