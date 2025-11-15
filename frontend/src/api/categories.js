// frontend/src/api/categories.js
import axios from 'axios';

const API_URL = '/api/categories'; 

// 1. جلب جميع الفئات - تم التعديل لضمان إرجاع مصفوفة
export const getCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        
        // التحقق من أن البيانات العائدة هي مصفوفة. هذا يحل خطأ .map
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn("API returned non-array data for categories:", response.data);
            return []; // إرجاع مصفوفة فارغة لتجنب الخطأ
        }

    } catch (error) {
        console.error("Error fetching categories:", error.response?.data || error.message);
        throw error;
    }
};

// 2. إضافة فئة جديدة
export const addCategory = async (categoryData) => {
    try {
        const response = await axios.post(API_URL, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error adding category:", error.response?.data || error.message);
        throw error;
    }
};

// 3. تعديل فئة موجودة
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error("Error updating category:", error.response?.data || error.message);
        throw error;
    }
};

// 4. حذف فئة
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting category:", error.response?.data || error.message);
        throw error;
    }
};