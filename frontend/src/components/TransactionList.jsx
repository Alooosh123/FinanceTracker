// frontend/src/components/TransactionList.jsx
import React from 'react';
import { deleteTransaction } from '../api/transactions'; 

const TransactionList = ({ transactions, onDelete }) => {
    
    if (!transactions || transactions.length === 0) {
        return (
            <div className="no-data">
                No transactions recorded yet.
            </div>
        );
    }

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            const response = await deleteTransaction(id);
            if (response.message) {
                onDelete();
            } else {
                alert('Failed to delete transaction.');
            }
        }
    };

    return (
        <div className="transactions-section"> {/* 👈 استخدام transactions-section */}
            <h2 className="auth-title" style={{ color: 'var(--dark-text)', marginBottom: '15px' }}>Recent Transactions</h2>
            <div className="transaction-list"> {/* 👈 استخدام transaction-list */}
                {transactions.map((t) => (
                    <div 
                        key={t.id} 
                        className={`transaction-item ${t.category_type === 'income' ? 'income' : 'expense'}`}
                    >
                        <div className="details">
                             <span className="date">{new Date(t.date).toLocaleDateString()}</span>
                            <span className="description">{t.description || '-'}</span>
                            <span style={{ fontSize: '14px', color: 'var(--secondary-color)' }}>
                                {t.category_name} ({t.user_name || 'N/A'})
                            </span>
                        </div>
                        
                        <div className="actions">
                            <span className={`amount ${t.category_type === 'income' ? 'green' : 'red'}`}>
                                {t.category_type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                            </span>
                            <button 
                                onClick={() => handleDelete(t.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;