'use client'

import CustomerHeader from '@/app/_components/CustomerHeader'
import Footer from '@/app/_components/Footer'
import RestaurantDetails from '@/app/_components/RestaurantDetails'
import ScrollToTop from '@/app/_components/ScrollToTop'
import YesNoModal from '@/app/_components/YesNoModal'
import Loading from '@/app/loading'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export default function StoreDetails({ params, searchParams }) {
    const { name } = React.use(params) || {}
    const { id } = React.use(searchParams) || {}

    const [restaurantDetails, setRestaurantDetails] = useState(null)
    const [foodItems, setFoodItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [cartData, setCartData] = useState()
    const [isSaveData, setIsSaveData] = useState([])
    const [visibleFoodItemsCount, setVisibleFoodItemsCount] = useState(6)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const router = useRouter();

    useEffect(() => {
        // Only execute this code in the browser
        if (typeof window !== 'undefined') {
            const cartFromStorage = JSON.parse(localStorage.getItem('cart')) || []
            setIsSaveData(cartFromStorage)
        }
    }, [cartData])

    useEffect(() => {
        const loadRestaurantDetails = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customer/${id}`)
                const data = await response.json()
                if (data.success) {
                    setRestaurantDetails(data.details)
                    setFoodItems(data.foodItems)
                }
            } catch (error) {
                console.error('Failed to load restaurant details:', error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadRestaurantDetails()
        }
    }, [id])

    if (loading) {
        return <Loading />
    }
    if (!restaurantDetails || foodItems.length === 0) {
        return <p>No data found</p>
    }

    const handleAddToCart = (item) => {
        setCartData(item);
        setIsSaveData((prev) => [...prev, item]);
        localStorage.setItem('cart', JSON.stringify([...isSaveData, item]));
        
        // Show toast notification
        toast.success(`${item.foodName} added to the cart!`, {
            autoClose: 2000,
        });
    };

    const handleBuyNow = (item) => {
        handleAddToCart(item)
        router.push('/cart')
    }

    const handleRemoveFromCart = (item) => {
        const updatedCartData = isSaveData.filter((i) => i._id !== item._id);
        setIsSaveData(updatedCartData);
        localStorage.setItem('cart', JSON.stringify(updatedCartData));
    
        // Show toast notification
        toast.info(`${item.foodName} removed from the cart!`, {
            autoClose: 2000,
        });
    };

    const openModal = (item, actionType) => {
        setSelectedItem({ ...item, actionType });
        setIsModalOpen(true);
    };

    const displayedFoodItems = foodItems.slice(0, visibleFoodItemsCount)

    // Load more items when the button is clicked
    const handleLoadMore = () => {
        setVisibleFoodItemsCount((prevCount) => prevCount + 6)
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

            <div className="container mx-auto px-4 md:px-14 py-14">
                {/* Available Foods Section */}
                <p className="text-center text-4xl font-semibold text-indigo-600 mb-10 tracking-wide">
                    Available Foods
                </p>
                <p className="text-xl text-gray-600 mb-6 text-center">{restaurantDetails.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedFoodItems.map(item => (
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
                                            <button
                                                className='bg-gray-300 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition'>Added</button>
                                            :
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    onClick={() => openModal(item, 'buyNow')}
                                                    className='bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full transition'>Buy Now</button>
                                                <button
                                                    onClick={() => openModal(item, 'addToCart')}
                                                    className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-full transition'>Add to Cart</button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {foodItems.length > visibleFoodItemsCount && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-blue-700"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>

            {/* Restaurant Details Section */}
            <RestaurantDetails restaurantDetails={restaurantDetails} />

            <Footer />

            <YesNoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    if (selectedItem) {
                        if (selectedItem.actionType === 'addToCart') {
                            handleAddToCart(selectedItem);
                        } else if (selectedItem.actionType === 'buyNow') {
                            handleBuyNow(selectedItem);
                        } else if (selectedItem.actionType === 'removeFromCart') {
                            handleRemoveFromCart(selectedItem);
                        }
                    }
                }}
            />
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                style={{ marginTop: '80px' }}
            />
        </div>
    )
}
