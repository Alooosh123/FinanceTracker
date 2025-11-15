// frontend/src/components/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import { addCategory, updateCategory } from '../api/categories'; 

const CategoryForm = ({ currentCategory, onSave, onCancel }) => {
    const [name, setName] = useState('');
    // ❌ تم حذف حالة الوصف
    const [type, setType] = useState('expense'); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentCategory) {
            setName(currentCategory.name || '');
            // ❌ لا حاجة لتعيين الوصف
            setType(currentCategory.type || 'expense');
        } else {
            setName('');
            // ❌ لا حاجة لتعيين الوصف
            setType('expense');
        }
    }, [currentCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        // 💡 إرسال البيانات بدون الوصف 💡
        const categoryData = { name, type }; 
        
        try {
            if (currentCategory) {
                await updateCategory(currentCategory.id, categoryData);
            } else {
                await addCategory(categoryData);
            }
            
            onSave();
            
            // إعادة تعيين النموذج
            setName('');
            setType('expense');
        } catch (err) {
            const errorMessage = err.message || "فشل في حفظ الفئة. الرجاء المحاولة مرة أخرى.";
            setError(errorMessage);
            console.error(errorMessage, err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="category-form">
            <h3>{currentCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h3>
            
            {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <div className="form-group">
                <label htmlFor="name">اسم الفئة:</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="type">نوع الفئة:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    disabled={isLoading}
                >
                    <option value="expense">مصروف (Expense)</option>
                    <option value="income">دخل (Income)</option>
                </select>
            </div>
            
            {/* ❌ تم حذف حقل الوصف بالكامل ❌ */}

            <div className="form-actions">
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'جارِ الحفظ...' : 'حفظ الفئة'}
                </button>
                {currentCategory && (
                    <button type="button" onClick={onCancel} disabled={isLoading} className="cancel-button">
                        إلغاء التعديل
                    </button>
                )}
            </div>
        </form>
    );
};

export default CategoryForm;