import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { TiArrowForward } from "react-icons/ti";

export default function CartModal({ setCartCount, onClose }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Handle item removal from cart
  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);
  };

  // Close the modal when clicked outside the modal content
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    // Add the event listener for closing the modal when clicked outside
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white bg-opacity-50 p-6 sm:p-8 rounded-lg max-w-lg w-full shadow-lg relative group hover:bg-opacity-70 hover:bg-black hover:bg-blend-darken">
        <h2 className="text-4xl text-white font-bold mb-6 text-center">Your Cart</h2>

        <div className="overflow-y-auto max-h-96">
          {cartItems.length === 0 ? (
            <p className="text-center text-lg text-red-500">Your cart is empty!</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={item.imagePath}
                        alt={item.foodName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-lg font-semibold">{item.foodName}</span>
                      <p className="text-lg text-blue-500">
                        $ <span className="text-orange-500 font-semibold">{item.price}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-700 text-lg"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* View Cart Button */}
        <Link
          href="/cart"
          className="absolute bottom-2 right-1/2 transform translate-x-1/2 text-md font-semibold flex items-center bg-blue-600  bg-blend-lighten px-4 py-2 font-semibold rounded-md text-white hover:underline hover:font-bold transition-all ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 translate-y-8 scale-90"
          aria-label="Go to Cart"
        >
          <TiArrowForward className="text-xl" />
          View Cart
        </Link>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-6xl font-bold text-red-700 sm:text-2xl transform transition-transform duration-300 ease-in-out hover:rotate-180 origin-center"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
