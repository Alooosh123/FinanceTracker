// frontend/src/components/SummaryCard.jsx
import React from 'react';

const SummaryCard = ({ summary }) => {
    
    const income = summary?.total_income || 0;
    const expense = summary?.total_expense || 0;
    const balance = summary?.balance || 0;
    
    if (!summary) return null;
    
    return (
        <div className="summary-section"> {/* 👈 استخدام summary-section */}
            <div className="summary-card"> {/* 👈 استخدام summary-card */}
                
                {/* بطاقة الدخل */}
                <div className="summary-item" style={{ backgroundColor: 'var(--success-color)', color: 'white' }}>
                    <h4>Total Income</h4>
                    <p className="amount">${income.toFixed(2)}</p>
                </div>

                {/* بطاقة المصروفات */}
                <div className="summary-item" style={{ backgroundColor: 'var(--danger-color)', color: 'white' }}>
                    <h4>Total Expense</h4>
                    <p className="amount">${expense.toFixed(2)}</p>
                </div>

                {/* بطاقة الرصيد */}
                <div className="summary-item" style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    color: 'white',
                    // يمكن استخدام تنسيق إضافي للرصيد السالب إذا أردت
                    // borderLeft: `5px solid ${balance >= 0 ? 'white' : 'yellow'}` 
                }}>
                    <h4>Net Balance</h4>
                    <p className="amount">${balance.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;