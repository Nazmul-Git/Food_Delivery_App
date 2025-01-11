'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa6';
import { ToastContainer, toast } from 'react-toastify';

export default function UserLogin({ redirect }) {
    const [authUser, setAuthUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleLogin = async (provider) => {
        try {
            // Notify the user that login is in progress
            toast.info(`Signing in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);
            const result = await signIn(provider, {
                callbackUrl: `${redirect?.order ? '/order' : '/stores'}`,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Success message
            toast.success(`Signed in successfully with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);

            // Perform manual redirection
            if (result?.url) {
                console.log("Redirecting to:", result.url);
                window.location.href = result.url;
            }
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(error.message || 'Login failed');
        }
    };

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please enter both email and password');
            return;
        }

        setError('');
        setLoading(true);

        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            response = await response.json();
            // console.log(response); 

            if (response.success && response.token) {
                localStorage.setItem('user', JSON.stringify(response.loggedUser));
                toast.success('Logged in successfully!');

                // Delay the redirection to let the toast display
                setTimeout(() => {
                    if (redirect?.order) {
                        router.push('/order');
                    } else {
                        router.push('/stores');
                    }
                }, 2000);
            } else {
                toast.error(response.message || 'Login failed. Please try again.');
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
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Enter your email"
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
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
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
                    className="w-full bg-orange-600 text-white py-3 rounded-lg mt-4 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="mt-6">
                <p className="text-center text-gray-600 mb-4">Or login with</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleLogin('google')}
                        className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all"
                    >
                        <FaGoogle /> Google
                    </button>
                    <button
                        onClick={() => handleLogin('github')}
                        className="flex items-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
                    >
                        <FaGithub /> Github
                    </button>
                </div>
            </div>

            {/* Toast Container with custom top margin */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                style={{ marginTop: '80px' }}
            />
        </>
    );
}
