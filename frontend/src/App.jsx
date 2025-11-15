// frontend/src/App.jsx

import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard'; // 👈 استيراد لوحة التحكم
import './App.css';
import './index.css';


const App = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Dashboard />; // 👈 توجيه إلى لوحة التحكم
    } else {
        return <LoginPage />;
    }
};

export default App;