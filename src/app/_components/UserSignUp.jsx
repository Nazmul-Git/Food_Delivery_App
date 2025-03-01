'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 

export default function UserSignUp({ redirect }) {
    const [user, setUser] = useState();
    const [cart, setCart] = useState([]);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'address':
                setAddress(value);
                break;
            case 'password':
                setPassword(value);
                setPasswordStrength(checkPasswordStrength(value));
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
            toast.error('Passwords do not match!'); 
            return;
        }

        setLoading(true);

        try {
            // Prepare the request payload without `confirmPassword`
            const { confirmPassword, ...formDataToSend } = {
                fullName,
                email,
                phone,
                address,
                password,
            };

            // Send the data to the backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataToSend),
            });

            const data = await response.json();

            if (response.ok && data.success && data.token) {
                const { signedUser } = data;
                delete signedUser.password;
                localStorage.setItem('user', JSON.stringify(signedUser));
                setUser(JSON.parse(localStorage.getItem('user')));
                setCart(JSON.parse(localStorage.getItem('cart')));

                toast.success('Sign up successful!'); 

                // Clear form data
                setFullName('');
                setEmail('');
                setPhone('');
                setAddress('');
                setPassword('');
                setConfirmPassword('');
                setPasswordStrength(0);

                // Redirect based on the presence of cart or redirect props
                if (redirect?.order || (user && cart.length)) {
                    router.push('/order');
                } else {
                    router.push('/stores');
                }
            } else {
                toast.error(data.error || 'Sign up failed!'); 
            }
        } catch (err) {
            toast.error('Error connecting to server: ' + err.message); 
            console.error(err);
        } finally {
            setLoading(false);
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
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                {/* Email */}
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

                {/* Phone Number */}
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {/* Address */}
                <div className="mb-4">
                    <label htmlFor="address" className="block text-lg font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={handleChange}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Enter your delivery address (City, Zone, Street)"
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
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Enter your password"
                        required
                    />
                    {/* Password strength meter */}
                    <div className="mt-2">
                        <div className="h-1 w-full bg-gray-200 rounded-full">
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
                        className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                        placeholder="Confirm your password"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 rounded-lg mt-4 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Sign up'}
                </button>
            </form>

            {/* Toast Container for toasts */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                style={{ marginTop: '80px' }} 
            />
        </>
    );
}
