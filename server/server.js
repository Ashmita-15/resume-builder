```js
import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/atsRoutes.js";
import jobMatchRouter from "./routes/jobMatchRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();

// =========================
// CONNECT DATABASE
// =========================
await connectDB();

// =========================
// MIDDLEWARE
// =========================

// JSON parser
app.use(express.json({ limit: "10mb" }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://resume-builder-weld-phi.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (mobile apps, postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// =========================
// ROUTES
// =========================

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is live...",
  });
});

// API Routes
app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/ats", atsRouter);
app.use("/api/job-match", jobMatchRouter);
app.use("/api/dashboard", dashboardRouter);

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
```
