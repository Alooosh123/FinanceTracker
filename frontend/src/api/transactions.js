// frontend/src/api/transactions.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    }
    return {
        status: error.response?.status,
        message: error.response?.data?.message || 'Failed to connect to server.',
    };
};

// دوال المصادقة (Auth)
export const login = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, formData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Login failed due to server error.';
    }
};

export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, formData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed due to server error.';
    }
};

export const logout = () => {
    localStorage.removeItem('token'); 
    window.location.href = '/login'; 
};

// دوال المعاملات (Transactions)
export const getSummary = async () => {
    try {
        const response = await API.get('/transactions/summary');
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const getTransactions = async () => {
    try {
        const response = await API.get('/transactions');
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const addTransaction = async (formData) => {
    try {
        const response = await API.post('/transactions', formData);
        return response.data;
    } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 500)) {
            // رسالة الخطأ هذه هي التي تظهر عندما يكون category_id غير موجود أو البيانات غير صالحة
            return { status: error.response.status, message: error.response.data.message || 'Error saving transaction.' };
        }
        return handleApiError(error);
    }
};

export const updateTransaction = async (id, formData) => {
    try {
        const response = await API.put(`/transactions/${id}`, formData);
        return response.data;
    } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 500)) {
            // يمكن أن تكون رسالة خطأ التحقق من الصحة أو خطأ الخادم
            return { status: error.response.status, message: error.response.data.message || 'Error updating transaction.' };
        }
        return handleApiError(error);
    }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await API.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

// دوال الفئات (Categories)
export const getCategories = async () => {
    try {
        const response = await API.get('/categories');
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};