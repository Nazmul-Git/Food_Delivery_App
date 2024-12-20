'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

export default function RestaurantSignup() {
    const [username, setUsername] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [restaurantType, setRestaurantType] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [imageUrl, setImageUrl] = useState(''); 
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Field validation
        if (!username || !restaurantName || !email || !phone || !address || !restaurantType || !password || !confirmPassword || !imageUrl || !description) {
            setErrorMessage('All fields are required.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage('Invalid email format.');
            return;
        }

        if (phone.length < 10 || !/^\d+$/.test(phone)) {
            setErrorMessage('Phone number must be at least 10 digits and numeric.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // API call
            let response = await fetch(`${process.env.NEXTAUTH_URL}/api/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    restaurantName,
                    email,
                    phone,
                    address,
                    restaurantType,
                    password,
                    imageUrl:imageUrl, 
                    description, 
                }),
            });

            // Parse the response
            response = await response.json();

            if (response.success && response.token) {
                localStorage.setItem('restaurantUser', JSON.stringify(response.signedUser));
                setSuccessMessage('Restaurant registered successfully!');
                setErrorMessage('');
                clearFields();
                router.push('/restaurants/dashboard');
            } else {
                setErrorMessage('Error registering restaurant: ' + response.message);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('There was an error submitting the form.');
            setSuccessMessage('');
        } finally {
            setLoading(false);
        }
    };

    const clearFields = () => {
        setUsername('');
        setRestaurantName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setRestaurantType('');
        setPassword('');
        setConfirmPassword('');
        setImageUrl('');
        setDescription('');
    };

    // Show loading spinner while waiting for data
    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Restaurant Signup</h2>
            {errorMessage && (
                <div className="mb-4 p-2 text-red-600 bg-red-100 border border-red-300 rounded-md">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="mb-4 p-2 text-green-600 bg-green-100 border border-green-300 rounded-md">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Left Side: Restaurant Details */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="restaurantName" className="block text-gray-700">Restaurant Name</label>
                            <input
                                type="text"
                                id="restaurantName"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your restaurant name"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-gray-700">Restaurant Address</label>
                            <input
                                type="text"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your restaurant address"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="restaurantType" className="block text-gray-700">Restaurant Type</label>
                            <select
                                id="restaurantType"
                                value={restaurantType}
                                onChange={(e) => setRestaurantType(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select a type</option>
                                <option value="italian">Italian</option>
                                <option value="mexican">Mexican</option>
                                <option value="asian">Asian</option>
                                <option value="american">American</option>
                                <option value="vegetarian">Vegetarian</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-gray-700">Restaurant Image URL</label>
                            <input
                                type="text"
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter image URL for your restaurant"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Side: Account Details */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your username"
                                required
                            />
                        </div>
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
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-gray-700">Restaurant Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe your restaurant"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Sign Up
                </button>
            </form>
        </>
    );
}
