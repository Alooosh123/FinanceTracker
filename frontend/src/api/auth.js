// frontend/src/api/auth.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// وظيفة تسجيل مستخدم جديد
export const registerUser = async (username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { username, email, password });
        // عند التسجيل الناجح، الواجهة الخلفية تُرجع الرمز المميز مباشرة
        return response.data; 
    } catch (error) {
        // رمي الخطأ ليتم التعامل معه في صفحة التسجيل
        throw new Error(error.response.data.message || 'Registration failed');
    }
};

// وظيفة تسجيل الدخول (تم استخدامها في AuthContext، لكن يمكن استخدامها هنا أيضًا)
// سنتركها في AuthContext لأنها تتعامل مباشرة مع حالة التطبيق (State)