// frontend/src/components/CategoryItem.jsx
import React from 'react-dom'; 
// لا نحتاج لاستيراد deleteCategory هنا إذا كنا سنستخدم onDelete المُمرَّرة

// ملاحظة: قمنا بتغيير onDeleteSuccess إلى onDelete لتتناسب مع تسمية صفحة الإدارة
const CategoryItem = ({ category, onEdit, onDelete }) => {
    
    const handleDelete = () => {
        // 💡 (category.user_id === null) يعني أنها فئة عامة لا يمكن حذفها 💡
        if (category.user_id === null) {
            alert("لا يمكن حذف الفئات العامة.");
            return;
        }

        // 💡 نستخدم prop المُمرَّر onDelete ونمرر له المُعرِّف الصحيح (category.id) 💡
        onDelete(category.id); 
    };

    return (
        <div className="category-item">
            <div className="details">
                <h4>{category.name}</h4>
                {/* حقل الوصف غير موجود في الجدول، لذا يجب التحقق منه أو إزالته */}
                <p className="type">
                    النوع: <span className={category.type}>{category.type === 'income' ? 'إيراد' : 'مصروف'}</span>
                </p>
            </div>
            <div className="actions">
                <button 
                    onClick={() => onEdit(category)} 
                    className="edit-button"
                    disabled={category.user_id === null} // لا يمكن تعديل الفئات العامة
                >
                    تعديل
                </button>
                
                <button 
                    onClick={handleDelete} 
                    className="delete-button"
                    // 💡 تعطيل الزر إذا كانت الفئة عامة 💡
                    disabled={category.user_id === null} 
                >
                    حذف
                </button>
            </div>
        </div>
    );
};

export default CategoryItem;