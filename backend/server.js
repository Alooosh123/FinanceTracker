// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <--- المكتبة المسؤولة عن حل المشكلة
const path = require('path');
const { connectDB } = require('./config/db');

// استيراد المسارات
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactionRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const corsOptions = {
    // 🚨 تأكد من إضافة عنوان IP الشبكة الذي ظهر لك في Vite
    origin: ['http://localhost:5173', 'http://192.168.0.122:5173'], 
    credentials: true,
};

dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// 🚨 Middleware (ترتيب مهم جداً لحل مشكلة CORS)
// 1. CORS: يجب أن يكون أولاً


app.use(cors(corsOptions));

app.use(express.json()); // 2. يسمح بقراءة البيانات بصيغة JSON

// استخدام المسارات (Mounting the Routes)
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes); 
app.use('/api/categories', categoryRoutes); 

// تقديم الواجهة الأمامية (اختياري للإصدار النهائي)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'))
    );
} else {
    app.get('/', (req, res) => res.send('API is running...'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));