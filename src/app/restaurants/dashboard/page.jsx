'use client'

import AddFoodItem from '@/app/_components/AddFoodItem';
import Banner from '@/app/_components/Banner';
import Footer from '@/app/_components/Footer';
import RestaurantDashboard from '@/app/_components/RestaurantDashboard';
import RestaurantHeader from '@/app/_components/RestaurantHeader';
import React, { useState } from 'react';
import { FaHandPointRight } from 'react-icons/fa';

export default function Dashboard() {
  const [addItem, setItem] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <RestaurantHeader />
      <div className='grid grid-cols-2 p-4'>
        <div className="flex items-center justify-center">
          <h1 className="font-extrabold text-5xl sm:text-6xl md:text-7xl text-center text-white leading-snug drop-shadow-lg">
            The Best Food <br />
            <span className="text-yellow-300">Delivery Services</span>
          </h1>
        </div>
        <Banner />
      </div>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/4 p-4 rounded-md">
          <div className='flex gap-2 items-center'>
            <FaHandPointRight />
            <button
              onClick={() => setItem(true)}
              className={`w-full text-left px-4 py-2 mb-2 text-gray-800 font-semibold rounded-md hover:bg-gray-200 ${addItem ? 'bg-indigo-100' : ''
                }`}
            >
              Dashboard
            </button>
          </div>
          <div className='flex gap-2 items-center'>
            <FaHandPointRight />
            <button
              onClick={() => setItem(false)}
              className={`w-full text-left px-4 py-2 mb-2 text-gray-800 font-semibold rounded-md hover:bg-gray-200 ${!addItem ? 'bg-indigo-100' : ''
                }`}
            >
              Add Food Items
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow bg-white p-2 rounded-md shadow-lg mx-4">
          {addItem ? (
            <RestaurantDashboard />
          ) : (
            <AddFoodItem />
          )}
        </div>
      </div>
      <div className='pt-20'>
        <p className='text-center'>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      </div>
      <Footer />
    </div>
  );
}
