'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MdDashboardCustomize } from 'react-icons/md';
import { FaHome, FaInfoCircle, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { GrContact } from 'react-icons/gr';
import { IoMdHelpCircle } from 'react-icons/io';
import { TfiUser } from 'react-icons/tfi';
import { GoGoal } from 'react-icons/go';
import { VscSignOut } from 'react-icons/vsc';
import { FaSignInAlt } from 'react-icons/fa';
import { FcServices } from 'react-icons/fc';

export default function RestaurantHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isHomeActive, setHomeActive] = useState(false);
  const [isAboutActive, setAboutActive] = useState(false);
  const [isServicesActive, setServicesActive] = useState(false);
  const [isContactActive, setContactActive] = useState(false);
  const [isProfileActive, setProfileActive] = useState(false);
  const [isLogoutActive, setLogoutActive] = useState(false);
  const [isSignInActive, setSignInActive] = useState(false);
  const [isMissionActive, setMissionActive] = useState(false);
  const [isDashboardActive, setDashboardActive] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const userMenuRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    const checkUser = () => {
      let restUser = localStorage.getItem('restaurantUser');
      if (!restUser && path === '/restaurants/dashboard') {
        router.push('/restaurants');
      } else if (restUser && path === '/restaurants') {
        router.push('/restaurants/dashboard');
      } else {
        setIsLoggedIn(JSON.parse(restUser));
      }
    };

    checkUser();
  }, [path, router]);

  useEffect(() => {
    // Retrieve active state from localStorage on page load
    const activeStates = JSON.parse(localStorage.getItem('menuStates')) || {};
    setHomeActive(activeStates.home || false);
    setAboutActive(activeStates.about || false);
    setServicesActive(activeStates.services || false);
    setContactActive(activeStates.contact || false);
    setProfileActive(activeStates.profile || false);
    setLogoutActive(activeStates.logout || false);
    setSignInActive(activeStates.signin || false);
    setMissionActive(activeStates.mission || false);
    setDashboardActive(activeStates.dashboard || false);
  }, []);

  const handleMenuClick = (item) => {
    // Check if the clicked item is already active
    if (
      (item === 'home' && isHomeActive) ||
      (item === 'about' && isAboutActive) ||
      (item === 'services' && isServicesActive) ||
      (item === 'contact' && isContactActive) ||
      (item === 'profile' && isProfileActive) ||
      (item === 'logout' && isLogoutActive) ||
      (item === 'signin' && isSignInActive) ||
      (item === 'mission' && isMissionActive) ||
      (item === 'dashboard' && isDashboardActive)
    ) {
      setIsMenuOpen(false);
      return;
    }

    // Reset all states and activate the clicked menu
    const newStates = {
      home: item === 'home',
      about: item === 'about',
      services: item === 'services',
      contact: item === 'contact',
      profile: item === 'profile',
      logout: item === 'logout',
      signin: item === 'signin',
      mission: item === 'mission',
      dashboard: item === 'dashboard',
    };

    setHomeActive(newStates.home);
    setAboutActive(newStates.about);
    setServicesActive(newStates.services);
    setContactActive(newStates.contact);
    setProfileActive(newStates.profile);
    setLogoutActive(newStates.logout);
    setSignInActive(newStates.signin);
    setMissionActive(newStates.mission);
    setDashboardActive(newStates.dashboard);

    setIsMenuOpen(false); // Optionally close the menu after a new item is clicked

    // Save states to localStorage
    localStorage.setItem('menuStates', JSON.stringify(newStates));
  };


  // Close the user menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('restaurantUser');
    setIsLoggedIn(null);
    setIsMenuOpen(false);
    setUserMenuOpen(false);
    router.replace('/restaurants');
  };

  const getInitials = (email) => {
    if (email) {
      const name = email?.split('@')[0];
      return name?.charAt(0).toUpperCase();
    } else {
      return '?'
    }
  };

  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    if (touchStartY - currentY > 50) {
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
          <Link
            href="/"
            onClick={() => handleMenuClick('home')}
            className={`${isHomeActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group text-base`}
          >
            Home
            <FaHome className="w-5 h-5 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/solutions"
            onClick={() => handleMenuClick('services')}
            className={`${isServicesActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group text-base`}
          >
            Solutions
            <FcServices className="w-5 h-5 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/faq"
            onClick={() => handleMenuClick('about')}
            className={`${isAboutActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group text-base`}
          >
            FAQ
            <FaInfoCircle className="w-5 h-5 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/contacts"
            onClick={() => handleMenuClick('contact')}
            className={`${isContactActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group text-base`}
          >
            Contact
            <GrContact className="w-5 h-5 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* User Profile and Logout */}
          <div className="relative group">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center cursor-pointer">
              {getInitials(isLoggedIn?.email)}
            </div>

            {/* Profile menu for logged in user */}
            {isLoggedIn && isLoggedIn.username ? (
              <div className="absolute right-0 mt-4 pl-4 w-28 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <div className="absolute top-3 right-0 bg-black shadow-lg rounded-md py-4 w-60 border z-50">
                  <Link
                    href="/profile"
                    onClick={() => handleMenuClick('profile')}
                    className={`${isProfileActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 text-base hover:text-yellow-400 transition`}
                  >
                    <TfiUser className="w-5 h-5 text-yellow-400" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/restaurants/dashboard"
                    onClick={() => handleMenuClick('dashboard')}
                    className={`${isDashboardActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 text-base hover:text-yellow-400 transition`}
                  >
                    <MdDashboardCustomize className="w-5 h-5 text-yellow-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/our-mission"
                    onClick={() => handleMenuClick('mission')}
                    className={`${isMissionActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 text-base hover:text-yellow-400 transition`}
                  >
                    <GoGoal className="w-5 h-5 text-yellow-400" />
                    <span>Our Mission</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleMenuClick('logout');
                      handleLogout();
                    }}
                    className={`${isLogoutActive ? 'text-red-700' : 'text-white'} block px-6 py-3 flex items-center space-x-2 text-base hover:text-red-700 transition`}
                  >
                    <VscSignOut className="w-5 h-5 text-red-700" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              // Profile menu for non-logged in user
              <div className="absolute right-0 pl-4 w-28 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <div
                  ref={userMenuRef}
                  className="absolute top-6 right-0 bg-black shadow-lg rounded-md py-4 w-60 border z-50"
                >
                  <Link
                    href="/restaurants"
                    onClick={() => {
                      handleMenuClick('signin');
                      router.push('/delivery-user');
                    }}
                    className={`${isSignInActive ? 'text-yellow-400' : 'text-white'} block px-4 py-2 text-base hover:text-yellow-400 transition`}
                  >
                    <div className="flex gap-2 items-center">
                      <FaSignInAlt className="w-5 h-5 text-yellow-400" />
                      <span>Sign In</span>
                    </div>
                  </Link>
                  <Link
                    href="/our-mission"
                    onClick={() => handleMenuClick('mission')}
                    className={`${isMissionActive ? 'text-yellow-400' : 'text-white'} block px-4 py-2 text-base hover:text-yellow-400 transition`}
                  >
                    <div className="flex gap-2 items-center">
                      <GoGoal className="w-5 h-5 text-yellow-400" />
                      <span>Our Mission</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

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
        className={`md:hidden overflow-hidden bg-gradient-to-b from-black via-black to-teal-900 text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-[500px] p-12 text-sm font-semibold flex flex-col gap-6' : 'max-h-0 py-0 text-sm font-semibold flex flex-col gap-6'}`}
      >
        <Link
          href="/"
          onClick={() => {
            setIsMenuOpen(false);
            handleMenuClick('home');
          }}
          className={`${isHomeActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
        >
          <FaHome className="w-5 h-5 text-yellow-500" />
          Home
        </Link>
        <Link
          href="/solutions"
          onClick={() => handleMenuClick('services')}
          className={`${isServicesActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
        >
          <FcServices className="w-5 h-5 text-yellow-500" />
          Services
        </Link>
        <Link
          href="/faq"
          onClick={() => {
            setIsMenuOpen(false);
            handleMenuClick('about');
          }}
          className={`${isAboutActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg `}
        >
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          FAQ
        </Link>
        <Link
          href="/restaurants/dashboard"
          onClick={() => handleMenuClick('dashboard')}
          className={`${isDashboardActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
        >
          <MdDashboardCustomize className="w-5 h-5 text-yellow-500" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/our-mission"
          onClick={() => handleMenuClick('mission')}
          className={`${isMissionActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
        >
          <GoGoal className="w-5 h-5 text-yellow-500" />
          <span>Our Mission</span>
        </Link>
        <Link
          href="/contacts"
          onClick={() => handleMenuClick('contact')}
          className={`${isContactActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg `}
        >
          <GrContact className="w-5 h-5 text-yellow-500" />
          Contact
        </Link>

        {isLoggedIn && isLoggedIn.email ? (
          <>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleMenuClick('logout');
                handleLogout();
              }}
              className={`${isLogoutActive ? 'text-red-700 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block w-full text-left text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
            >
              <FaSignOutAlt className="w-5 h-5 text-red-700" />
              Sign Out
            </button>
            <Link
              href="/profile"
              onClick={() => {
                handleMenuClick('profile');
              }}
              className={`${isLogoutActive ? 'text-red-700 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-sm hover:text-red-700 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
            >
              {isLoggedIn.email ? (
                <div className="w-6 h-6 rounded-full bg-blue-600 p-3 text-white flex items-center justify-center shadow-lg">
                  {getInitials(isLoggedIn.email)}
                </div>
              ) : (
                <FaUser className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              Profile
            </Link>
          </>
        ) : (
          <Link
            href="/restaurants"
            onClick={() => {
              setIsMenuOpen(false);
              handleMenuClick('signin')
            }}
            className={`${isSignInActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-sm hover:text-yellow-300 transition-all duration-300 flex items-center gap-4 relative group py-2 px-4 rounded-lg`}
          >
            <FaUser className="w-5 h-5 mr-2 text-yellow-500" />
            Sign In
          </Link>
        )}
      </div>


    </header>
  );
}
