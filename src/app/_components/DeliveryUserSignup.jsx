'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function DeliveryUserSignup({ redirect }) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();


    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'fullName':
                setFullName(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'password':
                setPassword(value);
                const strength = checkPasswordStrength(value);
                setPasswordStrength(strength);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    };

    // Password strength checking function (simple version)
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length > 6) strength += 1;
        if (password.match(/[a-zA-Z]/) && password.match(/\d/)) strength += 1;
        if (password.match(/[!@#$%^&*(),.?":{}|<>]/)) strength += 1;
        return strength;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setError('');

        try {
            // Prepare the request payload without `confirmPassword`
            const { confirmPassword, ...formDataToSend } = {
                fullName,
                phone,
                address,
                password,
            };

            // Send the data to the backend
            let response = await fetch('http://localhost:3000/api/deliveryPartners/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            response = await response.json();

            if (response.success) {
                const { signedUser } = response;
                console.log(signedUser)
                delete signedUser.password;
                localStorage.setItem('deliveryUser', JSON.stringify({ signedUser }));
                if (redirect.dashboard) {
                    router.push('/dashboard');
                    setMessage(response.message || 'User registered successfully');
                    // Clear the form fields after successful registration
                    setFullName('');
                    setPhone('');
                    setAddress('');
                    setPassword('');
                    setConfirmPassword('');
                } else if(JSON.parse(localStorage.getItem('deliveryUser'))) {
                    setMessage(response.message || 'User registered successfully');
                    router.push('/dashboard');
                }else{
                    alert('Sign up failed!');
                }
            }
            else {
                router.push('/')
                setError(response.error || 'Sign up failed!');
            }
        } catch (err) {
            setError('Error connecting to server: ' + err.message);
            console.error(err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-lg font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        value={fullName}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label htmlFor="address" className="block text-lg font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your delivery address"
                        required
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Enter your password"
                        required
                    />
                    {/* Password strength meter */}
                    <div className="mt-2">
                        <div className={`h-1 w-full bg-gray-200 rounded-full`}>
                            <div
                                className={`h-full ${passwordStrength === 0 ? 'bg-gray-400' : passwordStrength === 1 ? 'bg-yellow-400' : 'bg-green-500'} rounded-full`}
                                style={{ width: `${(passwordStrength / 3) * 100}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{passwordStrength === 0 ? 'Weak' : passwordStrength === 1 ? 'Medium' : 'Strong'}</p>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Success Message */}
                {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-3 rounded-lg mt-4 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                >
                    Sign Up
                </button>
            </form>
        </>
    );
}
