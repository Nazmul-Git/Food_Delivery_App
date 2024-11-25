'use client'

import CustomerHeader from '@/app/_components/CustomerHeader'
import Footer from '@/app/_components/Footer'
import Loading from '@/app/loading';
import React, { useEffect, useState } from 'react';

export default function StoreDetails({ params, searchParams }) {
    // Unwrap the `params` and `searchParams` using `React.use()`
    const { name } = React.use(params);  // Use React.use() to unwrap params
    const { id } = React.use(searchParams);  // Use React.use() to unwrap searchParams

    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);  // Add a loading state

    // Fetch restaurant details when the component mounts
    useEffect(() => {
        const loadRestaurantDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/customer/${id}`);  // Use the unwrapped id from searchParams
                const data = await response.json();
                if (data.success) {
                    setRestaurantDetails(data.details);  // Set restaurant details
                    setFoodItems(data.foodItems);  // Set food items
                }
            } catch (error) {
                console.error('Failed to load restaurant details:', error);
            } finally {
                setLoading(false);  // Stop loading once the request is done
            }
        };

        if (id) {
            loadRestaurantDetails();  // Call the async function only if `id` exists
        }
    }, [id]);  // `id` as a dependency so it runs when `id` changes

    if (loading) {
        return <Loading />;  // Return a loading component while waiting for data
    }

    // If no restaurant details or food items found
    if (!restaurantDetails || foodItems.length === 0) {
        return <p>No data found</p>;
    }

    return (
        <div>
            <CustomerHeader />
            <div 
                className="relative bg-cover bg-center min-h-screen" 
                style={{ backgroundImage: "url('https://img.freepik.com/premium-photo/background-cooking-black-wooden-background-top-view-free-space-your-text_187166-5650.jpg')" }}
            >
                <p className='md:text-8xl text-4xl text-white font-extrabold absolute inset-0 flex justify-center items-center'>{decodeURI(name)}</p>
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="container mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-semibold">Restaurant Details</h2>
                    <p className="text-xl mt-4">{restaurantDetails.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {foodItems.map(item => (
                        <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out">
                            <img src={item.imagePath} alt={item.foodName} className="w-full h-64 object-cover" />
                            <div className="p-4">
                                <h3 className="text-2xl font-semibold">{item.foodName}</h3>
                                <p className="text-lg text-gray-700 mt-2">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-green-500">${item.price}</span>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
