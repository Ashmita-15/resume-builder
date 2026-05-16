import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./configs/db.js";

import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import atsRouter from "./routes/atsRoutes.js";
import jobMatchRouter from "./routes/jobMatchRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

const app = express();

// ======================
// DATABASE
// ======================
connectDB();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resume-builder-weld-phi.vercel.app",
    ],
    credentials: true,
  })
);

// ======================
// ROUTES
// ======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend running successfully",
  });
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/ats", atsRouter);
app.use("/api/job-match", jobMatchRouter);
app.use("/api/dashboard", dashboardRouter);

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
