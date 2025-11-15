import React, { useState, useEffect } from 'react';
// يتم الآن استيراد الدوال من ملف API الموحد
import { addTransaction, getCategories } from '../api/transactions'; 

const TransactionForm = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0], // تنسيق YYYY-MM-DD الافتراضي
        description: '',
        category_id: '',
    });
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. جلب الفئات عند تحميل المكون
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                // إذا كان response يحتوي على رسالة خطأ، يجب التعامل معها
                if (response.message) {
                    setError(response.message);
                    return;
                }
                setCategories(response);
                // تعيين أول فئة كقيمة افتراضية إذا كانت هناك فئات
                if (response.length > 0) {
                    setFormData(prev => ({ ...prev, category_id: response[0].id.toString() }));
                }
            } catch (err) {
                setError('Failed to load categories. Please check server.');
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 2. معالجة إرسال النموذج
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // تحويل المبلغ إلى رقم
        const dataToSend = {
            ...formData,
            amount: Number(formData.amount),
            category_id: Number(formData.category_id), // التأكد أنه رقم
        };

        try {
            const response = await addTransaction(dataToSend);
            
            if (response.message && response.status >= 400) {
                // التعامل مع رسائل الخطأ المخصصة التي ترجعها handleApiError
                setError(response.message);
            } else {
                alert('Transaction added successfully!');
                setFormData(prev => ({ // مسح النموذج بعد النجاح
                    amount: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    category_id: categories.length > 0 ? categories[0].id.toString() : '',
                }));
                onTransactionAdded(); // إعلام الصفحة الأم لتحديث القائمة
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    // التحقق من وجود فئات
    if (categories.length === 0 && !isLoading) {
        return <p className="error-message">Error: Cannot add transaction. Please add categories first.</p>;
    }

    return (
        <div className="transaction-form-container">
            <h3>إضافة معاملة جديدة</h3>
            <form onSubmit={handleSubmit} className="transaction-form">
                {error && <p className="error-message">{error}</p>}
                
                {/* 1. المبلغ */}
                <input 
                    type="number" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleChange} 
                    placeholder="المبلغ (مثال: 500.00)" 
                    step="0.01" 
                    required 
                />

                {/* 2. التاريخ */}
                <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange} 
                    required 
                />

                {/* 3. الوصف */}
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="وصف المعاملة (مثل: دفع إيجار الشهر)" 
                    required 
                />

                {/* 4. الفئة */}
                <select 
                    name="category_id" 
                    value={formData.category_id} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">اختر الفئة</option>
                    {categories.map(cat => (
                        // التأكد من أن القيمة نصية لأن formData يعالجها كنص
                        <option key={cat.id} value={cat.id.toString()}>
                            {cat.name} ({cat.type === 'income' ? 'إيراد' : 'مصروف'})
                        </option>
                    ))}
                </select>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'جارِ الحفظ...' : 'حفظ المعاملة'}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;