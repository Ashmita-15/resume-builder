import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { analyzeAts, getAtsReports, getAtsReportById } from "../controllers/atsController.js";

const atsRouter = express.Router();

atsRouter.post('/analyze', protect, analyzeAts);
atsRouter.get('/reports', protect, getAtsReports);
atsRouter.get('/reports/:reportId', protect, getAtsReportById);

export default atsRouter;
