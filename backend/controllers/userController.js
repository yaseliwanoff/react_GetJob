// controllers/userController.js
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// @desc Update user profile (name, avatar, company details)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, location, website, bio, companyName, companyDescription, companyWebsite } = req.body;
        
        const updateData = {};
        
        // Основные данные пользователя
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (location) updateData.location = location;
        if (website) updateData.website = website;
        if (bio) updateData.bio = bio;
        
        // Данные компании (только для работодателей)
        if (req.user.role === 'employer') {
            if (companyName !== undefined) updateData.company_name = companyName;
            if (companyDescription !== undefined) updateData.company_description = companyDescription;
            if (companyWebsite !== undefined) updateData.company_website = companyWebsite;
        }

        // Проверяем, не используется ли email другим пользователем
        if (email && email !== req.user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.id !== req.user.id) {
                return res.status(400).json({ 
                    message: "Email is already taken by another user" 
                });
            }
        }

        // Обновляем пользователя в Supabase
        const updatedUser = await User.update(req.user.id, updateData);

        // Подготавливаем ответ
        const userResponse = {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            resume: updatedUser.resume,
            phone: updatedUser.phone,
            location: updatedUser.location,
            website: updatedUser.website,
            bio: updatedUser.bio,
            company_name: updatedUser.company_name,
            company_description: updatedUser.company_description,
            company_website: updatedUser.company_website,
            company_logo: updatedUser.company_logo,
            created_at: updatedUser.created_at,
            updated_at: updatedUser.updated_at
        };

        res.json({
            message: "Profile updated successfully",
            user: userResponse
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ 
            message: "Error updating profile",
            error: error.message 
        });
    }
};

// @desc Delete resume file (Jobseeker only)
exports.deleteResume = async (req, res) => {
    try {
        // Проверяем, является ли пользователь соискателем
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({ 
                message: "Only job seekers can delete resumes" 
            });
        }

        const user = await User.findById(req.user.id);
        
        if (!user.resume) {
            return res.status(400).json({ 
                message: "No resume found to delete" 
            });
        }

        // Удаляем файл резюме с сервера (если хранится локально)
        if (user.resume.startsWith('/uploads/') || user.resume.startsWith('uploads/')) {
            const filePath = path.join(__dirname, '..', user.resume);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Resume file deleted: ${filePath}`);
            }
        }

        // Обновляем пользователя в Supabase - удаляем ссылку на резюме
        const updatedUser = await User.update(req.user.id, { resume: null });

        res.json({
            message: "Resume deleted successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                resume: updatedUser.resume
            }
        });

    } catch (error) {
        console.error("Delete resume error:", error);
        res.status(500).json({ 
            message: "Error deleting resume",
            error: error.message 
        });
    }
};

// @desc Get user public profile
exports.getPublicProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Публичные данные (исключаем чувствительную информацию)
        const publicProfile = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            bio: user.bio,
            website: user.website,
            location: user.location,
            role: user.role,
            created_at: user.created_at
        };

        // Добавляем данные компании для работодателей
        if (user.role === 'employer') {
            publicProfile.company_name = user.company_name;
            publicProfile.company_description = user.company_description;
            publicProfile.company_website = user.company_website;
            publicProfile.company_logo = user.company_logo;
        }

        // Для соискателей можно добавить публичную информацию
        if (user.role === 'jobseeker') {
            publicProfile.skills = user.skills || [];
            publicProfile.experience = user.experience || [];
            publicProfile.education = user.education || [];
        }

        res.json({
            user: publicProfile
        });

    } catch (error) {
        console.error("Get public profile error:", error);
        res.status(500).json({ 
            message: "Error fetching public profile",
            error: error.message 
        });
    }
};

// @desc Upload avatar
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                message: "Please upload an image file" 
            });
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        
        // Обновляем аватар пользователя в Supabase
        const updatedUser = await User.update(req.user.id, { avatar: avatarPath });

        res.json({
            message: "Avatar uploaded successfully",
            avatar: updatedUser.avatar
        });

    } catch (error) {
        console.error("Upload avatar error:", error);
        res.status(500).json({ 
            message: "Error uploading avatar",
            error: error.message 
        });
    }
};

// @desc Upload resume
exports.uploadResume = async (req, res) => {
    try {
        // Проверяем, является ли пользователь соискателем
        if (req.user.role !== 'jobseeker') {
            return res.status(403).json({ 
                message: "Only job seekers can upload resumes" 
            });
        }

        if (!req.file) {
            return res.status(400).json({ 
                message: "Please upload a resume file" 
            });
        }

        const resumePath = `/uploads/resumes/${req.file.filename}`;
        
        // Обновляем резюме пользователя в Supabase
        const updatedUser = await User.update(req.user.id, { resume: resumePath });

        res.json({
            message: "Resume uploaded successfully",
            resume: updatedUser.resume
        });

    } catch (error) {
        console.error("Upload resume error:", error);
        res.status(500).json({ 
            message: "Error uploading resume",
            error: error.message 
        });
    }
};
