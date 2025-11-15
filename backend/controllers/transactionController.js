// backend/controllers/transactionController.js

const { query } = require('../config/db');

// @desc      الحصول على ملخص المعاملات (الدخل والمصروفات والرصيد)
// @route     GET /api/transactions/summary
// @access    Private
const getSummary = async (req, res) => {
    try {
        const userId = parseInt(req.user); 
        
        if (isNaN(userId) || !userId) {
            return res.status(401).json({ message: 'Not authorized, user ID is missing or invalid.' });
        }
        
        // 🚨 استعلام مُحسَّن و آمن: باستخدام LEFT JOIN و .trim()
        const sql = `
            SELECT 
                COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
                COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.user_id = ?
        `.trim();
        
        const results = await query(sql, [userId]);
        
        const { total_income, total_expense } = results[0] || { total_income: 0, total_expense: 0 };

        const income = Number(total_income) || 0;
        const expense = Number(total_expense) || 0;
        const balance = income - expense; 
        
        res.status(200).json({
            total_income: parseFloat(income.toFixed(2)),
            total_expense: parseFloat(expense.toFixed(2)),
            balance: parseFloat(balance.toFixed(2)) 
        });

    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: 'Server error while fetching summary.' });
    }
};

// @desc      الحصول على جميع المعاملات للمستخدم (مع اسم الفئة والنوع)
// @route     GET /api/transactions
// @access    Private
const getTransactions = async (req, res) => {
    try {
        const userId = parseInt(req.user); 
        
        const sql = `
            SELECT 
                t.id, 
                t.date, 
                t.amount, 
                t.description,
                c.name AS category_name,
                c.type AS category_type
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = ?
            ORDER BY t.date DESC
        `;
        const transactions = await query(sql, [userId]);
        
        res.status(200).json(transactions);

    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: 'Server error while fetching transactions.' });
    }
};

// @desc      إضافة معاملة جديدة
// @route     POST /api/transactions
// @access    Private
const addTransaction = async (req, res) => {
    const { date, amount, description, category_id } = req.body; 
    const userId = parseInt(req.user);

    if (!date || !category_id || typeof amount !== 'number' || amount <= 0 || !description || description.trim() === '') { 
        return res.status(400).json({ 
            message: 'Please include valid date, category ID, positive amount, and a description.' 
        });
    }
    
    try {
        const categoryCheck = await query(
            'SELECT id FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)', 
            [category_id, userId]
        );
        if (categoryCheck.length === 0) {
            return res.status(404).json({ message: 'Category not found or not accessible.' });
        }

        const sql = `
            INSERT INTO transactions (user_id, date, amount, description, category_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [userId, date, amount, description, category_id]);
        
        res.status(201).json({ id: result.insertId, user_id: userId, date, amount, description, category_id });
        
    } catch (error) {
        console.error("Error adding transaction:", error); 
        res.status(500).json({ message: 'Server error while adding transaction.' });
    }
};

// @desc      تحديث معاملة موجودة
// @route     PUT /api/transactions/:id
// @access    Private
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { date, amount, description, category_id } = req.body;
    const userId = parseInt(req.user);

    if (!userId) return res.status(401).json({ message: 'Not authorized.' });

    if (!amount || !date || !category_id) {
        return res.status(400).json({ message: 'Amount, date, and category are required for update.' });
    }

    try {
        const checkTransaction = await query('SELECT user_id FROM transactions WHERE id = ?', [id]);
        if (checkTransaction.length === 0 || checkTransaction[0].user_id !== userId) {
            return res.status(404).json({ message: 'Transaction not found or not authorized.' });
        }
        
        const sql = `
            UPDATE transactions 
            SET date = ?, amount = ?, description = ?, category_id = ?
            WHERE id = ? AND user_id = ?
        `;
        const result = await query(sql, [date, amount, description, category_id, id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found or no changes made.' });
        }

        res.status(200).json({ id, date, amount, description, category_id, message: 'Transaction updated successfully.' });
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: 'Server error while updating transaction.' });
    }
};

// @desc      حذف معاملة
// @route     DELETE /api/transactions/:id
// @access    Private
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(req.user);

    try {
        const sql = `
            DELETE FROM transactions 
            WHERE id = ? AND user_id = ?
        `;
        const result = await query(sql, [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found or not authorized.' });
        }
        
        res.status(200).json({ message: 'Transaction deleted successfully.' });

    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: 'Server error while deleting transaction.' });
    }
};

module.exports = {
    getSummary,
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
};