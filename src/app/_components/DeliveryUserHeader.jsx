'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import { TbUserQuestion } from "react-icons/tb";
import { useRouter } from 'next/navigation';

export default function deliveryHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deliveryUserStorage = JSON.parse(localStorage.getItem('deliveryUser'));
      setUser(deliveryUserStorage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('deliveryUser');
    setUser(null);
    router.push('/delivery-user');
  };

  const getProfileImage = () => {
    if (user && user?.fullName) {
      const initials = user?.fullName?.charAt(0).toUpperCase();
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 text-white font-semibold">
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

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    if (touchStartY - currentY > 50) {
      // Swipe up detected
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-green-700 to-black shadow-lg py-1">
      <div className="max-w-screen-xl mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-xl font-semibold">
          <Link
            href="/"
            className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity duration-300"
          >
            {/* Logo Wrapper */}
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-yellow-500 shadow-md bg-white">
              <img
                src={user?.imageUrl || '/images/2.png'}
                alt="Restaurant Logo"
                className="object-cover w-full h-full"
              />
              {/* Add a subtle gradient overlay for style */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 rounded-full"></div>
            </div>

            {/* Restaurant Name */}
            <div className="flex flex-col">
              <span className="block md:text-2xl text-lg font-serif font-extrabold italic text-gray-300 uppercase tracking-wide">
                {user?.restaurantName || 'Food Hunter Delivery'}
              </span>
              <span className="block text-sm font-light text-gray-300 italic">
                Delivering Excellence
              </span>
            </div>
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

          {user ? (
            <button onClick={handleLogout} className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Logout
              <FaUserCircle className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ) : (
            <Link href="/login" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Login/Signup
              <TbUserQuestion className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}

          <button
            onClick={() => {
              user ? router.push('/profile') : router.push('/login');
            }}
            className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
          >
            {getProfileImage()}
          </button>
        </nav>

        {/* Mobile Hamburger Icon */}
        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
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
          )}
        </button>

      </div>

      {/* Mobile Menu */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`md:hidden overflow-hidden bg-green-800 text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-96 p-14 text-lg font-semibold flex flex-col gap-8' : 'max-h-0 p-12 py-0 text-lg font-semibold flex flex-col gap-4'}`}
      >
        <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
          <FaHome className="w-5 h-5 text-yellow-500" />
          Home
        </Link>
        <Link href="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          About
        </Link>

        {user ? (
          <button onClick={handleLogout} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <FaUserCircle className="w-5 h-5 text-yellow-500" />
            Logout
          </button>
        ) : (
          <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <TbUserQuestion className="w-5 h-5 text-yellow-500" />
            Login/Signup
          </Link>
        )}
      </div>
    </header>
  );
}
