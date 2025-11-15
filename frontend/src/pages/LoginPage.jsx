// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/auth';

const LoginPage = () => {
    const { login } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isRegistering && !username) {
            setError('Please enter a username.');
            setLoading(false);
            return;
        }

        try {
            if (isRegistering) {
                // عملية التسجيل
                const data = await registerUser(username, email, password);
                // بعد التسجيل الناجح، يتم تسجيل الدخول مباشرة بالرمز العائد
                // (سنفترض أن الـ backend يرجع الرمز والـ user object كما هو متوقع في AuthContext)
                // بدلاً من ذلك، نطلب من المستخدم تسجيل الدخول بعد التسجيل
                alert('Registration successful! Please log in.');
                setIsRegistering(false);
                setUsername('');
                setEmail('');
                setPassword('');

            } else {
                // عملية تسجيل الدخول
                await login(email, password);
                // إذا نجح تسجيل الدخول، سيتم التوجيه تلقائيًا عبر App.jsx
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-title">{isRegistering ? 'Create Account' : 'Log In'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="auth-form">
                
                {isRegistering && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isRegistering ? 'Register' : 'Log In')}
                </button>
            </form>
            
            <p className="toggle-mode">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <span onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Log In' : 'Register Here'}
                </span>
            </p>
        </div>
    );
};

export default LoginPage;