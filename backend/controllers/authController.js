const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    تسجيل مستخدم جديد
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    try {
        // 1. تحقق مما إذا كان المستخدم موجودًا بالفعل
        let users = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // 2. تشفير كلمة المرور
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. إنشاء المستخدم
        const result = await query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        const newUserId = result.insertId;
        
        // 4. لا يوجد استدعاء لـ addDefaultCategories هنا. يعتمد المستخدم على الفئات العامة (user_id IS NULL).

        // 5. إنشاء التوكن وإرجاعه
        const token = jwt.sign({ id: newUserId }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            token,
            user: { id: newUserId, username, email }
        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    تسجيل دخول المستخدم
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    try {
        // 1. البحث عن المستخدم
        const users = await query('SELECT id, username, password FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 2. مطابقة كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // 3. إنشاء التوكن وإرجاعه
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: { id: user.id, username: user.username, email }
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};