'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Loading from '../loading';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const checkUser = () => {
      let restUser = localStorage.getItem('restaurantUser');
      if (!restUser && path === '/restaurants/dashboard') {
        setLoading(false);
        router.push('/restaurants'); // Redirect to /restaurants if no user found
      } else if (restUser && path === '/restaurants') {
        setLoading(false);
        router.push('/restaurants/dashboard'); // Redirect to dashboard if user is already logged in
      } else {
        setIsLoggedIn(JSON.parse(restUser));
        setLoading(false);
      }
    };

    checkUser();
  }, [path, router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('restaurantUser');
    setIsLoggedIn(null); // Clear logged-in state
    setIsMenuOpen(false); // Close menu if open
    setLoading(false);
    router.replace('/restaurants'); // Use replace to prevent navigation stack issues
  };

  // Show loading spinner while waiting for data
  if (loading) {
    return <Loading />;
  }

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-md">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-bold">
          <Link href="/" className="flex items-center cursor-pointer">
            <img src="#" alt="Logo" className="h-10 w-10 mr-2 rounded-full border border-white" />
            <span className="hidden sm:block">RestaurantApp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-white hover:text-indigo-200 transition">
            Home
          </Link>
          {isLoggedIn && isLoggedIn.username ? (
            <>
              <button
                onClick={handleLogout}
                className="text-white hover:text-indigo-200 transition"
              >
                Logout
              </button>
              <Link
                href="/profile"
                className="text-white hover:text-indigo-200 transition"
              >
                Profile
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-white hover:text-indigo-200 transition">
              Login/Sign Up
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
      {isMenuOpen && (
        <div
          className="md:hidden bg-indigo-700 text-white px-6 py-4 space-y-4 transform transition-transform duration-300"
        >
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-lg hover:text-indigo-300 transition"
          >
            Home
          </Link>
          {isLoggedIn && isLoggedIn.username ? (
            <>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left text-lg hover:text-indigo-300 transition"
              >
                Logout
              </button>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg hover:text-indigo-300 transition"
              >
                Profile
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block text-lg hover:text-indigo-300 transition"
            >
              Login/Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
