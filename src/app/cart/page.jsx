'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '../_components/CartItem';
import { vatPercentage, deliveryCharge } from '../lib/constant';
import { TiArrowBack } from "react-icons/ti";
import Loading from '../loading';

export default function Cart() {
  const [cartStorage, setCartStorage] = useState([]);
  const [userStorage, setUserStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sync cartStorage and userStorage with localStorage and initialize state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      const storedUser = localStorage.getItem('user');
      if (storedCart) setCartStorage(JSON.parse(storedCart));
      if (storedUser) setUserStorage(JSON.parse(storedUser));
      setLoading(false); // Data has been fetched, set loading to false
    }
  }, []);

  // Re-sync cartStorage with localStorage when it changes
  useEffect(() => {
    if (cartStorage.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartStorage));
    }
  }, [cartStorage]);

  // Ensure each cart item has a quantity field
  const ensureQuantity = (item) => ({
    ...item,
    quantity: item.quantity || 1,
  });

  // Update item quantity and persist to localStorage
  const updateQuantity = (id, action) => {
    setCartStorage((prevCartStorage) => {
      const updatedCart = prevCartStorage.map((item) => {
        if (item._id === id) {
          const updatedItem = { ...item };
          if (action === 'increase') {
            updatedItem.quantity += 1;
          } else if (action === 'decrease' && updatedItem.quantity > 1) {
            updatedItem.quantity -= 1;
          }
          return updatedItem;
        }
        return item;
      });

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // Calculate totals
  const total = useMemo(() => {
    return cartStorage.reduce((acc, item) => {
      const price = parseFloat(item.price);
      const quantity = item.quantity || 1;

      if (!isNaN(price) && !isNaN(quantity) && quantity > 0) {
        return acc + (price * quantity);
      }
      return acc;
    }, 0);
  }, [cartStorage]);

  const vat = total * vatPercentage;
  const totalWithVat = total + vat;
  const finalTotal = totalWithVat + deliveryCharge;

  const formattedTotal = total ? parseFloat(total.toFixed(2)) : 0;
  const formattedVat = vat ? parseFloat(vat.toFixed(2)) : 0;
  const formattedTotalWithVat = totalWithVat ? parseFloat(totalWithVat.toFixed(2)) : 0;
  const formattedFinalTotal = finalTotal ? parseFloat(finalTotal.toFixed(2)) : 0;

  // Handle item removal
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartStorage.filter((item) => item._id !== itemId);
    setCartStorage(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Limit description to first 10 words
  const limitDescription = (description) => {
    if (!description) return '';
    const words = description.split(' ');
    const truncated = words.slice(0, 10).join(' ');
    return truncated.length < description.length ? truncated + '...' : truncated;
  };

  // Navigate back to stores page
  const handleBackClick = () => {
    router.push('/stores');
  };

  // Proceed to checkout
  const orderNow = () => {
    if (userStorage && cartStorage.length) {
      localStorage.setItem('orderSummery', JSON.stringify({formattedTotal,formattedVat,deliveryCharge,formattedFinalTotal}))
      router.push('/order');
    } else if (!userStorage) {
      router.push('/user?order=true');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col mt-10 lg:flex-row lg:space-x-8 p-6 lg:px-16 lg:py-10">
      {/* Cart Items Section */}
      <div className="flex-1 bg-white rounded-lg shadow-xl p-8 space-y-6 max-h-[480px] overflow-y-auto">
        <div className="mb-6">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="text-indigo-600 text-lg font-semibold flex items-center space-x-2 hover:text-indigo-800 transition-all duration-200 transform hover:scale-105"
          >
            <TiArrowBack />
            <span>Back</span>
          </button>

          {/* Shopping Cart Title */}
          <h1 className="text-3xl font-bold text-pink-700 mt-4">Shopping Cart</h1>
        </div>
        <div className="space-y-4">
          {cartStorage.length === 0 ? (
            <div className='flex flex-col items-center justify-center gap-4'>
              <p className="text-lg text-gray-600">Your cart is empty.</p>
              <button onClick={() => router.push('/stores')} className='px-3 py-2 rounded-md bg-orange-600 text-white font-semibold'>Shop Now</button>
            </div>
          ) : (
            cartStorage.map((item) => {
              const itemWithQuantity = ensureQuantity(item);
              return (
                <CartItem
                  key={itemWithQuantity._id}
                  item={itemWithQuantity}
                  updateQuantity={updateQuantity}
                  handleRemoveItem={handleRemoveItem}
                  limitDescription={limitDescription}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="flex-1 max-w-md bg-white rounded-lg p-8 mt-8 lg:mt-0">
        <h2 className="text-2xl font-semibold text-pink-500 mb-6">Order Summary</h2>
        <div className="space-y-5">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Subtotal ({cartStorage.length} items):</span>
            <span className="text-lg font-semibold text-gray-900">${formattedTotal}</span>
          </div>

          {/* VAT */}
          <div className="flex justify-between">
            <span className="text-lg text-gray-700">VAT (10%):</span>
            <span className="text-lg font-semibold text-gray-900">${formattedVat}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Shipping:</span>
            <span className="text-lg text-gray-900">${deliveryCharge.toFixed(2)}</span>
          </div>

          {/* Discount (if any) */}
          <div className="flex justify-between">
            <span className="text-lg text-gray-700">Discount:</span>
            <span className="text-lg text-gray-500">-</span>
          </div>

          {/* Total (incl. VAT) */}
          <div className="flex justify-between text-xl font-bold text-gray-900 mt-6">
            <span>Total (incl. VAT):</span>
            <span>${formattedTotalWithVat}</span>
          </div>

          {/* Final Total (incl. VAT & Delivery) */}
          <div className="flex justify-between text-xl font-bold text-gray-900 mt-6">
            <span>Final Total (incl. VAT & Delivery):</span>
            <span>${formattedFinalTotal}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button onClick={orderNow}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-full mt-6 hover:bg-gradient-to-r hover:from-pink-600 hover:to-pink-700 transition-all duration-300">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
