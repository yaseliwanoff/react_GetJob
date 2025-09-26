// controllers/savedJobController.js
const SavedJob = require("../models/SavedJob");

// @desc Save job to favorites
exports.saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        // Валидация обязательных полей
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        const savedJob = await SavedJob.save(req.user.id, jobId);

        res.status(201).json({
            message: "Job saved successfully",
            savedJob
        });

    } catch (error) {
        console.error("Save job error:", error);
        if (error.message === 'Job already saved') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({
            message: "Error saving job",
            error: error.message
        });
    }
};

// @desc Unsave job from favorites
exports.unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            });
        }

        await SavedJob.unsave(req.user.id, jobId);

        res.json({
            message: "Job removed from saved successfully"
        });

    } catch (error) {
        console.error("Unsave job error:", error);
        res.status(500).json({
            message: "Error unsaving job",
            error: error.message
        });
    }
};

// @desc Get user's saved jobs
exports.getSavedJobs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10
        } = req.query;

        const result = await SavedJob.findByUser(
            req.user.id, 
            parseInt(page), 
            parseInt(limit)
        );

        res.json(result);

    } catch (error) {
        console.error("Get saved jobs error:", error);
        res.status(500).json({
            message: "Error fetching saved jobs",
            error: error.message
        });
    }
};

// @desc Check if job is saved by user
exports.checkSavedJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const savedJob = await SavedJob.findByUserAndJob(req.user.id, jobId);

        res.json({
            isSaved: !!savedJob,
            savedJob: savedJob || null
        });

    } catch (error) {
        console.error("Check saved job error:", error);
        res.status(500).json({
            message: "Error checking saved job",
            error: error.message
        });
    }
};

// @desc Get save count for job
exports.getSavedJobCount = async (req, res) => {
    try {
        const { jobId } = req.params;

        const count = await SavedJob.getSaveCount(jobId);

        res.json({
            jobId,
            saveCount: count
        });

    } catch (error) {
        console.error("Get saved job count error:", error);
        res.status(500).json({
            message: "Error fetching saved job count",
            error: error.message
        });
    }
};
