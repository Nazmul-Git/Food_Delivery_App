'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DeliveryUserLogin() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') setPhone(value);
        if (name === 'password') setPassword(value);
    };

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!phone || !password) {
            toast.error('Please enter both phone number and password');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deliveryPartners/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (data.success && data.token) {
                const { loggedUser } = data;
                delete loggedUser.password;
                localStorage.setItem('deliveryUser', JSON.stringify(loggedUser));

                toast.success('Logged in successfully! Redirecting...');
                setTimeout(() => router.push('/dashboard'), 1000);
            } else {
                toast.error(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                style={{ marginTop: '80px' }}
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Mobile</label>
                    <input
                        type="number"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={password}
                            onChange={handleChange}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded-lg mt-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </>
    );
}
