import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent reloading page i.e. default form behaviour
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await authService.login(email, password);
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', email);
                navigate('/dashboard');
            }
        }
        catch (error) {
            if (error.response) {
                const data = error.response.data;
                // Check if 'data' is an object with a 'message' property
                const serverMessage = data && typeof data === 'object' && data.message 
                                      ? data.message 
                                      : data;
                setError(serverMessage || 'Invalid email or password');
            }
            else if (error.request) {
                setError('Network error. Please try again later.');
            }
            else {
                setError('An error occurred. Please try again later.');
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={(e) => handleLogin(e)}>
                <div className="form-group">
                    <label htmlFor='email'>Email:</label>
                    <input
                        id='email'
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='password'>Password:</label>
                    <input
                        id='password'
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? <div className='Spinner'></div> : 'Login'}
                </button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default Login;