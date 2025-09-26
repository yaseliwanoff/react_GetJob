// controllers/analyticsController.js
const Analytics = require("../models/Analytics");
const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc Get employer analytics overview
exports.getEmployerAnalytics = async (req, res) => {
    try {
        const employerId = req.user.id;

        const detailedAnalytics = await Analytics.getDetailedAnalytics(employerId);

        res.json({
            message: "Analytics fetched successfully",
            analytics: detailedAnalytics
        });

    } catch (error) {
        console.error("Get employer analytics error:", error);
        res.status(500).json({
            message: "Error fetching analytics",
            error: error.message
        });
    }
};

// @desc Get employer basic stats
exports.getEmployerStats = async (req, res) => {
    try {
        const employerId = req.user.id;

        const analytics = await Analytics.getOrCreate(employerId);
        const jobsStats = await Analytics.getJobsStats(employerId);
        const applicationsStats = await Analytics.getApplicationsStats(employerId);

        const stats = {
            basic: {
                totalJobsPosted: analytics.total_jobs_posted,
                totalApplicationsReceived: analytics.total_applications_received,
                totalHired: analytics.total_hired
            },
            jobs: jobsStats,
            applications: applicationsStats,
            summary: {
                averageApplicationsPerJob: jobsStats.totalJobs > 0 
                    ? (applicationsStats.totalApplications / jobsStats.totalJobs).toFixed(1) 
                    : 0,
                hireRate: applicationsStats.totalApplications > 0 
                    ? ((analytics.total_hired / applicationsStats.totalApplications) * 100).toFixed(1) 
                    : 0
            }
        };

        res.json({
            message: "Stats fetched successfully",
            stats
        });

    } catch (error) {
        console.error("Get employer stats error:", error);
        res.status(500).json({
            message: "Error fetching stats",
            error: error.message
        });
    }
};

// @desc Get employer trends
exports.getEmployerTrends = async (req, res) => {
    try {
        const employerId = req.user.id;
        const { period = '30days' } = req.query;

        const trends = await Analytics.getTrends(employerId, period);

        res.json({
            message: "Trends fetched successfully",
            trends
        });

    } catch (error) {
        console.error("Get employer trends error:", error);
        res.status(500).json({
            message: "Error fetching trends",
            error: error.message
        });
    }
};

// @desc Get jobs statistics
exports.getJobsStats = async (req, res) => {
    try {
        const employerId = req.user.id;

        const jobsStats = await Analytics.getJobsStats(employerId);

        // Дополнительная аналитика по вакансиям
        const { data: jobs } = await Job.findByCompany(employerId, 1, 1000); // Получаем все вакансии
        
        const popularCategories = {};
        const popularTypes = {};
        
        jobs.forEach(job => {
            // Статистика по категориям
            if (job.category) {
                popularCategories[job.category] = (popularCategories[job.category] || 0) + 1;
            }
            
            // Статистика по типам работы
            popularTypes[job.type] = (popularTypes[job.type] || 0) + 1;
        });

        res.json({
            message: "Jobs stats fetched successfully",
            stats: {
                ...jobsStats,
                popularCategories,
                popularTypes
            }
        });

    } catch (error) {
        console.error("Get jobs stats error:", error);
        res.status(500).json({
            message: "Error fetching jobs stats",
            error: error.message
        });
    }
};

// @desc Get applications statistics
exports.getApplicationsStats = async (req, res) => {
    try {
        const employerId = req.user.id;

        const applicationsStats = await Analytics.getApplicationsStats(employerId);

        // Дополнительная аналитика по заявкам
        const { data: applications } = await Application.findByCompany(employerId, 1, 1000);
        
        const applicationsByJob = {};
        const applicationsTimeline = {};
        
        applications.forEach(app => {
            // Статистика по вакансиям
            const jobTitle = app.job?.title || 'Unknown Job';
            applicationsByJob[jobTitle] = (applicationsByJob[jobTitle] || 0) + 1;
            
            // Статистика по времени (по месяцам)
            const month = new Date(app.created_at).toISOString().slice(0, 7);
            applicationsTimeline[month] = (applicationsTimeline[month] || 0) + 1;
        });

        res.json({
            message: "Applications stats fetched successfully",
            stats: {
                ...applicationsStats,
                applicationsByJob,
                applicationsTimeline
            }
        });

    } catch (error) {
        console.error("Get applications stats error:", error);
        res.status(500).json({
            message: "Error fetching applications stats",
            error: error.message
        });
    }
};

// @desc Get hiring analytics
exports.getHiringAnalytics = async (req, res) => {
    try {
        const employerId = req.user.id;

        const analytics = await Analytics.getOrCreate(employerId);
        const applicationsStats = await Analytics.getApplicationsStats(employerId);

        // Рассчитываем метрики найма
        const hiringMetrics = {
            totalHired: analytics.total_hired,
            totalApplications: applicationsStats.totalApplications,
            hireRate: applicationsStats.totalApplications > 0 
                ? ((analytics.total_hired / applicationsStats.totalApplications) * 100).toFixed(1)
                : 0,
            averageTimeToHire: "7 days", // Можно рассчитать на основе дат
            conversionRate: {
                appliedToReview: applicationsStats.byStatus['In Review'] > 0 
                    ? ((applicationsStats.byStatus['In Review'] / applicationsStats.totalApplications) * 100).toFixed(1)
                    : 0,
                reviewToAccepted: applicationsStats.byStatus['In Review'] > 0 
                    ? ((applicationsStats.byStatus['Accepted'] / applicationsStats.byStatus['In Review']) * 100).toFixed(1)
                    : 0
            }
        };

        res.json({
            message: "Hiring analytics fetched successfully",
            hiringMetrics
        });

    } catch (error) {
        console.error("Get hiring analytics error:", error);
        res.status(500).json({
            message: "Error fetching hiring analytics",
            error: error.message
        });
    }
};
