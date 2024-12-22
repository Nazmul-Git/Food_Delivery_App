'use client';

import React, { useEffect, useState } from 'react';
import { TiArrowBack } from 'react-icons/ti';
import Loading from '../loading';
import ScrollToTop from '../_components/ScrollToTop';
import { useRouter } from 'next/navigation';
import DeliveryHeader from '../_components/DeliveryUserHeader';
import Footer from '../_components/Footer';
import { FaHome } from 'react-icons/fa';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryData, setDeliveryData] = useState(null);
  const [deliveryMan, setDeliveryMan] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getInitialsFromEmail = (userIdentity) => {
    if (!userIdentity) return "U";
    const parts = userIdentity.split('@')[0].split('.');
    return parts.map((part) => part.charAt(0).toUpperCase()).join('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const fetchOrders = async () => {
    try {
      const deliveryDatas = JSON.parse(localStorage.getItem('profile'));
      const deliveryUser = JSON.parse(localStorage.getItem('deliveryUser'));
      setDeliveryData(deliveryDatas);
      setDeliveryMan(deliveryUser?.signedUser || deliveryUser);

      if (!deliveryData) {
        setLoading(false);
        return;
      }
      // console.log('delivery user ',deliveryData.delivery_Id);

      const deliveryManId = deliveryDatas.delivery_Id;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deliveryPartners/orders/${deliveryManId}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const clientData = JSON.parse(localStorage.getItem('user'));
    setClientData(clientData);

    if (!localStorage.getItem('deliveryUser')) {
      router.push('/delivery-user');
    } else {
      fetchOrders();
    }
  }, [router]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) return <Loading />;

  const userIdentity = deliveryMan?.email || deliveryMan?.fullName;

  console.log('delivery man',deliveryMan);

  return (
    <div>
      <DeliveryHeader />
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

        <div className="bg-white p-8 space-y-8">
          <div className="flex items-center space-x-8 border-b border-gray-200 pb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl font-semibold shadow-xl transition-transform transform hover:scale-110">
              {getInitialsFromEmail(userIdentity)}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-gray-900">{deliveryMan?.fullName}</h2>
              <p className="text-lg text-gray-700">{`${deliveryMan?.street}, ${deliveryMan?.zone}, ${deliveryMan?.city}`}</p>
              <p className="text-lg text-gray-600">{deliveryMan?.phone}</p>
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
        {/* Order List Section */}
        <div className="bg-white rounded-lg p-8 mt-8 shadow-md">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center p-6">Your Order List</h2>
          {orders && orders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                    Restaurant: <span className="font-bold text-2xl text-orange-500">{order?.data?.restaurantName || "N/A"}</span>
                  </h3>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Client Name:</span>{" "}
                    {clientData?.fullName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Address:</span>{" "}
                    {clientData?.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Mobile:</span>{" "}
                    {clientData?.phone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Date:</span>{" "}
                    {formatDate(order?.date)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Status:</span>{" "}
                    <span
                      className={`${order?.status === "Delivered"
                        ? "text-green-600"
                        : "text-red-600"
                        } font-semibold`}
                    >
                      {order?.status}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Amount:</span> $
                    {order?.amount}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-green-700">Payment:</span>{" "}
                    {order?.paymentMethod}
                  </p>

                  <button
                    className="mt-4 w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Confirm Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                No orders found
              </h2>
              <p className="text-gray-500">
                Looks like there are no orders to display. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
