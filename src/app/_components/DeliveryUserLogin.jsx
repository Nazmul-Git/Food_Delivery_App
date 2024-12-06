'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function DeliveryUserLogin({ redirect }) {

    // Separate state for email and password
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
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
            setError('Please enter both phone number and password');
            return;
        }

        setError('');
        setLoading(true);

        try {
            let response = await fetch('http://localhost:3000/api/deliveryPartners/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone, password }),
            });

            response = await response.json();

            if (response.success) {
                const { loggedUser } = response;
                delete loggedUser.password;
                localStorage.setItem('deliveryUser', JSON.stringify(loggedUser));
                console.log(redirect)

                if (redirect.dashboard) {
                    alert('Logged in successfully!');
                    router.push('/dashboard');
                }else if(JSON.parse(localStorage.getItem('deliveryUser'))){
                    alert('Logged in successfully!');
                    router.push('/dashboard');
                } else {
                    alert('Login failed!');
                    // router.push('/');
                }
            } else {
                setError(response.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Mobile</label>
                    <input
                        type="number"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
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

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 rounded-lg mt-4 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </>
    );
}
