'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let restUser = localStorage.getItem("restaurantUser");
    if (!restUser) return router.push('/restaurants');
    else setIsLoggedIn(JSON.parse(restUser));
  },[]);

  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-2xl font-semibold">
          <Link href="/" className="flex items-center cursor-pointer">
            <img src="#" alt="Logo" className="h-8 mr-2" />
            <span>RestaurantApp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-white hover:text-indigo-200">
            Home
          </Link>

          {
            isLoggedIn && isLoggedIn.username ?

              <Link href="/profile" className="text-white hover:text-indigo-200">
                Profile
              </Link>
              :
              <Link href="/login" className="text-white hover:text-indigo-200">
                Login/Sign Up
              </Link>
          }
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
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
        <div className="md:hidden bg-indigo-700 text-white px-4 py-3 space-y-4">
          <Link href="/" className="block">
            Home
          </Link>
          {
            isLoggedIn && isLoggedIn.username ?

              <Link href="/profile" className="text-white hover:text-indigo-200">
                Profile
              </Link>
              :
              <Link href="/login" className="text-white hover:text-indigo-200">
                Login/Sign Up
              </Link>
          }
        </div>
      )}
    </header>
  );
}
