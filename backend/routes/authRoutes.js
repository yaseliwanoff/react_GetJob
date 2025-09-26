// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");

// Регистрация
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, companyName, companyDescription } = req.body;

    // Валидация полей
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        message: "Please provide name, email, password, and role" 
      });
    }

    if (!['jobseeker', 'employer'].includes(role)) {
      return res.status(400).json({ 
        message: "Role must be either 'jobseeker' or 'employer'" 
      });
    }

    // Проверка существования пользователя
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Хеширование пароля
    const hashedPassword = await User.hashPassword(password);

    // Подготовка данных пользователя
    const userData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    // Добавляем данные компании если это работодатель
    if (role === 'employer') {
      if (!companyName) {
        return res.status(400).json({ 
          message: "Company name is required for employers" 
        });
      }
      userData.company_name = companyName;
      userData.company_description = companyDescription || '';
    }

    // Создание пользователя
    const user = await User.create(userData);

    // Возвращаем данные без пароля
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      company_name: user.company_name,
      company_description: user.company_description,
      created_at: user.created_at
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Error registering user",
      error: error.message 
    });
  }
});

// Вход
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Валидация полей
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide email and password" 
      });
    }

    // Поиск пользователя
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Проверка пароля
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Подготовка ответа
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resume: user.resume,
      company_name: user.company_name,
      company_description: user.company_description,
      company_logo: user.company_logo,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      message: "Login successful",
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Error logging in",
      error: error.message 
    });
  }
});

// Получение текущего пользователя
router.get("/me", protect, async (req, res) => {
  try {
    // req.user устанавливается в middleware protect
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      resume: user.resume,
      company_name: user.company_name,
      company_description: user.company_description,
      company_logo: user.company_logo,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      user: userResponse
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ 
      message: "Error fetching user data",
      error: error.message 
    });
  }
});

// Обновление профиля
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, avatar, resume, companyName, companyDescription, companyLogo } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (resume) updateData.resume = resume;
    
    // Обновляем данные компании только для работодателей
    if (req.user.role === 'employer') {
      if (companyName) updateData.company_name = companyName;
      if (companyDescription) updateData.company_description = companyDescription;
      if (companyLogo) updateData.company_logo = companyLogo;
    }

    const updatedUser = await User.update(req.user.id, updateData);

    const userResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      resume: updatedUser.resume,
      company_name: updatedUser.company_name,
      company_description: updatedUser.company_description,
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
});

// Смена пароля
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Please provide current and new password" 
      });
    }

    // Получаем пользователя с паролем
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Проверяем текущий пароль
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Хешируем новый пароль
    const hashedPassword = await User.hashPassword(newPassword);

    // Обновляем пароль
    await User.update(req.user.id, { password: hashedPassword });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ 
      message: "Error changing password",
      error: error.message 
    });
  }
});

// Проверка существования email
router.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findByEmail(email);
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({ 
      message: "Error checking email",
      error: error.message 
    });
  }
});

module.exports = router;
