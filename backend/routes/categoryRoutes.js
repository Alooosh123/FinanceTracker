const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    addCategory,
    updateCategory, // 💡 تم الاستيراد 💡
    deleteCategory 
} = require('../controllers/categoryController'); 

const { protect } = require('../middleware/auth');

// 1. المسار الأساسي: /api/categories
router.route('/')
    .get(protect, getCategories)     
    .post(protect, addCategory);      

// 2. المسار الذي يتطلب ID: /api/categories/:id
router.route('/:id')
    .put(protect, updateCategory) // 💡 تم تحديد المسار 💡
    .delete(protect, deleteCategory); 

module.exports = router;