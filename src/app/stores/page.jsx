'use client'

import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'; 
import CustomerHeader from '../_components/CustomerHeader';
import Footer from '../_components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollToTop from '../_components/ScrollToTop';
import Loading from '../loading';

export default function Store() {
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  // Show loading spinner only on the first visit
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit');

    if (!isFirstVisit) {
      setLoading(true);
      sessionStorage.setItem('firstVisit', 'true');
    }

    // Load the locations and restaurants once the page is loaded
    loadLocations();
  }, []);

  useEffect(() => {
    loadRestaurants();
  }, [selectedLocation, searchQuery]); 

  // Fetch all locations
  const loadLocations = async () => {
    try {
      let response = await fetch('http://localhost:3000/api/customer/locations');
      response = await response.json();
      if (response.success) {
        setLocations(response.result);
        setLoading(false); // Once locations are loaded, stop the loading state
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Fetch restaurants based on selected location or search query
  const loadRestaurants = async () => {
    let url = `http://localhost:3000/api/customer?`;

    if (selectedLocation) {
      url += `location=${encodeURIComponent(selectedLocation)}&`;
    }

    if (searchQuery) {
      url += `restaurant=${encodeURIComponent(searchQuery)}&`;
    }

    try {
      let response = await fetch(url);
      response = await response.json();
      if (response.success) {
        setRestaurants(response.result);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);

    if (value) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setFilteredLocations([]);
  };

  const limitDescription = (description) => {
    if (!description) return '';
    const words = description.split(' ');
    const truncated = words.slice(0, 10).join(' ');
    return truncated.length < description.length ? truncated + '...' : truncated;
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    return (
      (searchQuery ? (restaurant.restaurantName && restaurant.restaurantName.toLowerCase().includes(searchQuery.toLowerCase())) : true)
    );
  });

  return (
    <div>
      <CustomerHeader />
      
      {/* Show loading spinner only on the first time */}
      {loading && <Loading />}

      <div className="flex items-center justify-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/background-cooking-black-wooden-background-top-view-free-space-your-text_187166-5650.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-white p-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Discover Amazing Restaurants</h2>
            <p className="text-lg sm:text-xl">Find the best places to eat and drink in your city</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Select place"
                value={selectedLocation}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 text-black shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {filteredLocations.length > 0 && selectedLocation && (
                <ul className='absolute bg-white w-full max-h-40 overflow-y-auto z-10 mt-2 shadow-md'>
                  {
                    filteredLocations.map((location, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Enter restaurant name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-blue-600 font-bold text-2xl"
                onClick={() => loadRestaurants()}
              />
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop />

      <div className="p-16">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6">Available Restaurants</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => router.push(`/stores/${restaurant.restaurantName}?id=${restaurant._id}`)}
                className="bg-white rounded-lg shadow-lg overflow-hidden relative group cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.restaurantName}
                  className="w-full h-40 object-cover transition-all duration-300 group-hover:opacity-70"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold">{restaurant.restaurantName}</h4>
                  <p className="text-gray-600 mt-2">{restaurant.address}</p>
                  <p className="text-gray-600 mt-2">{restaurant.restaurantType}</p>
                  <p className="text-sm text-gray-500 mt-2">{limitDescription(restaurant.description)}</p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href={`/stores/${restaurant.restaurantName}?id=${restaurant._id}`} 
                    className="px-6 py-2 font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-xl transform hover:scale-110 transition-all duration-300"
                  >
                    Visit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className=''>
              <p className=" flex justify-center text-red-600 items-center w-full h-80 text-center mt">No restaurants found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
