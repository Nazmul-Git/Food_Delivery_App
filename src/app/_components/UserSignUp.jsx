'use client'

import React, { useState } from 'react';

export default function FoodDeliverySignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setError('');
    alert('Form Submitted Successfully!');
    // Here, send the data to your backend
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
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
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
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-lg font-medium text-gray-700">Delivery Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
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
              value={formData.password}
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
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-600 focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
