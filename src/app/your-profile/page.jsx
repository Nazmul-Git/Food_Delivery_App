'use client';

import React, { useEffect, useState } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import { FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loading from '../loading';
import ScrollToTop from '../_components/ScrollToTop';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';

const Profile = () => {
  const [orders, setOrders] = useState([]); // Orders that are visible
  const [allOrders, setAllOrders] = useState([]); // All orders (fetched from API)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [visibleOrders, setVisibleOrders] = useState(10); // Keep track of visible orders count
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orderedProfile = JSON.parse(localStorage.getItem('profile'));
        const loggedUser = JSON.parse(localStorage.getItem('user'));
        const authUser = JSON.parse(localStorage.getItem('authUser'));

        if (orderedProfile || loggedUser || authUser) {
          const userInfo = orderedProfile || loggedUser || authUser?.loggedUser;
          setUser(userInfo);
          setUserEmail(userInfo?.email);

          // Fetch all orders related to the logged-in user
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/order?id=${userInfo?.user_Id || userInfo._id}`
          );
          const data = await response.json();

          if (data.success) {
            // Date parsing function to handle different structures of `createdAt`
            const parseDate = (order) => {
              if (order?.date) {
                return new Date(order.date);
              }
              return new Date(0); // Default date if `date` is not available
            };

            const sortedOrders = data.orders.sort((a, b) => {
              const dateA = parseDate(a);
              const dateB = parseDate(b);
              return dateB - dateA; // Sort by most recent first
            });

            setAllOrders(sortedOrders); // Save all orders in state
            setOrders(sortedOrders.slice(0, 10)); // Set the first 10 orders to be visible
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle "Load More" functionality
  const handleLoadMore = () => {
    const nextOrders = allOrders.slice(visibleOrders, visibleOrders + 10);
    setOrders([...orders, ...nextOrders]); // Append the next 10 orders to the visible orders
    setVisibleOrders(visibleOrders + 10); // Increase the visible orders count by 10
  };

  const getInitialsFromEmail = (email) => {
    if (email) {
      const namePart = email.split('@')[0];
      return namePart.charAt(0).toUpperCase();
    }
    return '?';
  };

  const handleBackClick = () => {
    router.push('/stores');
  };

  const handleLogout = () => {
    localStorage.removeItem('profile');
    localStorage.removeItem('authUser');
    setUser({});
    setUserEmail('');
    router.push('/user');
  };

  if (loading) return <Loading />;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col space-y-8 px-6 lg:px-16 py-10">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackClick}
          className="text-indigo-600 text-lg font-semibold flex items-center space-x-2 hover:text-indigo-800 transition-all duration-200 transform hover:scale-105"
        >
          <TiArrowBack size={24} />
          <span>Back</span>
        </button>
      </div>

      <div className="p-8 space-y-8">
        <div className="md:flex flex-row items-center space-x-8 border-b border-green-500 pb-6">
          <div className="w-20 h-20 ml-6 rounded-full flex items-center justify-center text-blue-400 text-4xl font-semibold shadow-xl transition-transform transform hover:scale-110">
            {user?.image ? (
              <img
                src={user?.image}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover text-black border-2 border-green-600"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
              />
            ) : (
              getInitialsFromEmail(userEmail)
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-gray-900">{user?.customerName || user?.fullName}</h2>
            <p className="text-lg text-gray-700">{userEmail}</p>
            <div className="flex space-x-4 mt-4">
              <button className="text-sm bg-indigo-600 text-white py-2 px-6 rounded-full hover:bg-indigo-700 transition-colors duration-300">
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-indigo-600 py-2 px-6 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />

      <div className="bg-white shadow-xl p-8 space-y-6">
        <h1 className="text-4xl font-semibold text-indigo-700 text-center mb-4">Order History</h1>
        <p className="text-right font-semibold text-indigo-700 mt-4 p-4 bg-indigo-50 rounded-lg shadow-sm border-l-4 border-indigo-500">
          Total Orders :
          <span className="font-bold text-red-600"> {allOrders.length}</span>
        </p>
        {orders.length === 0 ? (
          <p className="text-lg text-gray-500">No orders available.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="border-b border-gray-300 pb-6">
              <h2 className="text-2xl font-semibold text-red-600">Order #{index + 1}</h2>
              <div className="flex items-center gap-2 mt-4">
                {order.status === 'confirm' ? (
                  <FaCheckCircle className="text-green-500 text-xl" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-xl" />
                )}
                <span className="text-lg text-gray-700">
                  Status: {order?.status === 'confirm' ? 'Confirmed' : 'Failed'}
                </span>
              </div>
              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-lg text-gray-800">
                      <strong>Restaurant:</strong>
                    </p>
                    <p className="text-lg text-gray-600">{order?.data?.restaurantName}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-lg text-gray-800">
                      <strong>Ordered Items:</strong>
                    </p>
                    <p className="text-lg text-gray-600">
                      {order?.foods && order.foods.length > 0 ? (
                        order.foods.map((food, i) => (
                          <span key={i}>{food.name}, </span>
                        ))
                      ) : (
                        <span>No food items available</span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-lg text-gray-800">
                      <strong>Amount:</strong>
                    </p>
                    <div className="text-lg text-pink-600 flex items-center">
                      <FaDollarSign className="mr-1" />
                      {order?.amount}
                    </div>
                  </div>
                  {order?.data?.createdAt && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <p className="text-lg text-gray-800">
                        <strong>Order Date:</strong>
                      </p>
                      <p className="text-lg text-gray-600">{format(new Date(order?.data?.createdAt), 'MMMM dd, yyyy h:mm a')}</p>
                    </div>
                  )}
                  {order?.paymentMethod && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <p className="text-lg text-gray-800">
                        <strong>Payment Method:</strong>
                      </p>
                      <Image
                        src={`/images/${order?.paymentMethod}-Logo.png`}
                        alt={order?.paymentMethod}
                        width={96}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {orders.length < allOrders.length && (
          <button
            onClick={handleLoadMore}
            className="mt-6 text-center text-indigo-600 py-2 px-6 rounded-full border border-indigo-600 hover:bg-indigo-700 transition-all duration-300 hover:text-white"
          >
            Load More Orders
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
