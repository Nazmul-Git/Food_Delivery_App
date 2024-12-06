'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import { TbUserQuestion } from "react-icons/tb";
import { useRouter } from 'next/navigation';

export default function DeliveryHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // This effect will handle clearing the cart when the order is confirmed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deliveryUserStorage = JSON.parse(localStorage.getItem('deliveryUser'));
      setUser(deliveryUserStorage);
    }
  }, []);

  // Logout functionality
  const handleLogout = () => {
    // Clear user and cart data from localStorage
    localStorage.removeItem('deliveryUser');
    // Reset state
    setUser(null);
    router.push('/delivery-user');
  };

  // Fallback profile image or initials (first letter of email)
  const getProfileImage = () => {
    if (user && user?.fullName) {
      const initials = user?.fullName?.charAt(0).toUpperCase(); 
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
          {initials}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">
        ?
      </div>
    );
  };

  return (
    <header className="bg-gradient-to-r from-black via-indigo-600 to-blue-700 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-xl font-semibold">
          <Link href="/" className="flex flex-col justify-start items-center cursor-pointer">
            <div className="h-14 w-14 mr-2 rounded-full border border-white overflow-hidden">
              <Image
                src="/images/delevery_logo.jpg"
                alt="CustomerApp Logo"
                width={76}
                height={76}
                className="object-cover"
                priority
              />
            </div>
            <span className="hidden sm:block">DeliveryApp</span>
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

          {/* Conditional Rendering for User */}
          {user ? (
            <button onClick={handleLogout} className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Logout
              <FaUserCircle className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ) : (
            <Link href="/user" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Login/Signup
              <TbUserQuestion className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}

          {/* Profile Image or Initials */}
          <button
            onClick={() => {
              user ? 
              router.push('/profile')
              :
              router.push('/login');
            }}
            className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
          >
            {getProfileImage()}
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
        <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
          <FaHome className="w-5 h-5 text-yellow-500" />
          Home
        </Link>
        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          About
        </Link>

        {/* Conditional Rendering for User */}
        {user ? (
          <button onClick={handleLogout} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <FaUserCircle className="w-5 h-5 text-yellow-500" />
            Logout
          </button>
        ) : (
          <Link href="/user" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <TbUserQuestion className="w-5 h-5 text-yellow-500" />
            Login/Signup
          </Link>
        )}

       
      </div>
    </header>
  );
}
