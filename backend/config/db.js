const mysql = require('mysql');
const util = require('util');

// يجب تعريف متغيرات البيئة في ملف .env
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'finance_tracker',
    // تمكين دعم قيود التحقق (Check Constraints) إذا كان غير مفعل بشكل افتراضي في بعض الإصدارات
    // هذا مهم بعد المشاكل التي واجهناها
    multipleStatements: true 
});

// وظيفة اتصال بسيطة للتأكد من نجاح الاتصال
exports.connectDB = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to database:', err.code);
            // قد ترغب في إيقاف الخادم هنا إذا كان الاتصال بالقاعدة ضرورياً
            return;
        }
        console.log('Database connection successful! ✅');
        connection.release(); 
    });
};

// تحويل دالة pool.query إلى Promise لدعم async/await
exports.query = util.promisify(pool.query).bind(pool);