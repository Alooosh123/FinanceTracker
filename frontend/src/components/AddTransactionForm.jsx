// frontend/src/components/AddTransactionForm.jsx
import React, { useState, useEffect } from 'react';
import { addTransaction, getCategories } from '../api/transactions'; 

const AddTransactionForm = ({ onAdd, onClose }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await getCategories();
            setCategories(cats);
            if (cats.length > 0) {
                const defaultCat = cats.find(c => c.type === 'expense') || cats[0];
                setSelectedCategory(defaultCat.id);
            }
        };
        fetchCategories();
    }, []);
    
    const filteredCategories = categories;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const numericAmount = parseFloat(amount);
        const trimmedDescription = description.trim(); 

        if (!numericAmount || numericAmount <= 0 || !date || !selectedCategory || !trimmedDescription) {
            setError('Please ensure all required fields (Amount > 0, Date, Category, and Description) are filled.');
            setLoading(false);
            return;
        }

        const transactionData = {
            amount: Math.abs(numericAmount), 
            description: trimmedDescription, 
            date,
            category_id: selectedCategory, 
        };

        try {
            const response = await addTransaction(transactionData);
            
            if (response.status === 400 || response.status === 500) {
                setError(response.message || 'Error occurred while saving transaction. Check server logs.');
            } else {
                onAdd(); 
                onClose();
            }

        } catch (err) {
            setError(err.message || 'Failed to add transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-section" style={{ maxWidth: '500px' }}> {/* 👈 استخدام form-section */}
            <h2 className="auth-title" style={{ marginBottom: '20px' }}>Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="auth-form"> {/* 👈 استخدام auth-form للتنسيق */}
                {error && <p className="error-message">{error}</p>}
                
                <input
                    type="number"
                    step="0.01"
                    placeholder="Amount (e.g., 150)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />

                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>-- Select Category --</option>
                    {filteredCategories.map(cat => (
                        <option key={cat.id} value={cat.id}> 
                            {cat.name} ({cat.type === 'income' ? 'دخل' : 'مصروف'})
                        </option>
                    ))}
                </select>

                <textarea
                    placeholder="Description (e.g., Dinner at ABC restaurant) - Required"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ backgroundColor: 'var(--secondary-color)' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ backgroundColor: 'var(--success-color)' }}
                    >
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTransactionForm;