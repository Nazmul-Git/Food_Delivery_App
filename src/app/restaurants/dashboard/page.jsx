'use client';

import AddFoodItem from '@/app/_components/AddFoodItem';
import Banner from '@/app/_components/Banner';
import Footer from '@/app/_components/Footer';
import RestaurantDashboard from '@/app/_components/RestaurantDashboard';
import RestaurantHeader from '@/app/_components/RestaurantHeader';
import React, { useState } from 'react';
import { FaHandPointRight } from 'react-icons/fa';
import { AiOutlineDashboard, AiOutlinePlusCircle, AiOutlineBarChart } from 'react-icons/ai';
import { MdOutlineFoodBank } from 'react-icons/md';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <RestaurantDashboard />;
      case 'addFood':
        return <AddFoodItem />;
      case 'statistics':
        return <div className="text-center text-gray-700">Statistics feature coming soon!</div>;
      case 'manageFood':
        return <div className="text-center text-gray-700">Manage Food Items feature coming soon!</div>;
      default:
        return <RestaurantDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <RestaurantHeader />

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white">
        <div className="flex items-center justify-center">
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-center leading-snug drop-shadow-lg">
            The Best Food <br />
            <span className="text-yellow-300">Delivery Services</span>
          </h1>
        </div>
        <Banner />
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white shadow-md p-4 rounded-md">
          <h2 className="font-bold text-base sm:text-lg text-gray-800 mb-4">Menu</h2>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md font-semibold transition text-sm md:text-base ${
                activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
              }`}
            >
              <AiOutlineDashboard className="text-lg" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('addFood')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md font-semibold transition text-sm md:text-base ${
                activeTab === 'addFood' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
              }`}
            >
              <AiOutlinePlusCircle className="text-lg" />
              Add Food Items
            </button>
            <button
              onClick={() => setActiveTab('manageFood')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md font-semibold transition text-sm md:text-base ${
                activeTab === 'manageFood' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
              }`}
            >
              <MdOutlineFoodBank className="text-lg" />
              Manage Food Items
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-md font-semibold transition text-sm md:text-base ${
                activeTab === 'statistics' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200'
              }`}
            >
              <AiOutlineBarChart className="text-lg" />
              Statistics
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-20 pb-4">
        <p className="text-center text-sm sm:text-base text-gray-500">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <Footer />
    </div>
  );
}
