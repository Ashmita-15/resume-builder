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

// Connect DB FIRST
await connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));

app.use(cors({
    origin: "*"
}));

// Routes
app.get("/", (req, res) => {
    res.send("Server is live...");
});

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/ai", aiRouter);
app.use("/api/ats", atsRouter);
app.use("/api/job-match", jobMatchRouter);
app.use("/api/dashboard", dashboardRouter);

export default app;