'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TiArrowBack } from 'react-icons/ti';
import Loading from '../loading';
import { getSession } from 'next-auth/react';
import { toast, ToastContainer } from 'react-toastify';
import PriceSummery from '../_components/PriceSummery';
import PaymentForm from '../_components/PaymentForm';
import YesNoModal from '../_components/YesNoModal';

export default function Order() {
    const [userStorage, setUserStorage] = useState();
    const [cartStorage, setCartStorage] = useState([]);
    const [orderSummery, setOrderSummery] = useState({});
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('+088');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zone, setZone] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmOrderAction, setConfirmOrderAction] = useState(null);
    const router = useRouter();

    // console.log('user', userStorage);
    // console.log('order summery', orderSummery);

    const countryCodes = [
        { code: '+088', label: 'BD' },
        { code: '+1', label: 'US' },
        { code: '+44', label: 'UK' },
        { code: '+91', label: 'IN' },
    ];

    useEffect(() => {
        const storedOrderSummary = JSON.parse(localStorage.getItem('orderSummary'));
        const orderStatus = localStorage.getItem('orderStatus');

        if (orderStatus === 'confirmed' && !storedOrderSummary) {
            router.push('/your-profile');
            return;
        }

        // Fetch order summary
        if (storedOrderSummary) {
            setOrderSummery(storedOrderSummary);
        }

        // Fetch user and cart data from localStorage
        const cartData = localStorage.getItem('cart');
        const userData = localStorage.getItem('user');
        const authUser = localStorage.getItem('authUser');

        if (cartData) {
            setCartStorage(JSON.parse(cartData));
        }
        if (userData || authUser) {
            setUserStorage(JSON.parse(userData) || JSON.parse(authUser));
        }

        setLoading(false);
    }, [router]);

    useEffect(() => {
        let signedData = JSON.parse(localStorage.getItem('authUser'));

        if (!signedData) {
            const fetchSession = async () => {
                const currentSession = await getSession();

                if (currentSession) {
                    setSession(currentSession);

                    try {
                        const { name, email, image } = currentSession.user || {};
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, fullName: name, image, socialAuth: true }),
                        });
                        const responseData = await response.json();
                        // console.log('auth user ',responseData);
                        if (response.ok && responseData.success) {
                            // Save session data with userId to localStorage
                            localStorage.setItem('authUser', JSON.stringify(responseData));
                        } else {
                            console.error('Failed to save user data:', responseData.error);
                        }
                    } catch (err) {
                        console.error('Failed to fetch session data:', err);
                    }
                }
            };

            fetchSession();
        } else {
            setSession(signedData);
        }
    }, []);

    const handleCountryCodeChange = (newCode) => {
        setCountryCode(newCode);
    };

    const handleCityChange = (value) => {
        setCity(value);
    };

    const handleZoneChange = (value) => {
        setZone(value);
    };

    const handleStreetChange = (value) => {
        setStreet(value);
    };

    const handlePhoneChange = (value) => {
        setMobile(value);
    };

    const handleBackClick = () => {
        router.back();
    };

    // console.log('user', userStorage.loggedUser._id);
    const confirmOrder = async () => {
        // Check if a payment method has been selected
        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method.');
            return;
        }

        // Check if the cart is empty
        if (!cartStorage || cartStorage.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }

        // Fallback to authUser if userStorage is undefined or incomplete
        let user = userStorage || JSON.parse(localStorage.getItem('authUser'));

        if (!user) {
            toast.error('User is not authenticated.');
            return;
        }

        let user_Id = user._id || user?.loggedUser?._id;
        let foodItemId = cartStorage.map((item) => item._id).toString();
        let restaurantId = cartStorage[0].restaurantId;
        let delivery_Id = null;

        // Normalize the city input
        const normalizeString = (str) => str.toLowerCase().replace(/[-\d]/g, '').trim();
        const normalizedCity = normalizeString(city);

        if (normalizedCity) {
            try {
                const deliveryBoyResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/deliveryPartners?city=${encodeURIComponent(normalizedCity)}`
                );
                const deliveryBoyData = await deliveryBoyResponse.json();
                if (deliveryBoyData.success && deliveryBoyData.result.length > 0) {
                    const randomIndex = Math.floor(Math.random() * deliveryBoyData.result.length);
                    delivery_Id = deliveryBoyData.result[randomIndex]._id;
                }
            } catch (error) {
                console.error('Error fetching delivery boy data:', error);
            }
        } else {
            toast.error('City must be provided.');
            return;
        }

        // Assemble order details
        let orderDetails = {
            user_Id: user_Id,
            foodItemId,
            restaurantId,
            delivery_Id: delivery_Id || null,
            customerName: user.loggedUser?.fullName || user.fullName,
            image: user.loggedUser?.image || user.image,
            email: user.loggedUser?.email || user.email,
            countryCode: countryCode || 'N/A',
            mobile: mobile,
            city: city,
            zone: zone,
            street: street,
            status: 'confirm',
            amount: orderSummery?.finalTotal,
            paymentMethod: selectedPaymentMethod,
        };

        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            const data = await response.json();

            if (data?.success || session?.user) {
                const orderDetailsStorage = {
                    ...orderDetails,
                    success: data.success || (session?.user && true),
                };
                localStorage.setItem('profile', JSON.stringify(orderDetailsStorage));
                localStorage.setItem('orderStatus', 'confirmed');
                localStorage.removeItem('orderSummary');
                toast.success('Order Confirmed Successfully');
                router.push('/your-profile');
            } else {
                toast.error(data.message || 'Order Failed!');
                router.push('/stores');
            }
        } catch (error) {
            console.error('Error confirming order:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };


    if (loading) return <Loading />;

    return (
        <div className="flex flex-col mt-10 lg:flex-row lg:space-x-8 p-6 lg:px-16 lg:py-10">
            {/* Cart Items Section */}
            <div className="flex-1  rounded-lg p-8 space-y-6 max-h-[480px] overflow-y-auto">
                <div className="mb-6">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={handleBackClick}
                        className="text-indigo-600 text-lg font-semibold flex items-center space-x-2 hover:text-indigo-800 transition-all duration-200 transform hover:scale-105"
                    >
                        <TiArrowBack />
                        <span>Back</span>
                    </button>

                    {/* Shopping Cart Title */}
                    <h1 className="text-3xl font-bold text-pink-700 mt-4">Order Details of <span className='text-green-500'>{userStorage?.fullName || session?.user?.name}</span> </h1>
                </div>

                {/* Shipping Address Section */}
                <div className="bg-white rounded-lg p-8 mt-8 shadow-sm">
                    <div className="space-y-5">
                        <div className='text-xl text-teal-800 font-semibold'>
                            City/Division: <span className='text-red-600'>*</span>
                            <input
                                type="text"
                                name="city"
                                id="city"
                                value={city}
                                onChange={(e) => handleCityChange(e.target.value)}
                                className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 focus:ring-2 focus:ring-teal-300 transition duration-300 w-full"
                                placeholder="Enter your delivery address "
                                required
                            />
                        </div>
                        <div className='text-xl text-teal-800 font-semibold'>
                            Zone/District: <span className='text-red-600'>*</span>
                            <input
                                type="text"
                                name="zone"
                                id="zone"
                                value={zone}
                                onChange={(e) => handleZoneChange(e.target.value)}
                                className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 focus:ring-2 focus:ring-teal-300 transition duration-300 w-full"
                                placeholder="Enter your delivery address "
                                required
                            />
                        </div>
                        <div className='text-xl text-teal-800 font-semibold'>
                            Street: <span className='text-red-600'>*</span>  <span className='text-sm'>(Road no, House no etc.)</span>
                            <input
                                type="text"
                                name="street"
                                id="street"
                                value={street}
                                onChange={(e) => handleStreetChange(e.target.value)}
                                className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 focus:ring-2 focus:ring-teal-300 transition duration-300 w-full"
                                placeholder="Enter your delivery address "
                                required
                            />
                        </div>

                        {/* Email Section */}
                        <div className='text-xl text-teal-800 font-semibold'>
                            Email:
                            <span className='text-black text-sm italic ml-4'>{userStorage?.loggedUser?.email || userStorage?.email}</span>
                        </div>

                        {/* Mobile Section */}
                        <div className='text-xl text-teal-800 font-semibold'>
                            Mobile: <span className='text-red-600'>*</span>

                            <div className="flex items-center gap-2">
                                {/* Country Code Dropdown */}
                                <select
                                    className="border-2 border-teal-500 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-300 transition duration-300"
                                    onChange={(e) => handleCountryCodeChange(e.target.value)}
                                    value={countryCode}
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.code} ({country.label})
                                        </option>
                                    ))}
                                </select>

                                {/* Phone Number Input */}
                                <input
                                    type="tel"
                                    placeholder="123 456 7890"
                                    className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 focus:ring-2 focus:ring-teal-300 transition duration-300 w-full"
                                    onInput={(e) => handlePhoneChange(e.target.value)}
                                    pattern="\d{3}[\s\-]?\d{3}[\s\-]?\d{4}"
                                    required
                                />
                            </div>
                        </div>


                        {
                            cartStorage && cartStorage.length > 0 && (
                                <div className="bg-white rounded-lg p-8 mt-8 ">
                                    <h2 className="text-2xl font-semibold text-pink-500 mb-6">Order Items</h2>
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="border-b-2 border-gray-300">
                                                <th className="px-4 py-2 text-left text-green-700 font-semibold">Product</th>
                                                <th className="px-4 py-2 text-center text-green-700 font-semibold">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartStorage.map((item, index) => (
                                                    <tr key={index} className="border-b border-gray-100">
                                                        <td className="px-4 py-2 text-black">{item.foodName}</td>
                                                        <td className="px-4 py-2 text-black text-center">{item.quantity || 1}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white p-8 rounded-lg shadow-sm  mx-auto mt-8">
                    <h2 className="text-2xl font-semibold text-pink-500 mb-6">Payment Method</h2>

                    <PaymentForm
                        city={city}
                        zone={zone}
                        street={street}
                        mobile={mobile}
                        confirmOrder={confirmOrder}
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                        setConfirmOrderAction={setConfirmOrderAction}
                        setIsModalOpen={setIsModalOpen}
                    />

                </div>
            </div>

            {/* Price Summary Section */}
            <PriceSummery
                orderSummery={orderSummery}
            />
            <YesNoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    // If user confirms, proceed with the order
                    confirmOrderAction(); // Confirm the order
                    toast.success('Your order has been confirmed!'); // Show success toast
                    setIsModalOpen(false); // Close the modal
                }}
                onCancel={() => setIsModalOpen(false)} // Close modal on cancel
                message="Are you sure you want to confirm your order?"
                confirmText="Yes, Confirm"
                cancelText="Cancel"
            />

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                style={{ marginTop: '0px' }}
            />
        </div>
    );
}
