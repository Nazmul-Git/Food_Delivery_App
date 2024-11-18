import React, { useState } from 'react';

export default function RestaurantSignup() {
    const [username, setUsername] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [restaurantType, setRestaurantType] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!username || !restaurantName || !email || !phone || !address || !restaurantType || !password || !confirmPassword) {
            setErrorMessage('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        // Handle signup logic (e.g., API call)
        setErrorMessage('');
        setSuccessMessage('Account created successfully!');
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation({ latitude, longitude });

                    // Optionally, you can use a geocoding service to get a human-readable address.
                    // For now, let's just set the address as a placeholder for the coordinates
                    setAddress(`Lat: ${latitude}, Lon: ${longitude}`);
                },
                (error) => {
                    setErrorMessage('Failed to retrieve your location.');
                }
            );
        } else {
            setErrorMessage('Geolocation is not supported by your browser.');
        }
    };

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
                        {/* Restaurant Name */}
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

                        {/* Phone */}
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

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-gray-700">Restaurant Address</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter your restaurant address"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    className="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Use Current Location
                                </button>
                            </div>
                        </div>

                        {/* Restaurant Type */}
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
                                {/* Add more types as necessary */}
                            </select>
                        </div>
                    </div>

                    {/* Right Side: Account Details */}
                    <div className="space-y-6">
                        {/* Username */}
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

                        {/* Email */}
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

                        {/* Password */}
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

                        {/* Confirm Password */}
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
