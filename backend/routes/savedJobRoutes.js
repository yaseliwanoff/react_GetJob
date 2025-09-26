// routes/savedJobRoutes.js
const express = require("express");
const {
    saveJob,
    unsaveJob,
    getSavedJobs,
    checkSavedJob,
    getSavedJobCount
} = require("../controllers/savedJobController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();

// Сохранение вакансии (только соискатели)
router.post("/", protect, authorize('jobseeker'), saveJob);

// Удаление из сохраненных (только соискатели)
router.delete("/", protect, authorize('jobseeker'), unsaveJob);

// Получение сохраненных вакансий пользователя
router.get("/my-saved-jobs", protect, authorize('jobseeker'), getSavedJobs);

// Проверка, сохранена ли вакансия
router.get("/check/:jobId", protect, checkSavedJob);

// Получение количества сохранений для вакансии (публичный доступ)
router.get("/count/:jobId", getSavedJobCount);

module.exports = router;
