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
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');

    useEffect(() => {
        let signedData = JSON.parse(localStorage.getItem('signInData'));
        if (!signedData) {
          const fetchSession = async () => {
            const currentSession = await getSession();
            setSession(currentSession);
            if (currentSession) {
              try {
                localStorage.setItem('signInData', JSON.stringify(currentSession));
                const { name, email, image } = currentSession?.user || {};
                const response = await fetch('http://localhost:3000/api/user/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, fullName: name, image, socialAuth: true }),
                });
                if (response.success) {
                  alert('Information saved!');
                }
              } catch (storageError) {
                console.error('Failed to save data to localStorage:', storageError);
              }
            }
          };
    
          fetchSession();
        }else{
            setSession(signedData);
        }
      }, []);

    const handleAddressChange = (value) => {
        setAddress(value);
    };
    const handlePhoneChange = (value) => {
        setMobile(value);
    };

    useEffect(() => {
        // Fetch cart and user data from localStorage
        const cartData = localStorage.getItem('cart');
        const userData = localStorage.getItem('user');

        if (cartData) {
            setCartStorage(JSON.parse(cartData));
        }
        if (userData) {
            setUserStorage(JSON.parse(userData));
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

    function generateObjectId() {
        return new Array(24).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    }

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

        let randomObjectId = generateObjectId();
        let user_Id = userStorage?._id || randomObjectId.toString();
        let user_Address = userStorage?.address;
        let foodItemId = cartStorage.map((item) => item._id).toString();
        let restaurantId = cartStorage[0].restaurantId;

        // Delivery boy lookup logic
        const addressKeywords = (user_Address && user_Address || address && address)
            .toLowerCase()
            .replace(/[\-,]/g, '')
            .split(/\s*,\s*|\s+/);

        let deliveryBoyResponse = null;

        // Iterate over address keywords to find a delivery boy
        for (let i = 0; i < addressKeywords.length; i++) {
            const searchKeyword = addressKeywords.slice(i).join(' ');
            try {
                deliveryBoyResponse = await fetch(
                    `http://localhost:3000/api/deliveryPartners/${encodeURIComponent(searchKeyword)}`
                );
                deliveryBoyResponse = await deliveryBoyResponse.json();
                if (deliveryBoyResponse.result && deliveryBoyResponse.result.length > 0) {
                    break;
                }
            } catch (error) {
                console.error(`Error searching for keyword "${searchKeyword}":`, error);
            }
        }

        const deliveryBoysIds = deliveryBoyResponse?.result?.map((deliveryMan) => deliveryMan._id);
        let delivery_Id = deliveryBoysIds[Math.floor(Math.random() * deliveryBoysIds.length)];

        // Assemble order details
        let orderDetails = {
            user_Id,
            foodItemId,
            restaurantId,
            delivery_Id,
            customerName: userStorage?.fullName || session?.user?.name,
            image: session?.user?.image ? session.user.image : 'N/A',
            email: userStorage?.email || session?.user?.email,
            mobile: userStorage?.phone || session?.user?.mobile || mobile,
            address: userStorage?.address || session?.user?.location || address,
            status: 'confirm',
            amount: orderSummery?.finalTotal,
            paymentMethod: selectedPaymentMethod,
        };

        try {
            let response = await fetch('http://localhost:3000/api/order', {
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

    // console.log(cartStorage);
    return (
        <div className="flex flex-col mt-10 lg:flex-row lg:space-x-8 p-6 lg:px-16 lg:py-10">
            {/* Cart Items Section */}
            <div className="flex-1 bg-white rounded-lg shadow-xl p-8 space-y-6 max-h-[480px] overflow-y-auto">
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
                <div className="bg-white rounded-lg p-8 mt-8 shadow-md">
                    <div className="space-y-5">
                        <p className='text-xl text-teal-800 font-semibold'>
                            Address:
                            {userStorage?.address || session?.user?.location ? (
                                <span className='text-black text-sm italic'>{userStorage.address || session.user.location}</span>
                            ) : (
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={address}
                                    onChange={(e) => handleAddressChange(e.target.value)}
                                    className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 ml-2 focus:ring-2 focus:ring-teal-300 transition duration-300"
                                    placeholder="Enter your delivery address (City, Zone, Street)"
                                    required
                                />
                            )}
                        </p>

                        {/* Email Section */}
                        <p className='text-xl text-teal-800 font-semibold'>
                            Email:
                            <span className='text-black text-sm italic ml-4'>{userStorage?.email || session?.user?.name}</span>
                        </p>

                        {/* Mobile Section */}
                        <p className='text-xl text-teal-800 font-semibold'>
                            Mobile:
                            {userStorage?.phone || session?.user?.mobile ? (
                                <span className='text-black text-sm italic'>{userStorage.phone || session.user.mobile}</span>
                            ) : (
                                <input
                                    type="tel"  // Change to "tel" for better support of phone numbers
                                    placeholder="+1 234 567 890"  // Example placeholder with country code
                                    className="text-black text-sm border-2 border-teal-500 rounded-lg p-2 ml-2 focus:ring-2 focus:ring-teal-300 transition duration-300"
                                    onInput={(e) => handlePhoneChange(e.target.value)}
                                    pattern="^\+?\d{0,3}[\s\-]?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,4}$" // Pattern to match phone numbers
                                    required
                                />
                            )}
                        </p>


                        {
                            cartStorage && cartStorage.length > 0 && (
                                <div className="bg-white rounded-lg p-8 mt-8 shadow-md">
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
                <div className="bg-white p-8 rounded-lg shadow-xl  mx-auto mt-8">
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
                                if (address && mobile) {
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
