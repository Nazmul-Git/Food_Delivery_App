'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(null);
  const [user, setUser] = useState();


  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setUser(JSON.parse(localStorage.getItem('restaurantUser')));
  }, []);

  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-black text-gray-300 pt-10 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="text-white text-xl font-semibold">
              <Link
                href="/"
                className="flex items-center gap-4 cursor-pointer hover:opacity-90 transition-opacity duration-300"
              >
                {/* Logo Wrapper */}
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-yellow-500 shadow-md bg-white">
                  <img
                    src={user?.imageUrl || '/images/1.png'}
                    alt="Restaurant Logo"
                    className="object-cover w-full h-full"
                  />
                  {/* Add a subtle gradient overlay for style */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 rounded-full"></div>
                </div>

                {/* Restaurant Name */}
                <div className="flex flex-col">
                  <span className="block text-2xl font-serif font-extrabold italic text-gray-300 uppercase tracking-wide">
                    {user?.restaurantName || 'Food Hunter App'}
                  </span>
                  <span className="block text-sm font-light text-gray-300 italic">
                    Delivering Excellence
                  </span>
                </div>
              </Link>
            </div>
            <p className="mt-4 text-sm max-w-xs text-center md:text-left">
              Your ultimate destination for delicious meals from top restaurants, delivered right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition text-md">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-400 transition text-md">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition text-md">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-yellow-400 transition text-md">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold text-yellow-400">Follow Us</h3>
            <div className="flex space-x-6 justify-center md:justify-start">
              <Link href="https://facebook.com" className="hover:text-blue-500 transition" aria-label="Facebook">
                <FaFacebook size={28} />
              </Link>
              <Link href="https://instagram.com" className="hover:text-pink-500 transition" aria-label="Instagram">
                <FaInstagram size={28} />
              </Link>
              <Link href="https://twitter.com" className="hover:text-blue-400 transition" aria-label="Twitter">
                <FaTwitter size={28} />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center md:text-left">
          <h3 className="text-xl font-semibold text-yellow-400">Contact Us</h3>
          <p className="mt-2">
            Email:{' '}
            <a
              href="mailto:support@restaurantapp.com"
              className="hover:text-yellow-400 transition"
            >
              support@restaurantapp.com
            </a>
          </p>
          <p>
            Phone:{' '}
            <a href="tel:+15551234567" className="hover:text-yellow-400 transition">
              +1 (555) 123-4567
            </a>
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-600 pt-4 text-center">
          <p className="text-sm">
            &copy; {currentYear || 'Loading...'}{' '}
            <span className="text-yellow-400">Food Delivery App</span>. All Rights Reserved.
          </p>
          <p className="text-xs mt-2 text-gray-500">Made with ❤️ for food lovers.</p>
        </div>

      </div>
    </footer>
  );
}
