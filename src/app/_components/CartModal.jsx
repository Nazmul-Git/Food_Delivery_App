import React, { useState, useEffect } from 'react';

export default function CartModal({ setCartCount, onClose }) {
  // Get the cart from local storage initially
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
      <div className="bg-white p-6 sm:p-8 rounded-lg max-w-lg w-full shadow-lg relative">
        <h2 className="text-4xl text-black font-bold mb-6 text-center">Your Cart</h2>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-3xl font-bold hover:text-red-700 text-black sm:text-2xl"
        >
          &times;
        </button>

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
      </div>
    </div>
  );
}
