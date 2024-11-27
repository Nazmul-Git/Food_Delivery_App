'use client'

import { useEffect, useState } from 'react';
import CartItem from '../_components/CartItem';

export default function ShoppingCart() {
  const [cartStorage, setCartStorage] = useState([]);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        setCartStorage(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        setCartStorage([]); // If parse fails, set to empty array
      }
    }
  }, []); 

  // Add quantity field if not present
  const ensureQuantity = (item) => {
    return {
      ...item,
      quantity: item.quantity || 1 
    };
  };

  // Update quantity for an item
  const updateQuantity = (id, action) => {
    const updatedCart = cartStorage.map(item => {
      if (item._id === id) {
        // Adjust the quantity
        if (action === 'increase') {
          item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
      return item;
    });
    setCartStorage(updatedCart);
  };

  // Calculate total price based on quantity
  const total = cartStorage.reduce((acc, item) => {
    const price = parseFloat(item.price);
    const quantity = item.quantity || 1; // Ensure quantity is set

    // Validate that price and quantity are valid numbers
    if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
      return acc + (price * quantity);
    }
    console.warn(`Invalid price or quantity for item with ID: ${item._id}`);
    return acc; // If invalid, skip this item
  }, 0);

  // VAT and Delivery charge calculations
  const vatPercentage = 0.10; // 10% VAT
  const deliveryCharge = 1.0; // Fixed delivery charge (could be dynamic)

  // Calculate VAT (10% of subtotal) and total including VAT
  const vat = total * vatPercentage;
  const totalWithVat = total + vat;

  // Final total including delivery charge and VAT
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

  return (
    <div className="flex flex-col mt-10 lg:flex-row lg:space-x-8 p-6 lg:px-16 lg:py-10">
      {/* tract process now on cart */}
      <div>
        
      </div>

      {/* Cart Items Section */}
      <div className="flex-1 bg-white rounded-lg shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
        <div className="space-y-4">
          {cartStorage.length === 0 ? (
            <p className="text-lg text-gray-600">Your cart is empty.</p>
          ) : (
            cartStorage.map((item) => {
              const itemWithQuantity = ensureQuantity(item); // Ensure item has a quantity field
              return (
                <CartItem
                  key={itemWithQuantity._id}
                  item={itemWithQuantity}
                  updateQuantity={updateQuantity}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="flex-1 max-w-md bg-white rounded-lg shadow-xl p-8 mt-8 lg:mt-0">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
        <div className="space-y-5">
          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Subtotal ({cartStorage.length} items):</span>
            <span className="text-lg font-semibold text-gray-900">${formattedTotal}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-lg text-gray-700">VAT (10%):</span>
            <span className="text-lg font-semibold text-gray-900">${formattedVat}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Shipping:</span>
            <span className="text-lg text-green-500">FREE</span>
          </div>

          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Discount:</span>
            <span className="text-lg text-gray-500">-</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 mt-6">
            <span>Total (incl. VAT):</span>
            <span>${formattedTotalWithVat}</span>
          </div>

          <div className="flex justify-between text-xl font-bold text-gray-900 mt-6">
            <span>Final Total (incl. VAT & Delivery):</span>
            <span>${formattedFinalTotal}</span>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-full mt-6 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-700 transition-all duration-300">
          Checkout
        </button>
      </div>
    </div>
  );
}
