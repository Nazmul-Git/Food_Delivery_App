'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaSignInAlt, FaUserCircle } from 'react-icons/fa';
import { FcServices } from "react-icons/fc";
import { TbUserQuestion } from "react-icons/tb";
import { useRouter } from 'next/navigation';
import { IoMdHelpCircle } from 'react-icons/io';
import { GoGoal } from 'react-icons/go';
import { GrContact } from 'react-icons/gr';
import { TfiUser } from 'react-icons/tfi';
import { VscSignOut } from 'react-icons/vsc';
import { MdDashboardCustomize, MdWorkspacePremium } from 'react-icons/md';

export default function DeliveryUserHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHomeActive, setHomeActive] = useState(false);
  const [isAboutActive, setAboutActive] = useState(false);
  const [isServicesActive, setServicesActive] = useState(false);
  const [isCareerActive, setCareerActive] = useState(false);
  const [isContactActive, setContactActive] = useState(false);
  const [isProfileActive, setProfileActive] = useState(false);
  const [isLogoutActive, setLogoutActive] = useState(false);
  const [isSignInActive, setSignInActive] = useState(false);
  const [isMissionActive, setMissionActive] = useState(false);
  const [isDashboardActive, setDashboardActive] = useState(false);

  const router = useRouter();
  const userMenuRef = useRef(null);
  const profileIconRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deliveryUserStorage = JSON.parse(localStorage.getItem('deliveryUser'));
      setUser(deliveryUserStorage);
    }
  }, []);

  useEffect(() => {
    // Retrieve active state from localStorage on page load
    const activeStates = JSON.parse(localStorage.getItem('menuStates')) || {};
    setHomeActive(activeStates.home || false);
    setAboutActive(activeStates.about || false);
    setServicesActive(activeStates.services || false);
    setCareerActive(activeStates.career || false);
    setContactActive(activeStates.contact || false);
    setProfileActive(activeStates.profile || false);
    setLogoutActive(activeStates.logout || false);
    setSignInActive(activeStates.signin || false);
    setMissionActive(activeStates.mission || false);
    setDashboardActive(activeStates.dashboard || false);
  }, []);

  const handleMenuClick = (item) => {
    //  Check if the clicked item is already active
    if (
      (item === 'home' && isHomeActive) ||
      (item === 'about' && isAboutActive) ||
      (item === 'services' && isServicesActive) ||
      (item === 'career' && isCareerActive) ||
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
      career: item === 'career',
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
    setCareerActive(newStates.career);
    setContactActive(newStates.contact);
    setProfileActive(newStates.profile);
    setLogoutActive(newStates.logout);
    setSignInActive(newStates.signin);
    setMissionActive(newStates.mission);
    setDashboardActive(newStates.dashboard);

    // Save states to localStorage
    localStorage.setItem('menuStates', JSON.stringify(newStates));
  };

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
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-400 text-white font-semibold">
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
          {/* Home Link */}
          <Link
            href="/"
            onClick={() => handleMenuClick('home')}
            className={`${isHomeActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}
          >
            Home
            <FaHome className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* About Link */}
          <Link
            href="/about-us"
            onClick={() => handleMenuClick('about')}
            className={`${isAboutActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}
          >
            About
            <FaHome className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Services Link */}
          <Link
            href="/services"
            onClick={() => handleMenuClick('services')}
            className={`${isServicesActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}
          >
            Services
            <FcServices className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Career Link */}
          <Link
            href="/career"
            onClick={() => handleMenuClick('career')}
            className={`${isCareerActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}
          >
            Career
            <MdWorkspacePremium className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Contact Link */}
          <Link
            href="/contact-us"
            onClick={() => handleMenuClick('contact')}
            className={`${isContactActive ? 'text-yellow-400' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}
          >
            Contact
            <GrContact className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* User Profile and Logout */}
          {user ? (
            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-semibold flex items-center justify-center cursor-pointer">
                {getProfileImage(user?.fullName)}
              </div>

              {/* Profile Dropdown Menu */}
              <div
                className="absolute top-12 right-0 w-60 bg-black shadow-lg rounded-md py-4 border z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Link
                  href="/profile"
                  onClick={() => handleMenuClick('profile')}
                  className={`${isProfileActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 hover:text-yellow-400 transition-all duration-300 ease-in-out`}
                >
                  <TfiUser className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-sm">Profile</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => handleMenuClick('dashboard')}
                  className={`${isDashboardActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 hover:text-yellow-400 transition-all duration-300 ease-in-out`}
                >
                  <MdDashboardCustomize className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-sm">Dashboard</span>
                </Link>
                <Link
                  href="/our-mission"
                  onClick={() => handleMenuClick('mission')}
                  className={`${isMissionActive ? 'text-yellow-400' : 'text-white'} block px-6 py-3 flex items-center space-x-2 hover:text-yellow-400 transition-all duration-300 ease-in-out`}
                >
                  <GoGoal className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-sm">Our Mission</span>
                </Link>
                <button
                  onClick={() => {
                    handleMenuClick('logout');
                    handleLogout();
                  }}
                  className={`${isLogoutActive ? 'text-red-700' : 'text-white'} block px-6 py-3 flex items-center space-x-2 hover:text-red-700 transition-all duration-300 ease-in-out`}
                >
                  <VscSignOut className="w-5 h-5 text-red-700 inline-block" />
                  <span className="font-semibold text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer">
                <IoMdHelpCircle className="w-6 h-6 text-yellow-500" />
              </div>

              {/* Guest Menu Dropdown */}
              <div
                className="absolute top-14 right-0 w-60 bg-black shadow-lg rounded-md py-4 border z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <button
                  onClick={() => {
                    handleMenuClick('signin');
                    router.push('/delivery-user');
                  }}
                  className={`${isSignInActive ? 'text-yellow-400' : 'text-white'} block px-4 py-2 hover:text-yellow-400 transition`}
                >
                  <div className="flex gap-2 items-center font-semibold">
                    <FaSignInAlt className="w-5 h-5 text-yellow-400" />
                    Sign In
                  </div>
                </button>
                <Link
                  href="/our-mission"
                  onClick={() => handleMenuClick('mission')}
                  className={`${isMissionActive ? 'text-yellow-400' : 'text-white'} block px-4 py-2 hover:text-yellow-400 transition`}
                >
                  <div className="flex gap-2 items-center font-semibold">
                    <GoGoal className="w-5 h-5 text-yellow-400" />
                    Our Mission
                  </div>
                </Link>
              </div>
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`md:hidden overflow-hidden bg-gradient-to-b from-black via-black to-teal-900 text-white px-6 transform transition-all duration-1000 shadow-lg ${isMenuOpen
          ? 'max-h-[500px] p-14 flex flex-col gap-8'
          : 'max-h-0 p-12 py-0 flex flex-col gap-4'
          }`}
      >
        <div className='flex justify-between items-center'>
          <Link
            href="/"
            onClick={() => {
              setIsMenuOpen(false);
              handleMenuClick('home');
            }}
            className={`${isHomeActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-base hover:text-yellow-300 transition flex gap-2 items-center relative group`}
          >
            <FaHome className="w-5 h-5 text-yellow-500" />
            Home
          </Link>
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center cursor-pointer">
            {getProfileImage(user?.fullName)}
          </div>
        </div>
        <Link
          href="/about-us"
          onClick={() => {
            setIsMenuOpen(false);
            handleMenuClick('about');
          }}
          className={`${isAboutActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} block text-base hover:text-yellow-300 transition flex gap-2 items-center relative group`}
        >
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          About
        </Link>
        <Link
          href="/services"
          onClick={() => handleMenuClick('services')}
          className={`${isServicesActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-yellow-300 transition flex items-center gap-2 relative group`}
        >
          <FcServices className="w-5 h-5 text-yellow-500" />
          Services
        </Link>
        <Link
          href="/career"
          onClick={() => handleMenuClick('career')}
          className={`${isCareerActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-yellow-300 transition flex items-center gap-2 relative group`}
        >
          <MdWorkspacePremium className="w-5 h-5 text-yellow-500" />
          Career
        </Link>
        <Link
          href="/contact-us"
          onClick={() => handleMenuClick('contact')}
          className={`${isContactActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-yellow-300 transition flex items-center gap-2 relative group`}
        >
          <GrContact className="w-5 h-5 text-yellow-500" />
          Contact
        </Link>
        <Link
          href="/dashboard"
          onClick={() => handleMenuClick('dashboard')}
          className={`${isDashboardActive && user ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-yellow-300 transition flex items-center gap-2 relative group`}
        >
          <MdDashboardCustomize className="w-5 h-5 text-yellow-400" />
          <span className="text-base">Dashboard</span>
        </Link>
        {user ? (
          <button
            onClick={() => {
              handleLogout();
              handleMenuClick('logout');
            }}
            className={`${isLogoutActive ? 'text-red-700 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-red-700 transition flex gap-2 items-center relative group`}
          >
            <FaUserCircle className="w-5 h-5 text-red-700" />
            Sign Out
          </button>
        ) : (
          <Link
            href="/delivery-user"
            onClick={() => {
              setIsMenuOpen(false);
              handleMenuClick('signin');
            }}
            className={`${isSignInActive ? 'text-yellow-400 bg-teal-700 px-2 py-1 rounded-md' : 'text-white'} text-base hover:text-yellow-300 transition flex gap-2 items-center relative group`}
          >
            <TbUserQuestion className="w-5 h-5 text-yellow-500" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
