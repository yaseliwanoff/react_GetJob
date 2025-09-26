// routes/applicationRoutes.js
const express = require("express");
const {
    createApplication,
    getApplicationById,
    getApplicationsByUser,
    getApplicationsByJob,
    getApplicationsByCompany,
    updateApplicationStatus,
    deleteApplication,
    getApplicationStats,
    checkApplication
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();

// Создание заявки (только соискатели)
router.post("/", protect, authorize('jobseeker'), createApplication);

// Получение заявки по ID
router.get("/:id", protect, getApplicationById);

// Заявки пользователя (свои заявки)
router.get("/user/my-applications", protect, getApplicationsByUser);

// Заявки на вакансию (для работодателя - владельца вакансии)
router.get("/job/:jobId", protect, getApplicationsByJob);

// Все заявки компании (для работодателя)
router.get("/company/my-applications", protect, authorize('employer'), getApplicationsByCompany);

// Обновление статуса заявки (только работодатель - владелец вакансии)
router.put("/:id/status", protect, authorize('employer'), updateApplicationStatus);

// Удаление заявки (только соискатель - автор заявки)
router.delete("/:id", protect, authorize('jobseeker'), deleteApplication);

// Статистика заявок
router.get("/stats/company", protect, authorize('employer'), getApplicationStats);

// Проверка, подал ли пользователь заявку на вакансию
router.get("/check/:jobId", protect, checkApplication);

module.exports = router;
