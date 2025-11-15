// backend/routes/transactionRoutes.js

const express = require('express');
const router = express.Router();

// 1. استيراد جميع دوال الـ controller
const { 
    getSummary, 
    getTransactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
} = require('../controllers/transactionController'); 

// 🚨 2. إضافة استيراد ميدل-وير المصادقة (protect)
const { protect } = require('../middleware/auth');


// تعريف المسارات
router.get('/summary', protect, getSummary);
router.get('/', protect, getTransactions);
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);


module.exports = router;