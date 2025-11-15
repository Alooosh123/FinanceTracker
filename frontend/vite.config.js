// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 🚨 إضافة قسم الخادم (server)
  server: {
    // 💡 السماح بالاتصالات من جميع واجهات الشبكة الخارجية (0.0.0.0)
    host: '0.0.0.0', 
    // 💡 تأكد من أن المنفذ هو 5173 أو أي منفذ تختاره
    port: 5173, 
  }
})