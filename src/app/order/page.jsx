'use client';
import { useState, useEffect } from 'react';
import { IoMdRadioButtonOn, IoMdRadioButtonOff } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { TiArrowBack } from 'react-icons/ti';
import Loading from '../loading';
import { getSession } from 'next-auth/react';

export default function Order() {
    const [userStorage, setUserStorage] = useState();
    const [cartStorage, setCartStorage] = useState([]);
    const [orderSummery, setOrderSummery] = useState();
    const [loading, setLoading] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [bankPaymentDetails, setBankPaymentDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [mobile, setMobile] = useState('');
    const [countryCode, setCountryCode] = useState('+088');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zone, setZone] = useState('');

    // console.log('user', userStorage);

    const countryCodes = [
        { code: '+088', label: 'BD' },
        { code: '+1', label: 'US' },
        { code: '+44', label: 'UK' },
        { code: '+91', label: 'IN' },
        // Add more country codes as needed
    ];

    const handleCountryCodeChange = (newCode) => {
        setCountryCode(newCode);
    };

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

    useEffect(() => {
        // Fetch cart and user data from localStorage
        const cartData = localStorage.getItem('cart');
        const userData = localStorage.getItem('user');
        const authUser = localStorage.getItem('authUser');

        if (cartData) {
            setCartStorage(JSON.parse(cartData));
        }
        if (userData) {
            setUserStorage(JSON.parse(userData));
        }
        if (authUser) {
            setUserStorage(JSON.parse(authUser));
        }

        // Fetch order summary
        const storedOrderSummary = JSON.parse(localStorage.getItem('orderSummary'));
        if (storedOrderSummary) {
            setOrderSummery(storedOrderSummary);
        } else {
            router.push('/stores');
        }

        setLoading(false);
    }, [router]);

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setErrors({});
    };

    const handleBackClick = () => {
        router.push('/cart');
    };

    const handleBankPaymentChange = (e) => {
        const { name, value } = e.target;
        setBankPaymentDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateBankPayment = () => {
        const errors = {};
        if (!bankPaymentDetails.bankName) errors.bankName = 'Bank name is required';
        if (!bankPaymentDetails.accountNumber) errors.accountNumber = 'Account number is required';
        if (!bankPaymentDetails.accountHolderName) errors.accountHolderName = 'Account holder name is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedPaymentMethod === 'bank' && !validateBankPayment()) {
            return;
        }
    };

    const confirmOrder = async () => {
        // Check if a payment method has been selected
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Check if the cart is empty
        if (!cartStorage || cartStorage.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        // let randomObjectId = generateObjectId();
        let user_Id = userStorage?._id || userStorage?.loggedUser?._id;
        let foodItemId = cartStorage.map((item) => item._id).toString();
        let restaurantId = cartStorage[0].restaurantId;
        let delivery_Id = null;

        // Normalize the city and zone inputs
        const normalizeString = (str) => str.toLowerCase().replace(/[-\d]/g, '').trim();

        const normalizedCity = normalizeString(city);
        const normalizedZone = normalizeString(zone);

        if (normalizedCity && normalizedZone) {
            try {
                const deliveryBoyResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/deliveryPartners?city=${encodeURIComponent(normalizedCity)}&zone=${encodeURIComponent(normalizedZone)}`
                );
                const deliveryBoyData = await deliveryBoyResponse.json();
                console.log(deliveryBoyData);

                if (deliveryBoyData.success && deliveryBoyData.result.length > 0) {
                    // Generate a random index between 0 and the length of the result array
                    const randomIndex = Math.floor(Math.random() * deliveryBoyData.result.length);
                    // Select the delivery boy at the random index and get their _id
                    delivery_Id = deliveryBoyData.result[randomIndex]._id;
                    console.log('Random Delivery Boy ID:', delivery_Id);
                } else {
                    console.log('Failed to find a matching delivery boy.');
                }
            } catch (error) {
                console.error('Error fetching delivery boy data:', error);
            }
        } else {
            console.log('City and zone must be provided.');
        }

        // Assemble order details
        let orderDetails = {
            user_Id,
            foodItemId,
            restaurantId,
            delivery_Id,
            customerName: userStorage?.loggedUser?.fullName || userStorage?.fullName,
            image: userStorage?.loggedUser?.image || userStorage?.image,
            email: userStorage?.loggedUser?.email || userStorage?.email,
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

            // Check the response success
            if (data?.success || session?.user) {
                const orderDetailsStorage = {
                    ...orderDetails,
                    success: data.success || session?.user && true,
                };
                localStorage.setItem('profile', JSON.stringify(orderDetailsStorage));
                alert('Order Confirmed Successfully');
                router.push('/your-profile');
            } else {
                alert(data.message || 'Order Failed!');
                router.push('/stores');
            }
        } catch (error) {
            console.error('Error confirming order:', error);
            alert('Something went wrong. Please try again later.');
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

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Payment Method Options */}
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <div className=' flex-1'>
                                        <p className='text-green-700 text-lg font-semibold mb-2'>BANK</p>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('bank')}
                                            className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'bank' ? 'bg-gradient-to-r from-green-500 to-orange-600 text-white' : 'bg-gray-100'}`}
                                        >
                                            Bank Transfer
                                        </button>
                                    </div>
                                    <IoMdRadioButtonOn className={`text-xl ${selectedPaymentMethod === 'bank' ? 'text-pink-600' : 'text-gray-400'}`} />
                                </div>
                                {/* Other payment methods (Bkash, Nagad, Rocket) */}
                                <div className="flex items-baseline  space-x-4">
                                    <div className=' flex-1'>
                                        <div className='flex items-center justify-between '>
                                            <p className='text-green-700 text-lg font-semibold mb-2'>Bkash</p>
                                            <img
                                                src="/images/bkash-Logo.png"
                                                alt="RestaurantApp Logo"
                                                className="h-10 w-28 object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('bkash')}
                                            className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'bkash' ? 'bg-gradient-to-r from-pink-500 to-pink-700 text-white' : 'bg-gray-100'}`}
                                        >
                                            Bkash Payment
                                        </button>
                                    </div>
                                    <IoMdRadioButtonOn className={`text-xl ${selectedPaymentMethod === 'bkash' ? 'text-pink-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex items-baseline space-x-4">
                                    <div className=' flex-1'>
                                        <div className='flex items-center justify-between '>
                                            <p className='text-green-700 text-lg font-semibold mb-2'>Nagad</p>
                                            <img
                                                src="/images/nagad-Logo.png"
                                                alt="RestaurantApp Logo"
                                                className="h-10 w-28 object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('nagad')}
                                            className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'nagad' ? 'bg-gradient-to-r from-yellow-500 to-red-600 text-white' : 'bg-gray-100'}`}
                                        >
                                            Nagad Payment
                                        </button>
                                    </div>
                                    <IoMdRadioButtonOn className={`text-xl ${selectedPaymentMethod === 'nagad' ? 'text-pink-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex items-baseline space-x-4">
                                    <div className=' flex-1'>
                                        <div className='flex items-center justify-between '>
                                            <p className='text-green-700 text-lg font-semibold mb-2'>PayPal</p>
                                            <img
                                                src="/images/paypal-Logo.png"
                                                alt="RestaurantApp Logo"
                                                className="h-10 w-28 object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handlePaymentMethodChange('paypal')}
                                            className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'paypal' ? 'bg-gradient-to-r from-purple-700 to-blue-400 text-white' : 'bg-gray-100'}`}
                                        >
                                            PayPal Payment
                                        </button>
                                    </div>
                                    <IoMdRadioButtonOn className={`text-xl ${selectedPaymentMethod === 'paypal' ? 'text-pink-600' : 'text-gray-400'}`} />
                                </div>
                                <div className='w-2/4 py-2'>
                                    <h1 className="text-xl font-semibold text-pink-500 mt-8 py-2">Cash on Delivery</h1>
                                    <button
                                        type="button"
                                        onClick={() => handlePaymentMethodChange('cash')}
                                        className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'cash' ? 'bg-gradient-to-r from-pink-500 to-yellow-300 text-white' : 'bg-gray-100'}`}
                                    >
                                        Cash on delivery
                                    </button>
                                </div>
                            </div>

                            {/* Bank Payment Details (conditionally rendered) */}
                            {selectedPaymentMethod === 'bank' && (
                                <div className="space-y-4 mt-4">
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={bankPaymentDetails.bankName}
                                        onChange={handleBankPaymentChange}
                                        placeholder="Bank Name"
                                        className="w-full px-4 py-2 border rounded-md shadow-sm"
                                    />
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={bankPaymentDetails.accountNumber}
                                        onChange={handleBankPaymentChange}
                                        placeholder="Account Number"
                                        className="w-full px-4 py-2 border rounded-md shadow-sm"
                                    />
                                    <input
                                        type="text"
                                        name="accountHolderName"
                                        value={bankPaymentDetails.accountHolderName}
                                        onChange={handleBankPaymentChange}
                                        placeholder="Account Holder Name"
                                        className="w-full px-4 py-2 border rounded-md shadow-sm"
                                    />
                                    {errors.bankName && <p className="text-red-500">{errors.bankName}</p>}
                                    {errors.accountNumber && <p className="text-red-500">{errors.accountNumber}</p>}
                                    {errors.accountHolderName && <p className="text-red-500">{errors.accountHolderName}</p>}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button onClick={() => {
                                if (city && zone && street && mobile) {
                                    confirmOrder();
                                } else {
                                    alert('Address & mobile number fields are required!');
                                }
                            }
                            } type="submit" className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md mt-6">
                                Confirm your Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Price Summary Section */}
            <div className="bg-white rounded-lg shadow-xl p-8 lg:w-1/3 mt-8">
                <h2 className="text-2xl font-semibold text-pink-500 mb-6">Price Summary</h2>
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>$ {orderSummery?.total}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT (10%):</span>
                        <span>$ {orderSummery?.vat}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>$ {orderSummery?.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-pink-500">
                        <span>Total:</span>
                        <span>$ {orderSummery?.finalTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
