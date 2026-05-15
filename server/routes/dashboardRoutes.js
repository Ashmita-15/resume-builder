import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get('/stats', protect, getDashboardStats);

export default dashboardRouter;
