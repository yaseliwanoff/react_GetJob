const Job = require("../models/Job");

// @desc Create new job
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            location,
            category,
            type,
            salaryMin,
            salaryMax
        } = req.body;

        // Валидация обязательных полей
        if (!title || !description || !requirements || !type) {
            return res.status(400).json({
                message: "Please provide title, description, requirements, and type"
            });
        }

        const jobData = {
            title,
            description,
            requirements,
            location: location || '',
            category: category || '',
            type,
            salary_min: salaryMin,
            salary_max: salaryMax,
            company_id: req.user.id // ID работодателя из middleware
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({
            message: "Error creating job",
            error: error.message
        });
    }
};

// @desc Get all jobs with filters and pagination
exports.getJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            type,
            location,
            search,
            sortBy = 'created_at',
            sortOrder = 'desc'
        } = req.query;

        const filters = {
            category,
            type,
            location,
            search
        };

        const result = await Job.findAll(
            parseInt(page),
            parseInt(limit),
            filters,
            sortBy,
            sortOrder
        );

        res.json(result);

    } catch (error) {
        console.error("Get jobs error:", error);
        res.status(500).json({
            message: "Error fetching jobs",
            error: error.message
        });
    }
};

// @desc Get single job by ID
exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        const job = await Job.findById(id);
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            job
        });

    } catch (error) {
        console.error("Get job by ID error:", error);
        res.status(500).json({
            message: "Error fetching job",
            error: error.message
        });
    }
};

// @desc Update job
exports.updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            requirements,
            location,
            category,
            type,
            salaryMin,
            salaryMax
        } = req.body;

        // Проверяем, существует ли вакансия и принадлежит ли пользователю
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (existingJob.company_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to update this job"
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = requirements;
        if (location !== undefined) updateData.location = location;
        if (category !== undefined) updateData.category = category;
        if (type) updateData.type = type;
        if (salaryMin !== undefined) updateData.salary_min = salaryMin;
        if (salaryMax !== undefined) updateData.salary_max = salaryMax;

        const updatedJob = await Job.update(id, updateData);

        res.json({
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.error("Update job error:", error);
        res.status(500).json({
            message: "Error updating job",
            error: error.message
        });
    }
};

// @desc Delete job
exports.deleteJob = async (req, res) => {
    try {
        const { id } = req.params;

        // Проверяем, существует ли вакансия и принадлежит ли пользователю
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (existingJob.company_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to delete this job"
            });
        }

        await Job.delete(id);

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("Delete job error:", error);
        res.status(500).json({
            message: "Error deleting job",
            error: error.message
        });
    }
};

// @desc Toggle job close/open status
exports.toggleCloseJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { isClosed } = req.body;

        // Проверяем, существует ли вакансия и принадлежит ли пользователю
        const existingJob = await Job.findById(id);
        if (!existingJob) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        if (existingJob.company_id !== req.user.id) {
            return res.status(403).json({
                message: "Not authorized to modify this job"
            });
        }

        const updatedJob = await Job.toggleStatus(id, isClosed !== undefined ? isClosed : !existingJob.is_closed);

        res.json({
            message: `Job ${updatedJob.is_closed ? 'closed' : 'opened'} successfully`,
            job: updatedJob
        });

    } catch (error) {
        console.error("Toggle job status error:", error);
        res.status(500).json({
            message: "Error updating job status",
            error: error.message
        });
    }
};

// @desc Get jobs for specific employer
exports.getJobsEmployer = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            showClosed = false
        } = req.query;

        let result;
        if (showClosed === 'true') {
            // Все вакансии работодателя (включая закрытые)
            result = await Job.findByCompany(req.user.id, parseInt(page), parseInt(limit));
        } else {
            // Только активные вакансии
            result = await Job.findByCompany(req.user.id, parseInt(page), parseInt(limit));
            result.jobs = result.jobs.filter(job => !job.is_closed);
        }

        res.json(result);

    } catch (error) {
        console.error("Get employer jobs error:", error);
        res.status(500).json({
            message: "Error fetching employer jobs",
            error: error.message
        });
    }
};

// @desc Get jobs by company ID (public)
exports.getJobsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const result = await Job.findByCompany(companyId, parseInt(page), parseInt(limit));
        
        // Показываем только активные вакансии для публичного доступа
        result.jobs = result.jobs.filter(job => !job.is_closed);

        res.json(result);

    } catch (error) {
        console.error("Get company jobs error:", error);
        res.status(500).json({
            message: "Error fetching company jobs",
            error: error.message
        });
    }
};
