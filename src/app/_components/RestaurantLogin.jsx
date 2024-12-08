import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from '../loading';

export default function RestaurantLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage('Please enter both email and password');
            return;
        }

        setLoading(true);
        setMessage(''); // Reset message before processing

        try {
            const response = await fetch('http://localhost:3000/api/restaurants', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, login: true }),
            });
            const data = await response.json();

            if (data.success) {
                const { signedUser } = data;
                delete signedUser.password;
                localStorage.setItem('restaurantUser', JSON.stringify(signedUser));

                setMessage('Login successful! Redirecting...');
                setTimeout(() => router.push('/restaurants/dashboard'), 2000);
            } else {
                setMessage('Invalid credentials, please try again.');
            }
        } catch (error) {
            setMessage('An error occurred, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Restaurant Login</h2>
            {message && (
                <div
                    className={`mb-4 p-2 rounded-md ${
                        message.includes('successful')
                            ? 'text-green-600 bg-green-100 border-green-300'
                            : 'text-red-600 bg-red-100 border-red-300'
                    }`}
                >
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
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

                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">Remember me</label>
                    </div>
                    <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Log In
                </button>
            </form>
        </>
    );
}
