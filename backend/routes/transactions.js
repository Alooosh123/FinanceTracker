const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

// @route   GET /api/transactions/summary
// @desc    الحصول على ملخص المعاملات
// @access  Private
router.get('/summary', protect, transactionController.getSummary);

// @route   GET /api/transactions
// @desc    الحصول على جميع المعاملات
// @access  Private
router.get('/', protect, transactionController.getTransactions);

// @route   POST /api/transactions
// @desc    إضافة معاملة جديدة (يجب أن يكون محميًا بـ 'protect')
// @access  Private
router.post('/', protect, transactionController.addTransaction);

// @route   DELETE /api/transactions/:id
// @desc    حذف معاملة
// @access  Private
router.delete('/:id', protect, transactionController.deleteTransaction);

module.exports = router;