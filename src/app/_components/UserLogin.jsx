'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons for password visibility toggle

export default function UserLogin() {
    // Separate state for email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setError('');
        setLoading(true);

        try {
            let response = await fetch('http://localhost:3000/api/user/login', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
        
            response = await response.json();
        
            if (response.success) {  // Check if response is okay
                if (response.success) {
                    // Handle successful login
                    const { loggedUser } = response;
                    delete loggedUser.password;
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    router.push('/stores');
                    alert('Logged in successfully!');
                } else {
                    setError(response.message || 'Login failed. Please try again.');
                }
            } else {
                setError('Server error occurred. Please try again later.');
            }
        } catch (error) {
            console.error('Login Error:', error);  // Log the error
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
        
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
                        value={email}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password */}
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
                    disabled={loading} // Disable the button during loading
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </>
    );
}
