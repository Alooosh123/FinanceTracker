// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n.js';
import { AuthProvider } from './context/AuthContext'; // 💡 استيراد مزود المصادقة

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 🚨 يجب أن يحيط AuthProvider بمكون App */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </React.StrictMode>,
);