import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from 'antd';
import api from '@/config/api';
import { useAuth } from '../../../context/AuthContext';

const initialState = { email: "", password: "" }

const Login = () => {
    const navigate = useNavigate();
    const { readProfile } = useAuth(); // AuthContext se profile read karne ka function

    const [state, setState] = useState(initialState);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (e) => {
        setState(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const { email, password } = state;

        if (!email || !password) {
            return window.toastify("Invalid email or password", "error");
        }

        setIsProcessing(true);

        try {
            // Backend API call
            const response = await api.post('/auth/login', { email, password });
            const { status, data } = response;

            if (status === 200) {
                // 1. Token ko LocalStorage mein save karein
                localStorage.setItem('token', data.token);

                // 2. Profile read karein 
                await readProfile(data.token);

                // 3. Role Based Logic (Toastify aur Navigation)
                const userRole = data.user?.role;

                if (userRole === 'admin') {
                    // Admin ke liye specific message
                    window.toastify("Admin Login Successful! Welcome to Panel", "success");
                    navigate("/admin");
                } else {
                    // User ke liye specific message
                    window.toastify("User Login Successful! Welcome to Dashboard", "success");
                    navigate('/dashboard');
                }

                // State reset
                setState(initialState);
            }
        }
        catch (error) {
            // Error handling agar backend se koi masla aaye
            const errorMsg = error.response?.data?.message || "Something went wrong!";
            window.toastify(errorMsg, "error");
        }
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl">

                {/* Logo & Welcome Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-3xl">🏦</span>
                        <h2 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">
                            Digital Bank
                        </h2>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Please enter your details to access your account.
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                        <Input
                            type="email"
                            name="email"
                            size="large"
                            className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500 h-12"
                            placeholder="name@example.com"
                            value={state.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Password</label>
                        <Input.Password
                            name="password"
                            size="large"
                            className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500 h-12"
                            placeholder="••••••••"
                            value={state.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Login Button */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold text-base shadow-lg shadow-blue-100 mt-2 border-none"
                        loading={isProcessing}
                    >
                        Sign In
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 text-sm m-0">
                        Don't have an account yet?
                        <Link to="/auth/register" className="text-blue-600 font-black ml-2 hover:underline">
                            Open Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;