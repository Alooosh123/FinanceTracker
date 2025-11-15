// frontend/src/components/CategoryPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// تسجيل العناصر الضرورية لـ Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// توليد ألوان عشوائية للرسوم البيانية
const generateRandomColors = (num) => {
    const colors = [];
    for (let i = 0; i < num; i++) {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    return colors;
};

const CategoryPieChart = ({ transactions }) => {
    
    // 1. تجميع المصروفات حسب الفئة
    const expenseData = transactions.reduce((acc, t) => {
        // نعتمد على أن category_type تم جلبه من الـ API بشكل صحيح
        if (t.category_type === 'expense') {
            const categoryName = t.category_name;
            const amount = parseFloat(t.amount);
            
            // نجمع المبالغ لكل فئة
            acc[categoryName] = (acc[categoryName] || 0) + amount;
        }
        return acc;
    }, {});
    
    // 2. تجهيز البيانات لـ Chart.js
    const labels = Object.keys(expenseData);
    const dataValues = Object.values(expenseData);
    const backgroundColors = generateRandomColors(labels.length);

    if (labels.length === 0) {
        return <p style={{ textAlign: 'center', color: 'var(--secondary-color)' }}>No expense data to display.</p>;
    }

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Expense Amount',
                data: dataValues,
                backgroundColor: backgroundColors,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Expense Distribution by Category',
            },
        },
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: 'var(--white)', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default CategoryPieChart;