// frontend/src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ملفات الموارد (الترجمات)
const resources = {
  // 💡 اللغة العربية
  ar: {
    translation: {
      "app_name": "متعقب الشؤون المالية",
      "login_title": "تسجيل الدخول",
      "register_title": "تسجيل جديد",
      "dashboard_title": "لوحة التحكم",
      "categories_title": "إدارة الفئات",
      "logout": "تسجيل الخروج",
      "total_income": "إجمالي الإيرادات",
      "total_expense": "إجمالي المصروفات",
      "current_balance": "الرصيد الحالي",
      "add_new_transaction": "إضافة معاملة جديدة",
      "save_transaction": "حفظ المعاملة",
      "amount_placeholder": "المبلغ (مثال: 500.00)",
      "description_placeholder": "وصف المعاملة (مثال: دفع إيجار الشهر)",
      "date": "التاريخ",
      "description": "الوصف",
      "category": "الفئة",
      "amount": "المبلغ",
      "actions": "الإجراءات",
      "delete": "حذف",
      "recent_transactions": "المعاملات الأخيرة",
      "no_transactions": "لا توجد معاملات بعد.",
      // ... (أضف المزيد من النصوص حسب الحاجة)
    }
  },
  // 💡 اللغة الإنجليزية
  en: {
    translation: {
      "app_name": "Finance Tracker",
      "login_title": "Login",
      "register_title": "Register",
      "dashboard_title": "Dashboard",
      "categories_title": "Manage Categories",
      "logout": "Logout",
      "total_income": "Total Income",
      "total_expense": "Total Expenses",
      "current_balance": "Current Balance",
      "add_new_transaction": "Add New Transaction",
      "save_transaction": "Save Transaction",
      "amount_placeholder": "Amount (e.g., 500.00)",
      "description_placeholder": "Transaction Description (e.g., Pay rent)",
      "date": "Date",
      "description": "Description",
      "category": "Category",
      "amount": "Amount",
      "actions": "Actions",
      "delete": "Delete",
      "recent_transactions": "Recent Transactions",
      "no_transactions": "No transactions yet.",
      // ... (أضف المزيد من النصوص حسب الحاجة)
    }
  }
};

i18n
  .use(LanguageDetector) // للكشف التلقائي عن لغة المتصفح
  .use(initReactI18next) // لتوصيل i18next بـ React
  .init({
    resources,
    fallbackLng: "ar", // اللغة الاحتياطية
    // lng: "ar", // يمكن تحديد اللغة الأولية يدوياً إذا لم ترغب في استخدام الكاشف
    debug: true, // قم بتعيينها إلى false في مرحلة الإنتاج
    interpolation: {
      escapeValue: false // React آمن من XSS
    }
  });

export default i18n;