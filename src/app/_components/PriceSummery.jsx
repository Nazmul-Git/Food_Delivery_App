import React from 'react'

export default function PriceSummery({ orderSummery }) {
    const defaultPrice = 0.00;

    return (
        <div className="bg-white rounded-lg shadow-xl p-8 lg:w-1/3 mt-8">
            <h2 className="text-2xl font-semibold text-pink-500 mb-6">Price Summary</h2>
            <div className="space-y-4">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>$ {orderSummery?.total || defaultPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span>VAT (10%):</span>
                    <span>$ {orderSummery?.vat || defaultPrice}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span>$ {orderSummery?.deliveryCharge || defaultPrice}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-pink-500">
                    <span>Total:</span>
                    <span>$ {orderSummery?.finalTotal || defaultPrice}</span>
                </div>
            </div>
        </div>
    )
}
