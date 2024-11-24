'use client'

import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa' // Importing the search icon
import CustomerHeader from '../_components/CustomerHeader'
import Footer from '../_components/Footer'

export default function Store() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");  // Default to empty string
  const [filteredLocations, setFilteredLocations] = useState([]);  // To store filtered locations based on user input
  const [restaurants, setRestaurants] = useState([]);  // Store fetched restaurants
  const [searchQuery, setSearchQuery] = useState("");  // Store the search query for restaurant names

  useEffect(() => {
    loadLocations();
    loadRestaurants();
  }, []);

  // Fetch all locations
  const loadLocations = async () => {
    let response = await fetch('http://localhost:3000/api/customer/locations');
    response = await response.json();
    if (response.success) {
      setLocations(response.result);
    }
  };

  // Fetch all restaurants
  const loadRestaurants = async () => {
    let response = await fetch('http://localhost:3000/api/customer');
    response = await response.json();
    if (response.success) {
      setRestaurants(response.result);
      console.log(response.result);
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

  // Filter restaurants based on search query and selected location
  const filteredRestaurants = restaurants.filter(restaurant => {
    return (
      (selectedLocation ? restaurant.location.toLowerCase().includes(selectedLocation.toLowerCase()) : true) &&
      (searchQuery ? restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );
  });

  return (
    <div>
      <CustomerHeader />
      
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

            {/* Restaurant search input field with search icon */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Enter food or restaurant name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-4 text-black rounded-r-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 font-bold text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Display filtered restaurants */}
      <div className="p-8">
        <h3 className="text-2xl font-semibold text-center mb-6">Available Restaurants</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
              <img src={restaurant.imageUrl} alt={restaurant.restaurantName} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="text-xl font-semibold">{restaurant.restaurantName}</h4>
                <p className="text-gray-600 mt-2">{restaurant.address}</p>
                <p className="text-gray-600 mt-2">{restaurant.restaurantType}</p>
                <p className="text-sm text-gray-500 mt-2">{restaurant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
