'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserCircle } from 'react-icons/fa';
import { TbUserQuestion } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { IoMdHelpCircle } from 'react-icons/io';
import { GoGoal } from 'react-icons/go';
import { GrContact } from 'react-icons/gr';

export default function CommonHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deliveryUserStorage = JSON.parse(localStorage.getItem('deliveryUser'));
      setUser(deliveryUserStorage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('deliveryUser');
    setUser(null);
    setUserMenuOpen(false);
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
          <Link href="/contact" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
            Contact
            <GrContact className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          {/* User Profile and Logout */}
          {user ? (
            <div
              className="relative flex items-center gap-2"
              ref={profileIconRef}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer">
                {
                  getProfileImage(user?.email)
                }
              </div>

              {/* Show user menu if hovered or clicked */}
              {(isHovered || userMenuOpen) && (
                <div
                  ref={userMenuRef}
                  className="absolute top-16 right-0 bg-gradient-to-br from-teal-100 via-white to-teal-50 shadow-lg rounded-md py-4 w-60 border border-teal-200"
                >
                  {/* Profile Link */}
                  <Link
                    href="/profile"
                    className="block px-6 py-3 flex items-center space-x-2  hover:text-teal-600 transition-all duration-300 ease-in-out"
                  >
                    <TfiUser className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-sm">Profile</span>
                  </Link>

                  {/* Our Mission Link */}
                  <Link
                    href="/our-mission"
                    className="block px-6 py-3 flex items-center space-x-2  hover:text-teal-600 transition-all duration-300 ease-in-out"
                  >
                    <GoGoal className="w-5 h-5 text-teal-600" />
                    <span className="font-semibold text-sm">Our Mission</span>
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    className="block px-6 py-3 flex items-center space-x-2  hover:text-red-700 transition-all duration-300 ease-in-out"
                  >
                    <VscSignOut className="w-5 h-5 text-red-700 inline-block" />
                    <span className="font-semibold text-sm">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="relative flex items-center gap-2"
              ref={profileIconRef}
              onClick={() => setUserMenuOpen((prev) => !prev)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer">
                <IoMdHelpCircle className="w-6 h-6 text-yellow-500" />
              </div>

              {/* Show user menu if hovered or clicked */}
              {(isHovered || userMenuOpen) && (
                <div ref={userMenuRef} className="absolute top-12 right-0 bg-gradient-to-br from-teal-100 via-white to-teal-50 shadow-lg rounded-md py-4 w-60 border border-teal-200">
                  <Link
                    href="/"
                    className="block px-4 py-2 hover:text-blue-500 transition"
                  >
                    <div className='flex gap-2 items-center font-semibold'>
                      <FaSignInAlt className="w-5 h-5 text-teal-600" />
                      Sign In
                    </div>
                  </Link>
                  <Link
                    href="/our-mission"
                    className="block px-4 py-2 hover:text-blue-500 transition"
                  >
                    <div className='flex gap-2 items-center font-semibold'>
                      <GoGoal className="w-5 h-5 text-teal-600" />
                      Our Mission
                    </div>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

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
        className="md:hidden overflow-hidden bg-gradient-to-b from-black via-black to-teal-900 text-white px-6 shadow-lg"
        style={{ perspective: '1000px' }} // Adding perspective for 3D effect
      >
        <div
          className={`w-full h-full transform ${isMenuOpen ? 'rotate-y-0' : '-rotate-y-180'} transition-all duration-1000 ease-in-out`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className="w-full h-full transform rotate-y-180 backface-hidden" // Rotate the inner content for the book page effect
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

            {user ? (
              <button
                onClick={handleLogout}
                className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
              >
                <FaUserCircle className="w-5 h-5 text-yellow-500" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
              >
                <TbUserQuestion className="w-5 h-5 text-yellow-500" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
