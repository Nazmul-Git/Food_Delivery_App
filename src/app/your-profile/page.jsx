'use client';

import React, { useEffect, useState } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import { FaDollarSign, FaCheckCircle, FaTimesCircle, FaHome } from 'react-icons/fa';
import Loading from '../loading';
import ScrollToTop from '../_components/ScrollToTop';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const orderedProfile = JSON.parse(localStorage.getItem('profile'));
    if (orderedProfile) {
      setUser(orderedProfile);
      setUserEmail(orderedProfile?.email);

      let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order?id=${orderedProfile?.user_Id}`);
      response = await response.json();
      if (response.success) {
        setOrders(response.orders);
        localStorage.removeItem('orderSummary');
        setLoading(false);
      }
    }
  };

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
    router.push('/stores');
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('profile');
    localStorage.removeItem('signInData');

    // Reset the user state
    setUser({});
    setUserEmail('');

    router.push('/user');
  };

  if (loading) return <Loading />;
  console.log('asdjhd', user);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col space-y-8 px-6 lg:px-16 py-10">
      {/* Back Button and Home Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackClick}
          className="text-indigo-600 text-lg font-semibold flex items-center space-x-2 hover:text-indigo-800 transition-all duration-200 transform hover:scale-105"
        >
          <TiArrowBack size={24} />
          <span>Back</span>
        </button>
        <button onClick={() => router.push('/')} className="text-3xl text-indigo-600 hover:text-blue-600 transition-colors">
          <FaHome />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-8 space-y-8">
        <div className="md:flex flex-row items-center space-x-8 border-b border-green-500 pb-6">
          {/* Profile Image with First Letter of Email */}
          <div className="w-20 h-20 ml-6 rounded-full flex items-center justify-center text-blue-400 text-4xl font-semibold shadow-xl transition-transform transform hover:scale-110">
            {
              user?.image ? (
                <img
                  src={user?.image}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover text-black p-2"
                  onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
                />
              ) : (
                getInitialsFromEmail(userEmail)
              )
            }
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">{user?.customerName}</h2>
            <p className="text-lg text-gray-700">{userEmail}</p>
            <p className="text-lg text-gray-600">{`${user?.city}, ${user?.zone}, ${user?.street}`}</p>

            {/* Additional info or action buttons (optional) */}
            <div className="flex space-x-4 mt-4">
              <button
                className="text-sm bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300"
              >
                Edit Profile
              </button>
              <button
                className="text-sm text-indigo-600 py-2 px-6 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />

      {/* Orders Section */}
      <div className="bg-white  shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-semibold text-indigo-600 text-center mb-4">Order History</h1>

        {orders.length === 0 ? (
          <p className="text-lg text-gray-500">No orders available.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="border-b border-gray-300 pb-6">
              <h2 className="text-2xl font-semibold text-red-600">Order #{index + 1}</h2>

              {/* Order Status */}
              <div className="flex items-center gap-2 mt-4">
                {order.status === 'confirm' ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-xl" />
                )}
                <span className="text-lg text-gray-700">Status: {order?.status === 'confirm' ? 'Confirmed' : 'Failed'}</span>
              </div>

              {/* Restaurant Info */}
              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                {/* Restaurant Details Section */}
                <div className="space-y-4">
                  {/* Restaurant Name */}
                  <div className="flex flex-wrap justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Restaurant:</strong>
                    </p>
                    <p className="text-lg text-gray-600">{order?.data?.restaurantName}</p>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-wrap justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Amount:</strong>
                    </p>
                    <div className="text-lg text-pink-600 font-semibold flex items-center">
                      <FaDollarSign className="mr-1" />
                      {order?.amount}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-6 border-gray-300" />

                {/* Additional Information Section */}
                <div className="space-y-4">
                  {/* Restaurant Type */}
                  <div className="flex flex-wrap justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Restaurant Type:</strong>
                    </p>
                    <p className="text-lg text-gray-600">{order?.data?.restaurantType}</p>
                  </div>

                  {/* Delivery Address */}
                  <div className="flex flex-wrap justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      <strong>Delivery Address:</strong>
                    </p>
                    <p className="text-lg text-gray-600">{`${user?.city}, ${user?.zone}, ${user?.street}`}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method & Date */}
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-500">Payment Method</h3>
                  <div className="flex items-center space-x-4">
                    {/* <p className="text-lg text-red-700 font-semibold">{order?.paymentMethod}</p> */}
                    <Image
                      src={`/images/${order?.paymentMethod}-Logo.png`}
                      alt="Icon"
                      width={70}
                      height={70}
                      className=""
                    />
                  </div>
                </div>
                <p className="text-lg text-blue-700">
                  <strong>Date:</strong>{' '}
                  <span className="font-semibold text-indigo-600">{formatDate(order?.date)}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
