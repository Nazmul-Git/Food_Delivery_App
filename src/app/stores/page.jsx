'use client'

import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa' // Importing the search icon
import CustomerHeader from '../_components/CustomerHeader'
import Footer from '../_components/Footer'

export default function Store() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");  // Default to empty string
  const [filteredLocations, setFilteredLocations] = useState([]);  // To store filtered locations based on user input

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    let response = await fetch('http://localhost:3000/api/customer/locations');
    response = await response.json();
    if (response.success) {
      setLocations(response.result);
    }
  };

  // Handle location input change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
    
    // Filter locations based on the input value
    if (value) {
      const filtered = locations.filter(location => 
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]); 
    }
  };

  // Handle selecting a location from the dropdown
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFilteredLocations([]);
  };

  return (
    <div>
      <CustomerHeader />
      <div>
        <p>Stored all restaurants</p>
      </div>
      
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/background-cooking-black-wooden-background-top-view-free-space-your-text_187166-5650.jpg')" }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Centered content */}
        <div className="relative z-10 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Discover Amazing Restaurants</h2>
            <p className="text-lg">Find the best places to eat and drink in your city</p>
          </div>

          <div className="flex justify-center gap-4">
            {/* Location input field */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Select place"
                value={selectedLocation}  // Bind to selectedLocation state
                onChange={handleLocationChange}  // Update state when the user types
                className="w-full px-4 py-4 text-black rounded-l-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {/* Location suggestions dropdown */}
              {filteredLocations.length > 0 && selectedLocation && (
                <ul className='absolute bg-white w-full max-h-40 overflow-y-auto z-10 mt-2 rounded-lg shadow-md'>
                  {
                    filteredLocations.map((location, index) => (
                      <li 
                        key={index} 
                        className="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleLocationSelect(location)}  // Set location when clicked
                      >
                        {location}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>

            {/* Restaurant name input field with search icon */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Enter food or restaurant name"
                className="w-full px-4 py-4 text-black rounded-r-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 font-bold text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
