'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '../_components/CartItem';
import { vatPercentage, deliveryCharge } from '../lib/constant';
import { TiArrowBack } from "react-icons/ti";
import Loading from '../loading';
import { getSession } from 'next-auth/react';

export default function Cart() {
  const [cartStorage, setCartStorage] = useState([]);
  const [userStorage, setUserStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession()
      // console.log('current session = ',currentSession);
      setSession(currentSession);
    };

    fetchSession();
  }, []);

  // Load cart and user storage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      const storedUser = localStorage.getItem('user');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart).map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }));
        setCartStorage(parsedCart);
      }
      if (storedUser) setUserStorage(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  // Update localStorage when cartStorage changes
  useEffect(() => {
    if (cartStorage.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartStorage));
    }
  }, [cartStorage]);

  // Update quantity of cart items
  const updateQuantity = (id, action) => {
    setCartStorage((prevCart) => {
      const updatedCart = prevCart.map((item) => {
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
      return updatedCart;
    });
  };

  // Calculate totals
  const total = useMemo(() => {
    return cartStorage.reduce((acc, item) => {
      const price = parseFloat(item.price);
      const quantity = item.quantity || 1;
      return acc + (price * quantity);
    }, 1);
  }, [cartStorage]);

  const vat = total * vatPercentage;
  const totalWithVat = total + vat;
  const finalTotal = totalWithVat + deliveryCharge;

  // Remove an item from the cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartStorage.filter((item) => item._id !== itemId);
    setCartStorage(updatedCart);
  };

  // Limit the description length
  const limitDescription = (description) => {
    if (!description) return '';
    const words = description.split(' ');
    const truncated = words.slice(0, 10).join(' ');
    return truncated.length < description.length ? truncated + '...' : truncated;
  };

  // Navigate back to the stores page
  const handleBackClick = () => {
    router.push('/stores');
  };

  // Proceed to checkout
  const orderNow = () => {
    // console.log(userStorage, cartStorage)
    localStorage.setItem('orderSummary', JSON.stringify({ total, vat, deliveryCharge, finalTotal }));
    if (cartStorage.length > 0) {
      if (userStorage || session?.user) {
        router.push('/order');
      } else {
        router.push('/user?order=true');
      }
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
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-lg text-gray-600">Your cart is empty.</p>
              <button
                onClick={() => router.push('/stores')}
                className="px-3 py-2 rounded-md bg-orange-600 text-white font-semibold"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartStorage.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                updateQuantity={updateQuantity}
                handleRemoveItem={handleRemoveItem}
                limitDescription={limitDescription}
              />
            ))
          )}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="flex-1 max-w-md bg-white rounded-lg p-8 mt-8 lg:mt-0">
        <h2 className="text-2xl font-semibold text-pink-500 mb-6">Order Summary</h2>
        <div className="space-y-5">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* VAT */}
          <div className="flex justify-between">
            <span>VAT (10%):</span>
            <span>${vat.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>${deliveryCharge.toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={orderNow}
          className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg mt-6 hover:bg-pink-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
