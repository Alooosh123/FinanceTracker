const jwt = require('jsonwebtoken');

// وظيفة حماية المسارات (Protect Routes)
const protect = (req, res, next) => {
    let token;

    // 1. التحقق من وجود التوكن في هيدر Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // استخراج التوكن من الهيدر (Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // 2. التحقق من صحة التوكن وفك تشفيره
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. إضافة مُعرّف المستخدم (user_id) إلى الطلب
            req.user = decoded.id; 

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            // إرسال 401 Unauthorized إذا فشل التحقق
            res.status(401).json({ message: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        // إرسال 401 إذا لم يتم إرسال أي توكن
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = { protect };