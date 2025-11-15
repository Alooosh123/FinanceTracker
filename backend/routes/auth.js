// backend/routes/auth.js

const express = require('express');
const router = express.Router();

// 1. استيراد الدوال مباشرة من المتحكم (Controller)
const { registerUser, loginUser } = require('../controllers/authController');

// 2. ربط الدوال بالمسارات
// تأكد من عدم وجود أقواس () بعد اسم الدالة!
router.post('/register', registerUser); // 👈 (هذا هو السطر 7 على الأغلب)
router.post('/login', loginUser);

module.exports = router;