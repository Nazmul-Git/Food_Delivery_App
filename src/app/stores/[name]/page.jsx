'use client'

import CustomerHeader from '@/app/_components/CustomerHeader'
import Footer from '@/app/_components/Footer'
import RestaurantDetails from '@/app/_components/RestaurantDetails';
import ScrollToTop from '@/app/_components/ScrollToTop';
import Loading from '@/app/loading';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function StoreDetails({ params, searchParams }) {
    const { name } = React.use(params) || {};
    const { id } = React.use(searchParams) || {};

    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartData, setCartData] = useState();
    const [isSaveData, setIsSaveData] = useState([]);
    const router = useRouter();


    useEffect(() => {
        // Only execute this code in the browser
        if (typeof window !== 'undefined') {
            const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || [];
            setIsSaveData(cartFromStorage);
        }
    }, [cartData]);

    useEffect(() => {
        const loadRestaurantDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/customer/${id}`);
                const data = await response.json();
                if (data.success) {
                    setRestaurantDetails(data.details);
                    setFoodItems(data.foodItems);
                }
            } catch (error) {
                console.error('Failed to load restaurant details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadRestaurantDetails();
        }
    }, [id]);

    if (loading) {
        return <Loading />;
    }
    if (!restaurantDetails || foodItems.length === 0) {
        return <p>No data found</p>;
    }

    const addToCart = (item) => {
        setCartData(item);
    }

    return (
        <div>
            <CustomerHeader cartData={cartData} />
            <div
                className="relative bg-cover bg-center min-h-screen"
                style={{
                    backgroundImage: `url(${restaurantDetails?.imageUrl || ''})`,
                }}
            >
                {/* Apply blur effect to the background image */}
                <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md"></div>
                <p className='md:text-8xl text-4xl text-white font-extrabold absolute inset-0 flex justify-center items-center'>
                    {decodeURI(name)}
                </p>
            </div>

            <ScrollToTop />

            <div className="container mx-auto px-14 py-14">
                {/* Available Foods Section */}
                <p className="text-center text-4xl font-semibold text-indigo-600 mb-10 tracking-wide">
                    Available Foods
                </p>
                <p className="text-xl text-gray-600 mb-6 text-center">{restaurantDetails.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {foodItems.map(item => (
                        <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out flex flex-col">
                            <img src={item.imagePath} alt={item.foodName} className="w-full h-64 object-cover" />
                            <div className="flex flex-col flex-grow p-4">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.foodName}</h3>

                                {/* Truncate description to a limited number of words */}
                                <p className="text-lg text-gray-700 mt-2 flex-grow">
                                    {item.description.split(' ').slice(0, 10).join(' ')}{item.description.split(' ').length > 10 && '...'}
                                </p>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold text-green-500">${item.price}</span>

                                    {
                                        isSaveData.find((i) => i._id === item._id) ?
                                            <button onClick={() => addToCart(item)}
                                                className='bg-gray-300 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition'>Added</button>
                                            :
                                            <div className='flex items-center gap-2'>
                                                <button onClick={() => {
                                                    addToCart(item);
                                                    router.push('/cart');
                                                }} className='bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full transition'>Buy Now</button>
                                                <button onClick={() => addToCart(item)} className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full transition'>Add to Cart</button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Restaurant Details Section */}
            <RestaurantDetails restaurantDetails={restaurantDetails} />

            <Footer />
        </div>
    );
}
