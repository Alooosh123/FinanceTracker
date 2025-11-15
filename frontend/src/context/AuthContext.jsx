// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null); 
// عنوان الـ API الثابت. تأكد من أن الـ Backend يعمل على هذا المنفذ.
const API_URL = 'http://localhost:5000/api/auth'; 

// إعداد axios ليكون جاهزًا لاستخدام الرمز المميز
const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // التحميل الأولي: التحقق من التخزين المحلي
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setAuthHeader(token);
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    // دالة تسجيل الدخول
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            
            const { token, user } = response.data;
            
            // حفظ البيانات محليًا
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // تحديث حالة التطبيق وإعداد axios
            setAuthHeader(token);
            setUser(user);
            return true; // للإشارة إلى نجاح العملية
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message);
            // رمي الخطأ ليتم التعامل معه في الواجهة
            throw new Error(error.response?.data?.message || 'Login failed'); 
        }
    };

    // دالة تسجيل الخروج
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthHeader(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user // قيمة منطقية لتحديد حالة تسجيل الدخول
    };

    // عدم عرض أي شيء حتى يتم التحقق من حالة التحميل الأولي
    if (loading) return <div>Loading...</div>;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);