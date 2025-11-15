// frontend/src/pages/Dashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import TransactionForm from '../components/TransactionForm';
import Header from '../components/Header'; 
import CategoryManagementPage from './CategoryManagementPage'; 
import { getSummary, getTransactions, deleteTransaction } from '../api/transactions';
import '../index.css'; 

const VIEWS = {
    HOME: 'home',
    CATEGORIES: 'categories' 
};

const Dashboard = () => {
    const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentView, setCurrentView] = useState(VIEWS.HOME); 

    const onViewChange = useCallback((view) => {
        setCurrentView(view);
    }, []);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // جلب الملخص
            const summaryResponse = await getSummary();
            if (summaryResponse.message) throw new Error(summaryResponse.message);
            setSummary(summaryResponse);

            // جلب المعاملات
            const transactionsResponse = await getTransactions();
            if (transactionsResponse.message) throw new Error(transactionsResponse.message);
            setTransactions(transactionsResponse);
            
        } catch (err) {
            setError(err.message || 'فشل في جلب بيانات لوحة التحكم.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentView === VIEWS.HOME) {
            fetchData();
        }
    }, [fetchData, currentView]);

    const handleDelete = async (id) => {
        if (window.confirm("هل أنت متأكد من حذف هذه المعاملة؟")) {
            try {
                const response = await deleteTransaction(id);
                if (response.message && response.status >= 400) throw new Error(response.message);
                fetchData(); 
            } catch (err) {
                setError(err.message || 'فشل في حذف المعاملة.');
            }
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (isLoading && currentView === VIEWS.HOME) return <div className="loading">جارِ تحميل لوحة التحكم...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="app-container">
            <Header onViewChange={onViewChange} /> 

            <div className="dashboard-container"> 
                
                {currentView === VIEWS.HOME && (
                    <>
                        
                        {/* 1. ملخص الأرصدة */}
                        <div className="summary-section">
                            <div className="summary-card"> 
                                <div className="summary-item income">
                                    <h4>إجمالي الإيرادات</h4>
                                    {/* الإيرادات دائماً خضراء */}
                                    <p className="amount green">{summary.total_income.toFixed(2)}</p>
                                </div>
                                <div className="summary-item expense">
                                    <h4>إجمالي المصروفات</h4>
                                    {/* المصروفات دائماً حمراء */}
                                    <p className="amount red">{summary.total_expense.toFixed(2)}</p>
                                </div>
                                <div className="summary-item balance">
                                    <h4>الرصيد الحالي</h4>
                                    {/* الرصيد: أخضر إذا كان موجباً، أحمر إذا كان سالباً */}
                                    <p className={`amount ${summary.balance >= 0 ? 'green' : 'red'}`}>
                                        {summary.balance.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="content-layout">
                            {/* 2. نموذج الإضافة */}
                            <div className="form-section"> 
                                <TransactionForm onTransactionAdded={fetchData} />
                            </div>
                            
                            {/* 3. قائمة المعاملات */}
                            <div className="transactions-section"> 
                                <h3>المعاملات الأخيرة</h3>
                                <table className="transactions-table">
                                    <thead>
                                        <tr>
                                            <th>التاريخ</th>
                                            <th>الوصف</th>
                                            <th>الفئة</th>
                                            <th>المبلغ</th>
                                            <th>الإجراءات</th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length > 0 ? (
                                            transactions.map(t => (
                                                <tr key={t.id} className={t.category_type}>
                                                    <td>{formatDate(t.date)}</td>
                                                    <td>{t.description}</td>
                                                    <td>{t.category_name}</td>
                                                    {/* المبلغ: أخضر للإيراد (income)، أحمر للمصروف (expense) */}
                                                    <td className={`amount ${t.category_type === 'income' ? 'green' : 'red'}`}>
                                                        {t.category_type === 'expense' ? '-' : '+'}
                                                        {Number(t.amount).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {/* زر الحذف مُعاد */}
                                                        <button onClick={() => handleDelete(t.id)} className="delete-btn">حذف</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-data">لا توجد معاملات بعد.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
                
                {currentView === VIEWS.CATEGORIES && (
                    <CategoryManagementPage />
                )}
            </div>
        </div>
    );
};

export default Dashboard;