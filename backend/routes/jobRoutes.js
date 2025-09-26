const express = require("express");
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    toggleCloseJob,
    getJobsEmployer,
    getJobsByCompany
} = require("../controllers/jobController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();

// Все вакансии + создание вакансии (только работодатели)
router.route("/")
    .get(getJobs) // Публичный доступ - все активные вакансии
    .post(protect, authorize('employer'), createJob); // Только работодатели

// Вакансии конкретного работодателя
router.get("/employer/my-jobs", protect, authorize('employer'), getJobsEmployer);
router.get("/company/:companyId", getJobsByCompany);

// Операции с конкретной вакансией
router.route("/:id")
    .get(getJobById) // Публичный доступ - детали вакансии
    .put(protect, authorize('employer'), updateJob) // Только владелец вакансии
    .delete(protect, authorize('employer'), deleteJob); // Только владелец вакансии

// Закрытие/открытие вакансии
router.put("/:id/toggle-close", protect, authorize('employer'), toggleCloseJob);

module.exports = router;
