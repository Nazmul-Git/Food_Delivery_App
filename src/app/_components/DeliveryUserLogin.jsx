'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DeliveryUserLogin({ redirect }) {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
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
            setMessage('Please enter both phone number and password');
            return;
        }

        setMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXTAUTH_URL}/api/deliveryPartners/login`, {
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

                setMessage('Logged in successfully!');
                router.push('/dashboard');
            } else {
                setMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {message && (
                <div className={`mb-4 p-2 text-sm ${message.includes('success') ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'} border rounded-md`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
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

                <div className="mb-6">
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
