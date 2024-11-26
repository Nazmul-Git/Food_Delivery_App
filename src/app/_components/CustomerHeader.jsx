'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaShoppingCart } from 'react-icons/fa';
import CartModal from './CartModal'

export default function CustomerHeader({ cartData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const cartStorage = localStorage.getItem('cart');
    if (cartStorage) {
      const parsedCart = JSON.parse(cartStorage);
      setCartItems(parsedCart);
      setCartCount(parsedCart.length);
    }
  }, []);

  const initialCartDataSet = () => {
    setCartCount(1);
    setCartItems([cartData]);
    localStorage.setItem('cart', JSON.stringify([cartData]));
    return;
  }

  useEffect(() => {
    // console.log(cartData);
    if (cartData) {
      if (cartCount) {
        // console.log(cartItems[0]);
        // check if another restaurant
        if (cartItems[0].restaurantId != cartData.restaurantId) {
          localStorage.removeItem('cart');
          initialCartDataSet();
        } else {
          let localCartItem = cartItems;
          const itemExists = localCartItem.some(item => item._id === cartData._id);
          if (!itemExists) {
            // If the item doesn't exist, add it to the cart
            const updatedCartItems = [...localCartItem, cartData];
            setCartItems(updatedCartItems);
            setCartCount(updatedCartItems.length);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            alert('Item added successfully');
          } else {
            alert('Item is already added!');
          }
        }
      } else {
        initialCartDataSet();
      }
    };
  }, [cartData])

  return (
    <header className="bg-gradient-to-r from-black via-indigo-600 to-blue-700 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-xl font-semibold">
          <Link href="/" className="flex flex-col justify-start items-center cursor-pointer">
            <div className="h-14 w-14 mr-2 rounded-full border border-white overflow-hidden">
              <Image
                src="/images/dBoy.jpeg"
                alt="CustomerApp Logo"
                width={56}
                height={56}
                className="object-cover"
                priority
              />
            </div>
            <span className="hidden sm:block">CustomerApp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
            Home
            <FaHome className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link href="/about" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
            About
            <FaInfoCircle className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <button
            onClick={toggleModal}
            className="flex items-center gap-2 text-white font-semibold hover:text-yellow-300 transition relative group"
          >
            Cart (<p className="text-orange-600">{cartCount ? cartCount : 0}</p>)
            <FaShoppingCart className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden bg-black text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-96 p-14 text-lg font-semibold flex flex-col gap-8' : 'max-h-0 p-12 py-0 text-lg font-semibold flex flex-col gap-4'}`}
      >
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
        >
          <FaHome className="w-5 h-5 text-yellow-500" />
          Home
        </Link>
        <Link
          href="/about"
          onClick={() => setIsMenuOpen(false)}
          className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
        >
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          About
        </Link>

        <button
          onClick={toggleModal}
          className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
        >
          <FaShoppingCart className="w-5 h-5 text-yellow-500" />
          Cart (<p className="text-orange-600">{cartCount ? cartCount : 0}</p>)
        </button>
      </div>

      {isModalOpen && (
        <CartModal
          cartItems={cartItems}
          onClose={toggleModal}
          setCartCount={setCartCount}
        />
      )}
    </header>
  );
}
