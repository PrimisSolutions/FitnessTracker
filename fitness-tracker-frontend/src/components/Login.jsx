import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

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
		<div className="max-w-md mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-400">Login Here</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
                <div className="space-y-2">
                    <label 
                        htmlFor="email" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label 
                        htmlFor="password" 
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <div className="animate-spin h-5 w-5 mx-auto border-2 border-white border-t-transparent rounded-full"></div> : 'Login'}
                </button>
            </form>
			<p className="mt-4 text-center text-sm text-gray-600">
				Don&apos;t have an account?{' '}
				<a href="/register" className="text-blue-600 hover:text-blue-700">
                    Register here
                </a>
            </p>
        </div>
	);
};

export default Login;