'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '../loading';
import Image from 'next/image';
import { FaHome, FaInfoCircle, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons from react-icons

export default function CustomerHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const path = usePathname();

  // To manage the cart, let's assume cart is stored in localStorage as well
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const checkUser = () => {
      let customerUser = localStorage.getItem('customerUser');
      if (!customerUser && path === '/customer/dashboard') {
        setLoading(false);
        router.push('/customer/login');
      } else if (customerUser && path === '/customer/login') {
        setLoading(false);
        router.push('/customer/dashboard');
      } else {
        setIsLoggedIn(JSON.parse(customerUser));
        setLoading(false);
      }
    };

    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cartItems.length);
    };

    checkUser();
    updateCartCount(); // Update cart count on initial load

  }, [path, router]);

  const handleLogout = () => {
    localStorage.removeItem('customerUser');
    setIsLoggedIn(null);
    setIsMenuOpen(false);
    router.replace('/customer/login');
  };

  // Function to extract the first letter of the user's email
  const getInitials = (email) => {
    const name = email.split('@')[0]; // Get the part before '@'
    return name.charAt(0).toUpperCase(); // Take the first letter and capitalize it
  };

  if (loading) {
    return <Loading />;
  }

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
          <Link
            href="/cart"
            className="flex items-center gap-2 text-white font-semibold hover:text-yellow-300 transition relative group"
          >
            Cart
            <FaShoppingCart className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
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
                  <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                    {getInitials(isLoggedIn.email)}
                  </div>
                ) : (
                  <FaUser className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/customer/login"
                className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group"
              >
                Login
                <FaUser className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <Link
                href="/customer/signup"
                className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group"
              >
                Sign Up
                <FaUser className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </>
          )}
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
        <Link
          href="/cart"
          onClick={() => setIsMenuOpen(false)}
          className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
        >
          Cart
          <FaShoppingCart className="w-5 h-5 text-yellow-500" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cartCount}
            </span>
          )}
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
              {isLoggedIn.email ? (
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                  {getInitials(isLoggedIn.email)}
                </div>
              ) : (
                <FaUser className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/customer/login"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg hover:text-yellow-300 transition flex items-center relative group"
            >
              Login
              <FaUser className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link
              href="/customer/signup"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg hover:text-yellow-300 transition flex items-center relative group"
            >
              Sign Up
              <FaUser className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
