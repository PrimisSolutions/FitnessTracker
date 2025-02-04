import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await authService.login(email, password);
            navigate('/dashboard');
        }
        catch (error) {
            alert('Invalid login');
        }
    };

    return (
        <>
            <div>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleLogin}>Login</button>
            </div>
            <div>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        </>
    );
};

export default Login;