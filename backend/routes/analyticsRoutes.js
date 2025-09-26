// routes/analyticsRoutes.js
const express = require("express");
const {
    getEmployerAnalytics,
    getEmployerStats,
    getEmployerTrends,
    getJobsStats,
    getApplicationsStats,
    getHiringAnalytics
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();

// Основная аналитика работодателя
router.get("/overview", protect, authorize('employer'), getEmployerAnalytics);

// Статистика работодателя
router.get("/stats", protect, authorize('employer'), getEmployerStats);

// Тренды и аналитика за период
router.get("/trends", protect, authorize('employer'), getEmployerTrends);

// Статистика по вакансиям
router.get("/jobs-stats", protect, authorize('employer'), getJobsStats);

// Статистика по заявкам
router.get("/applications-stats", protect, authorize('employer'), getApplicationsStats);

// Аналитика найма
router.get("/hiring-analytics", protect, authorize('employer'), getHiringAnalytics);

module.exports = router;
