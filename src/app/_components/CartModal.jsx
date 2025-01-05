import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { TiArrowForward } from "react-icons/ti";
import { FaTimes } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function CartModal({ onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  useEffect(()=>{
    setCartItems(JSON.parse(localStorage.getItem('cart')));
  },[]);

  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="relative bg-white rounded-lg shadow-lg max-w-xl w-full overflow-hidden">
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500 transition-transform transform hover:scale-110"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {cartItems.length === 0 ? (
            <div className='grid grid-cols-1 items-center justify-center'>
              <p className="text-center text-lg text-gray-500">Your cart is empty!</p>
              <button
                onClick={() => router.push('/stores')}
                className="mt-4 px-3 py-2 rounded-md bg-orange-600 text-white font-semibold self-center mx-auto"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imagePath}
                      alt={item.foodName}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                    />
                    <div>
                      <p className="text-lg font-medium text-gray-800">{item.foodName}</p>
                      <p className="text-sm text-blue-600 font-semibold">
                        $<span className="text-orange-500">{item.price}</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Close
          </button>
          <Link
            href="/cart"
            className="flex items-center font-semibold"
          >
            <TiArrowForward className="mr-2" />
            <span className='bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-1'>View Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
