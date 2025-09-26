// controllers/applicationController.js
const Application = require("../models/Application");

// @desc Create new application
exports.createApplication = async (req, res) => {
    try {
        const { jobId, resume } = req.body;

        // Валидация обязательных полей
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const applicationData = {
            job_id: jobId,
            applicant_id: req.user.id,
            resume: resume || req.user.resume || '' // Используем резюме пользователя если не указано
        };

        const application = await Application.create(applicationData);

        res.status(201).json({
            message: "Application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Create application error:", error);
        if (error.message === 'Already applied to this job') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({
            message: "Error creating application",
            error: error.message
        });
    }
};

// @desc Get application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await Application.findById(id);
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Проверяем права доступа
        const isOwner = application.applicant_id === req.user.id;
        const isJobOwner = application.job.company_id === req.user.id;
        
        if (!isOwner && !isJobOwner) {
            return res.status(403).json({
                message: "Not authorized to view this application"
            });
        }

        res.json({
            application
        });

    } catch (error) {
        console.error("Get application by ID error:", error);
        res.status(500).json({
            message: "Error fetching application",
            error: error.message
        });
    }
};

// @desc Get applications by user (their own applications)
exports.getApplicationsByUser = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status
        } = req.query;

        const filters = { status };
        const result = await Application.findByApplicant(
            req.user.id, 
            parseInt(page), 
            parseInt(limit),
            filters
        );

        res.json(result);

    } catch (error) {
        console.error("Get user applications error:", error);
        res.status(500).json({
            message: "Error fetching user applications",
            error: error.message
        });
    }
};

// @desc Get applications by job (for employer)
exports.getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { page = 1, limit = 10, status } = req.query;

        // Проверяем, принадлежит ли вакансия работодателю
        const Job = require("../models/Job");
        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (job.company_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to view applications for this job"
            });
        }

        const filters = { status };
        const result = await Application.findByJob(jobId, parseInt(page), parseInt(limit), filters);

        res.json(result);

    } catch (error) {
        console.error("Get job applications error:", error);
        res.status(500).json({
            message: "Error fetching job applications",
            error: error.message
        });
    }
};

// @desc Get applications by company (all company jobs)
exports.getApplicationsByCompany = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            jobId
        } = req.query;

        const filters = { status, jobId };
        const result = await Application.findByCompany(
            req.user.id, 
            parseInt(page), 
            parseInt(limit),
            filters
        );

        res.json(result);

    } catch (error) {
        console.error("Get company applications error:", error);
        res.status(500).json({
            message: "Error fetching company applications",
            error: error.message
        });
    }
};

// @desc Update application status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Applied', 'In Review', 'Rejected', 'Accepted'].includes(status)) {
            return res.status(400).json({
                message: "Valid status is required: Applied, In Review, Rejected, or Accepted"
            });
        }

        // Проверяем, существует ли заявка
        const existingApplication = await Application.findById(id);
        if (!existingApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Проверяем, принадлежит ли вакансия работодателю
        if (existingApplication.job.company_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to update this application"
            });
        }

        const updatedApplication = await Application.updateStatus(id, status);

        res.json({
            message: "Application status updated successfully",
            application: updatedApplication
        });

    } catch (error) {
        console.error("Update application status error:", error);
        res.status(500).json({
            message: "Error updating application status",
            error: error.message
        });
    }
};

// @desc Delete application
exports.deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем, существует ли заявка
        const existingApplication = await Application.findById(id);
        if (!existingApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Проверяем, является ли пользователь автором заявки
        if (existingApplication.applicant_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this application"
            });
        }

        await Application.delete(id);

        res.json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        console.error("Delete application error:", error);
        res.status(500).json({
            message: "Error deleting application",
            error: error.message
        });
    }
};

// @desc Get application statistics
exports.getApplicationStats = async (req, res) => {
    try {
        const { jobId } = req.query;

        const stats = await Application.getStats(req.user.id, jobId);

        res.json(stats);

    } catch (error) {
        console.error("Get application stats error:", error);
        res.status(500).json({
            message: "Error fetching application statistics",
            error: error.message
        });
    }
};

// @desc Check if user has applied to job
exports.checkApplication = async (req, res) => {
    try {
        const { jobId } = req.params;

        const application = await Application.findByJobAndApplicant(jobId, req.user.id);

        res.json({
            hasApplied: !!application,
            application: application || null
        });

    } catch (error) {
        console.error("Check application error:", error);
        res.status(500).json({
            message: "Error checking application",
            error: error.message
        });
    }
};
