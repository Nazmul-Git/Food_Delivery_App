'use client'
import { useState, useEffect } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcDiscover, FaCcAmex } from 'react-icons/fa';
import { IoMdRadioButtonOn, IoMdRadioButtonOff } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { vatPercentage, deliveryCharge } from '../lib/constant';
import { TiArrowBack } from "react-icons/ti";
import Image from 'next/image';
import Loading from '../loading';

export default function Order() {
    const [userStorage, setUserStorage] = useState();
    const [cartStorage, setCartStorage] = useState([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [bankPaymentDetails, setBankPaymentDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLoading(true);
            const cartData = localStorage.getItem('cart');
            const userData = localStorage.getItem('user');
    
            if (cartData) {
                setCartStorage(JSON.parse(cartData));
            } else {
                setCartStorage([]);  
            }
    
            if (userData) {
                setUserStorage(JSON.parse(userData));
            }
            setLoading(false);
        }
    }, []);
    

    // Handle payment method selection
    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setErrors({});
    };

    // Handle bank payment details change
    const handleBankPaymentChange = (e) => {
        const { name, value } = e.target;
        setBankPaymentDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Validate bank payment details
    const validateBankPayment = () => {
        const errors = {};
        if (!bankPaymentDetails.bankName) errors.bankName = 'Bank name is required';
        if (!bankPaymentDetails.accountNumber) errors.accountNumber = 'Account number is required';
        if (!bankPaymentDetails.accountHolderName) errors.accountHolderName = 'Account holder name is required';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedPaymentMethod === 'bank' && !validateBankPayment()) {
            return;
        }
    };


    // Calculate total price based on quantity
    const total = cartStorage.reduce((acc, item) => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 1;

        if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
            return acc + (price * quantity);
        }
        return acc;
    }, 0);

    // Calculate VAT (10% of subtotal) and total including VAT
    const vat = total * vatPercentage;
    const totalWithVat = total + vat;
    const finalTotal = totalWithVat + deliveryCharge;

    // Format all totals to 2 decimal places
    const formattedTotal = total ? parseFloat(total.toFixed(2)) : 0;
    const formattedVat = vat ? parseFloat(vat.toFixed(2)) : 0;
    const formattedTotalWithVat = totalWithVat ? parseFloat(totalWithVat.toFixed(2)) : 0;
    const formattedFinalTotal = finalTotal ? parseFloat(finalTotal.toFixed(2)) : 0;

    // Store cart items in localStorage whenever cartStorage changes
    useEffect(() => {
        if (cartStorage.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartStorage));
        }
    }, [cartStorage]);

    // Handle the back button click
    const handleBackClick = () => {
        router.push('/cart');
    };

    const confirmOrder = async () => {
        if (!selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }
    
        // Check if cartStorage is valid and not empty
        if (!cartStorage || cartStorage.length === 0) {
            alert('Your cart is empty.');
            return;
        }
    
        let user_Id = JSON.parse(localStorage.getItem('user'))._id;
        let foodItemId = cartStorage.map((item) => item._id).toString(); 
        let restaurantId = cartStorage[0].restaurantId;
        let delivery_Id = '6742e28005e7d9d258b57779';
    
        let orderDetails = {
            user_Id,
            foodItemId,
            restaurantId,
            delivery_Id,
            status: 'confirm',
            amount: formattedFinalTotal,
            paymentMethod: selectedPaymentMethod,
        };
    
        console.log(orderDetails);
    
        try {
            let response = await fetch('http://localhost:3000/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });
    
            response = await response.json();
    
            if (response.success) {
                const profile = { ...orderDetails };
                localStorage.setItem('profile', JSON.stringify(profile));
                if(!cartStorage.length){
                    alert('Already confirmed your order!..Go to shop!..');
                    router.push('/stores');
                }
                alert('Order Confirmed Successfully');
                router.push('/your-profile');
            } else {
                alert('Order Failed!');
            }
        } catch (error) {
            alert('Something went wrong. Please try again later.');
        }
    };
    


    if (loading) return <Loading />

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
                    <h1 className="text-3xl font-bold text-pink-700 mt-4">Order Details of <span className='text-green-500'>{userStorage?.fullName}</span> </h1>
                </div>

                {/* Shipping Address Section */}
                <div className="bg-white rounded-lg p-8 mt-8 shadow-md">
                    <div className="space-y-5">
                        <p className='text-green-700 font-bold'>Address : <span className='text-black text-sm'>{userStorage?.address}</span></p>
                        <p className='text-green-700 font-bold'>Email : <span className='text-black text-sm'>{userStorage?.email}</span></p>
                        <p className='text-green-700 font-bold'>Mobile : <span className='text-black text-sm'>{userStorage?.phone}</span></p>

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
                                            <Image
                                                src="/images/bKash-Logo.png"
                                                alt="RestaurantApp Logo"
                                                width={76}
                                                height={76}
                                                className="object-cover"
                                                priority
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
                                            <Image
                                                src="/images/Nagad-Logo.png"
                                                alt="RestaurantApp Logo"
                                                width={76}
                                                height={76}
                                                className="object-cover"
                                                priority
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
                                            <Image
                                                src="/images/PayPal-Logo.png"
                                                alt="RestaurantApp Logo"
                                                width={76}
                                                height={76}
                                                className="object-cover"
                                                priority
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
                            <button onClick={confirmOrder} type="submit" className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md mt-6">
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
                        <span>$ {formattedTotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT (10%):</span>
                        <span>$ {formattedVat}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Charge:</span>
                        <span>$ {deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-pink-500">
                        <span>Total:</span>
                        <span>$ {formattedFinalTotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
