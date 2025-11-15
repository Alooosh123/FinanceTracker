// backend/controllers/categoryController.js

const { query } = require('../config/db');

// @desc      الحصول على فئات المستخدم (العامة + الخاصة)
// @route     GET /api/categories
// @access    Private
const getCategories = async (req, res) => {
    const userId = parseInt(req.user);
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, user ID is missing or invalid.' });
    }

    try {
        // 🚨 التعديل: إضافة .trim() لضمان نظافة الاستعلام وتجنب مشاكل التركيب
        const sql = `
            SELECT id, name, type, user_id
            FROM categories 
            WHERE user_id = ? OR user_id IS NULL
            ORDER BY type, name
        `.trim(); // ✅ الحل: تطبيق .trim()
        
        const categories = await query(sql, [userId]);
        
        res.status(200).json(categories);

    } catch (error) {
        // ⚠️ مهم: إذا استمر الخطأ 500، يجب إرسال رسالة الخطأ الظاهرة في الـ Terminal هنا.
        console.error("Error fetching categories:", error); 
        res.status(500).json({ message: 'Server error while fetching categories.' });
    }
};

// @desc      إضافة فئة جديدة
// @route     POST /api/categories
// @access    Private
const addCategory = async (req, res) => {
    const { name, type } = req.body; 
    const userId = parseInt(req.user); 
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, user ID is missing or invalid.' });
    }

    if (!name || !type || (type !== 'income' && type !== 'expense')) {
        return res.status(400).json({ message: 'Category name and type (income or expense) are required.' });
    }

    try {
        // 1. تأكد من عدم وجود فئة بنفس الاسم لنفس المستخدم
        const existing = await query('SELECT id FROM categories WHERE user_id = ? AND name = ?', [userId, name]);
        if (existing.length > 0) {
            return res.status(400).json({ message: `Category '${name}' already exists for this user.` });
        }
        
        // 2. إدراج الفئة الجديدة
        const sql = `
            INSERT INTO categories (user_id, name, type)
            VALUES (?, ?, ?)
        `;
        const result = await query(sql, [userId, name, type]);
        
        res.status(201).json({ id: result.insertId, user_id: userId, name, type });
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ message: 'Server error while adding category.' });
    }
};

// @desc      تحديث فئة
// @route     PUT /api/categories/:id
// @access    Private
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    const userId = parseInt(req.user);

    if (!userId) {
        return res.status(401).json({ message: 'Not authorized.' });
    }
    if (!name || !type) {
        return res.status(400).json({ message: 'Category name and type are required.' });
    }

    try {
        // 1. فحص وجود الفئة وملكيتها
        const checkCategory = await query('SELECT user_id FROM categories WHERE id = ?', [id]);

        if (checkCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // لا تسمح بتعديل الفئات العامة
        if (checkCategory[0].user_id === null) {
            return res.status(403).json({ message: 'Cannot update a global category.' });
        }

        // تأكد من أن المستخدم يملك الفئة
        if (checkCategory[0].user_id !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this category.' });
        }

        // 2. تحديث البيانات
        const sql = `
            UPDATE categories 
            SET name = ?, type = ? 
            WHERE id = ? AND user_id = ?
        `;
        const result = await query(sql, [name, type, id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found or no changes made.' });
        }

        res.status(200).json({ id, name, type, message: 'Category updated successfully.' });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: 'Server error while updating category.' });
    }
};

// @desc      حذف فئة
// @route     DELETE /api/categories/:id
// @access    Private
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(req.user); 
    if (!userId) {
        return res.status(401).json({ message: 'Not authorized, user ID is missing or invalid.' });
    }

    try {
        // 1. فحص وجود الفئة
        const checkCategory = await query('SELECT user_id FROM categories WHERE id = ?', [id]);
        if (checkCategory.length === 0) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        // لا تسمح بحذف الفئات العامة
        if (checkCategory[0].user_id === null) {
            return res.status(403).json({ message: 'Cannot delete a global category.' });
        }

        // 2. تحقق من عدم وجود معاملات مرتبطة
        const transactionsCount = await query('SELECT COUNT(*) AS count FROM transactions WHERE category_id = ?', [id]);
        if (transactionsCount.length > 0 && transactionsCount[0].count > 0) {
            return res.status(400).json({ message: 'Cannot delete category with existing transactions.' });
        }
        
        // 3. حذف الفئة (مخصصة للمستخدم)
        const sql = `
            DELETE FROM categories 
            WHERE id = ? AND user_id = ?
        `;
        const result = await query(sql, [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found or not authorized.' });
        }
        
        res.status(200).json({ message: 'Category deleted successfully.' });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: 'Server error while deleting category.' });
    }
};

module.exports = {
    getCategories,
    addCategory,
    updateCategory, 
    deleteCategory,
};