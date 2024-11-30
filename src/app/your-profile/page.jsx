'use client';

import React, { useEffect, useState } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import { FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loading from '../loading'; // Assuming a loading component

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [userStorage, setUserStorage] = useState({});
  const [userEmail, setUserEmail] = useState('');

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response = await fetch('http://localhost:3000/api/order');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        response = await response.json();
        setOrders(response.orders);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    // Fetch user profile data from localStorage (or API if needed)
    const userProfile = JSON.parse(localStorage.getItem('profile'));
    const userLStorage = JSON.parse(localStorage.getItem('user'));
    setUser(userProfile);
    setUserEmail(userLStorage.email);
    setUserStorage(userLStorage);

    fetchOrders();
  }, []);

   // Helper function to get the first letter of the email
   const getInitialsFromEmail = (email) => {
    if (email) {
      const namePart = email.split('@')[0]; 
      return namePart.charAt(0).toUpperCase(); 
    }
    return '?';
  };

  // Handle back button click
  const handleBackClick = () => {
    window.history.back();
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col space-y-8 p-6 lg:px-16 lg:py-10">
      <button
        onClick={handleBackClick}
        className="text-indigo-600 text-lg font-semibold flex items-center space-x-2 hover:text-indigo-800 transition-all duration-200 transform hover:scale-105"
      >
        <TiArrowBack size={24} />
        <span>Back</span>
      </button>

      {/* User Profile Section */}
      <div className="p-8 rounded-3xl  space-y-6">
        

        {/* User Info */}
        <div className="flex items-center space-x-6 border-b border-gray-200 pb-6">
          {/* Profile Image with First Letter of Email */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {getInitialsFromEmail(userEmail)}
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-purple-700">{userStorage.fullName}</h2>
            <p className="text-lg text-gray-600">{userStorage.email}</p>
            <p className="text-lg text-gray-600">{userStorage.address}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className=" p-8 rounded-3xl shadow-xl space-y-6">
        <h1 className="text-4xl font-bold text-purple-600">Order History</h1>

        {orders.length === 0 ? (
          <p className="text-xl text-gray-500">No orders available.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="border-b border-gray-300 pb-6">
              <h2 className="text-2xl font-semibold text-purple-700">Order #{index}</h2>

              {/* Order Status */}
              <div className="flex items-center gap-2 mt-4">
                {order.status === 'confirm' ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-xl" />
                )}
                <span className="text-lg text-gray-700">Status: {order.status}</span>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <p className="text-lg text-gray-700"><strong>User ID:</strong> {order.user_Id}</p>
                  <p className="text-lg text-gray-700"><strong>Delivery ID:</strong> {order.delivery_Id}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-lg text-gray-700"><strong>Restaurant ID:</strong> {order.restaurantId}</p>
                  <p className="text-lg text-gray-700 flex items-center gap-2"><strong>Amount:</strong> <span className="font-semibold text-pink-600 flex items-center"><FaDollarSign /> {order.amount}</span></p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-purple-500">Payment Method</h3>
                  <p className="text-lg text-gray-700">{user.paymentMethod}</p>
                </div>
                <p className="text-lg text-blue-700"><strong>Date:</strong> <span className="font-semibold text-purple-600">{formatDate(order.createdAt)}</span></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
