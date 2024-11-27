'use client'

import React, { useState } from 'react';

export default function UserLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        setError('');

        // Here you would call your backend API to authenticate the user
        alert('Logged in successfully!');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Remember Me */}
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        className="h-4 w-4 text-pink-600 focus:ring-2 focus:ring-pink-600"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-lg text-gray-700">Remember Me</label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 rounded-lg mt-4 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                >
                    Login
                </button>
            </form> 
        </>
    );
}
