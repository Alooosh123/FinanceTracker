// D:\FinanceTracker\backend\init_db.js

const { query } = require('./config/db');

const createTables = async () => {
    // 1. جدول المستخدمين (Users)
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            -- لا توجد مفاتيح خارجية في جدول المستخدمين!
        )
    `;

    // 2. جدول التصنيفات (Categories) - هنا المفتاح الخارجي صحيح
    const createCategoriesTable = `
        CREATE TABLE IF NOT EXISTS Categories (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            user_id INT NOT NULL,
            type VARCHAR(10) NOT NULL CHECK(type IN ('income', 'expense')),
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, 
            UNIQUE (name, user_id, type)
        )
    `;

    // 3. جدول المعاملات (Transactions)
    const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS Transactions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            amount DECIMAL(10, 2) NOT NULL CHECK(amount > 0),
            type VARCHAR(10) NOT NULL CHECK(type IN ('income', 'expense')),
            description TEXT,
            date DATE NOT NULL,
            user_id INT NOT NULL,
            category_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
        )
    `;

    try {
        console.log('Starting table creation...');
        await query(createUsersTable);
        await query(createCategoriesTable);
        await query(createTransactionsTable);
        
        console.log('Database initialization complete! 🎉');
        process.exit(0);
    } catch (error) {
        console.error('Error during database initialization: 🛑', error.message);
        process.exit(1);
    }
};

createTables();