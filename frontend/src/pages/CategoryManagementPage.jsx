import React, { useState, useEffect, useCallback } from 'react';
import { getCategories, deleteCategory } from '../api/categories';
import CategoryForm from '../components/CategoryForm';
import CategoryItem from '../components/CategoryItem';
import useAuth from '../hooks/useAuth'; 
import './CategoryManagementPage.css';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useAuth(); // استخدام التوكين إذا لزم الأمر

    // دالة لجلب الفئات
    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message || "فشل في جلب الفئات."); 
            console.error("Error fetching categories:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSave = () => {
        setCurrentCategory(null);
        fetchCategories(); // إعادة جلب القائمة بعد الإضافة/التعديل
    };

    const handleEditCategory = (category) => {
        setCurrentCategory(category);
    };

    // 💡 الدالة التي تستقبل ID وتنفذ منطق التأكيد والحذف 💡
    const handleDeleteCategory = async (id) => {
        // نضع التأكيد هنا
        if (window.confirm("هل أنت متأكد من رغبتك في حذف هذه الفئة؟")) {
            setIsLoading(true);
            try {
                // استخدام الـ ID الممرر مباشرةً لـ API
                await deleteCategory(id); 
                fetchCategories(); // إعادة جلب القائمة بعد الحذف
            } catch (err) {
                // رسالة الخطأ ستظهر الآن في الواجهة الأمامية
                setError(err.message || "فشل في حذف الفئة. تأكد من عدم وجود معاملات مرتبطة بها.");
                console.error("Error deleting category:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setCurrentCategory(null);
    };

    return (
        <div className="category-management-page">
            <h2>إدارة الفئات</h2>
            
            {error && <p className="error-message">{error}</p>}
            
            <CategoryForm 
                currentCategory={currentCategory}
                onSave={handleSave}
                onCancel={handleCancelEdit}
            />

            <div className="category-list">
                <h3>الفئات الموجودة</h3>
                
                {isLoading ? (
                    <p>جارِ التحميل...</p>
                ) : categories.length > 0 ? (
                    <div className="category-items-container">
                        {categories.map(category => (
                            <CategoryItem 
                                key={category.id} 
                                category={category}
                                onEdit={handleEditCategory}
                                // 💡 تمرير دالة الحذف 💡
                                onDelete={handleDeleteCategory} 
                            />
                        ))}
                    </div>
                ) : (
                    <p>لا توجد فئات متاحة حاليًا.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryManagementPage;