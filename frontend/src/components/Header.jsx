// frontend/src/components/Header.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // 💡 استيراد خطاف الترجمة
import './Header.css';

const Header = ({ onViewChange }) => {
    const { t, i18n } = useTranslation(); // 💡 استخدام خطاف الترجمة

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // 💡 دالة تبديل اللغة
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        // تحديث اتجاه النص العام إذا لزم الأمر (خاصة لـ RTL/LTR)
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };
    
    // 💡 تحديد لغة العرض الحالية
    const currentLanguage = i18n.language.startsWith('ar') ? 'ar' : 'en';

    return (
        <header className="main-header">
            <div className="header-content">
                
                {/* 💡 1. قائمة تبديل اللغة (أعلى اليسار) */}
                <div className="language-switcher">
                    <select 
                        onChange={(e) => changeLanguage(e.target.value)} 
                        value={currentLanguage}
                        className="language-select"
                    >
                        <option value="ar">العربية (AR)</option>
                        <option value="en">English (EN)</option>
                    </select>
                </div>
                
                {/* 2. الشعار أو اسم التطبيق */}
                <div className="logo">
                    <a href="/dashboard">{t("app_name")}</a> {/* 💡 ترجمة اسم التطبيق */}
                </div>

                {/* 3. عناصر التنقل (اليمن) */}
                <div className="nav-group-right">
                    <nav>
                        <ul className="navList">
                            <li onClick={() => onViewChange('home')}>
                                <a className="nav-item-link">{t("dashboard_title")}</a> {/* 💡 ترجمة لوحة التحكم */}
                            </li>
                            <li onClick={() => onViewChange('categories')}>
                                <a className="nav-item-link">{t("categories_title")}</a> {/* 💡 ترجمة إدارة الفئات */}
                            </li>
                        </ul>
                    </nav>
                    <div className="logout-group">
                        <button onClick={handleLogout} className="logout-btn">
                            {t("logout")} {/* 💡 ترجمة تسجيل الخروج */}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;