// routes/userRoutes.js
const express = require("express");
const {
    updateProfile,
    deleteResume,
    getPublicProfile,
    uploadAvatar,
    uploadResume
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Protected routes
router.put("/profile", protect, updateProfile);
router.delete("/resume", protect, deleteResume);
router.post("/upload-avatar", protect, upload.single('avatar'), uploadAvatar);
router.post("/upload-resume", protect, upload.single('resume'), uploadResume);

// Public route
router.get("/:id", getPublicProfile);

module.exports = router;
