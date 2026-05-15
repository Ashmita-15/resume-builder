import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { analyzeJobMatch, getJobMatchReports, getJobMatchReportById } from "../controllers/jobMatchController.js";

const jobMatchRouter = express.Router();

jobMatchRouter.post('/analyze', protect, analyzeJobMatch);
jobMatchRouter.get('/reports', protect, getJobMatchReports);
jobMatchRouter.get('/reports/:reportId', protect, getJobMatchReportById);

export default jobMatchRouter;
