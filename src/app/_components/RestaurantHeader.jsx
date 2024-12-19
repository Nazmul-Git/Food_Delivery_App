'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '../loading';
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function RestaurantHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touchStartY, setTouchStartY] = useState(0);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const checkUser = () => {
      let restUser = localStorage.getItem('restaurantUser');
      if (!restUser && path === '/restaurants/dashboard') {
        setLoading(false);
        router.push('/restaurants');
      } else if (restUser && path === '/restaurants') {
        setLoading(false);
        router.push('/restaurants/dashboard');
      } else {
        setIsLoggedIn(JSON.parse(restUser));
        setLoading(false);
      }
    };

    checkUser();
  }, [path, router]);

  const handleLogout = () => {
    localStorage.removeItem('restaurantUser');
    setIsLoggedIn(null);
    setIsMenuOpen(false);
    router.replace('/restaurants');
  };

  const getInitials = (email) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
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

  if (loading) {
    return <Loading />;
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-black to-black shadow-lg py-1">
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
                src={isLoggedIn?.imageUrl || '/images/2.png'}
                alt="Restaurant Logo"
                className="object-cover w-full h-full"
              />
              {/* Add a subtle gradient overlay for style */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 rounded-full"></div>
            </div>

            {/* Restaurant Name */}
            <div className="flex flex-col">
              <span className="block md:text-2xl text-sm font-serif font-extrabold italic text-gray-300 uppercase tracking-wide">
                {isLoggedIn?.restaurantName || 'Food Hunter Restaurant'}
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
          {isLoggedIn && isLoggedIn.username ? (
            <>
              <button
                onClick={handleLogout}
                className="text-white font-semibold hover:text-red-700 transition flex items-center gap-2 relative group"
              >
                Logout
                <FaSignOutAlt className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <Link
                href="/profile"
                className="flex items-center gap-2 text-white font-semibold hover:text-yellow-300 transition relative group"
              >
                {/* Desktop Profile Initials */}
                {isLoggedIn.email ? (
                  <div className="w-5 h-5 rounded-full bg-gray-400 p-4 text-white flex items-center justify-center">
                    {getInitials(isLoggedIn.email)}
                  </div>
                ) : (
                  <FaUser className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}

              </Link>


            </>
          ) : (
            <Link
              href="/restaurants"
              className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group"
            >
              Login/Sign Up
              <FaUser className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}
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
        className={`md:hidden overflow-hidden bg-black text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-96 p-12 text-lg font-semibold flex flex-col gap-4' : 'max-h-0 p-12 py-0 text-lg font-semibold flex flex-col gap-4'
          }`}
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
        {isLoggedIn && isLoggedIn.username ? (
          <>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="block w-full text-left text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
            >
              <FaSignOutAlt className="w-5 h-5  text-red-700" />
              Logout
            </button>
            <Link
              href="/profile"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
            >
              {/* Mobile Profile Initials */}

              {isLoggedIn.email ? (
                <div className="w-6 h-6 rounded-full bg-gray-400 p-4 text-white flex items-center justify-center">
                  {getInitials(isLoggedIn.email)}
                </div>
              ) : (
                <FaUser className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </Link>
          </>
        ) : (
          <Link
            href="/restaurants"
            onClick={() => setIsMenuOpen(false)}
            className="block text-lg hover:text-yellow-300 transition flex items-center relative group"
          >
            <FaUser className="w-5 h-5 mr-2 text-yellow-500" />
            Login/Sign Up
          </Link>
        )}
      </div>
    </header>
  );
}
