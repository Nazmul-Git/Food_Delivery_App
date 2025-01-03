import React, { useState } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify';

export default function PaymentForm({
    confirmOrder,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setConfirmOrderAction,
    setIsModalOpen,
    mobile,
    city,
    zone,
    street
}) {
    const [errors, setErrors] = useState({});
    const [bankPaymentDetails, setBankPaymentDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
    });

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

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedPaymentMethod === 'bank' && !validateBankPayment()) {
            return; // Stop if bank details are not valid
        }

        // Open the confirmation modal if everything is validated
        setConfirmOrderAction(() => confirmOrder);
        setIsModalOpen(true);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                {/* Payment Method Options */}
                <div className="space-y-4">
                    {/* Bank Payment Method */}
                    <div className="flex space-x-4">
                        <div className='flex-1 gap-2'>
                            <div className='flex justify-between items-center'>
                                <p className='text-green-700 text-lg font-semibold mb-2'>BANK</p>
                                <Image
                                    src="/images/Bank-Logo.png"
                                    alt="Bank Logo"
                                    className="object-cover"
                                    width={96}
                                    height={8}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange('bank')}
                                className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'bank' ? 'bg-gradient-to-r from-green-500 to-orange-600 text-white' : 'bg-gray-100'}`}
                            >
                                Bank Transfer
                            </button>
                        </div>
                    </div>

                    {/* Bkash Payment Method */}
                    <div className="flex space-x-4">
                        <div className='flex-1'>
                            <Image
                                src="/images/bkash-Logo.png"
                                alt="Bkash Logo"
                                className="h-10 w-28 object-cover"
                                width={112}
                                height={40}
                            />
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange('bkash')}
                                className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'bkash' ? 'bg-gradient-to-r from-pink-700 to-pink-400 text-white' : 'bg-gray-100'}`}
                            >
                                Bkash Payment
                            </button>
                        </div>
                    </div>

                    {/* Nagad Payment Method */}
                    <div className="flex space-x-4">
                        <div className='flex-1'>
                            <Image
                                src="/images/nagad-logo.png"
                                alt="Nagad Logo"
                                className="h-10 w-28 object-cover"
                                width={112}
                                height={40}
                            />
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange('nagad')}
                                className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'nagad' ? 'bg-gradient-to-r from-orange-700 to-yellow-400 text-white' : 'bg-gray-100'}`}
                            >
                                Nagad Payment
                            </button>
                        </div>
                    </div>

                    {/* PayPal Payment Method */}
                    <div className="flex space-x-4">
                        <div className='flex-1'>
                            <Image
                                src="/images/paypal-logo.png"
                                alt="PayPal Logo"
                                className="h-10 w-28 object-cover"
                                width={112}
                                height={40}
                            />
                            <button
                                type="button"
                                onClick={() => handlePaymentMethodChange('paypal')}
                                className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'paypal' ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white' : 'bg-gray-100'}`}
                            >
                                PayPal Payment
                            </button>
                        </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div className="w-2/4 py-2">
                        <h1 className="text-xl font-semibold text-pink-500 mt-8 py-2">Cash on Delivery</h1>
                        <button
                            type="button"
                            onClick={() => handlePaymentMethodChange('cash')}
                            className={`w-full px-4 py-3 text-lg font-semibold text-left border rounded-md transition-all duration-300 ${selectedPaymentMethod === 'cash' ? 'bg-gradient-to-r from-pink-500 to-yellow-300 text-white' : 'bg-gray-100'}`}
                        >
                            Cash on Delivery
                        </button>
                    </div>
                </div>

                {/* Bank Payment Details */}
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

                {/* Confirm Order Button */}
                <button
                    onClick={() => {
                        if (city && zone && street && mobile) {
                            // Open modal to confirm the order
                            setConfirmOrderAction(() => confirmOrder);
                            setIsModalOpen(true);
                        }
                    }}
                    type="submit"
                    className="w-full py-3 bg-pink-500 text-white text-lg font-semibold rounded-md mt-6"
                >
                    Confirm your Order
                </button>

            </div>
        </form>
    );
}
