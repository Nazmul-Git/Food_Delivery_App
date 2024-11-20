import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gradient-to-b from-orange-500 to-black text-white pt-10 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center cursor-pointer" aria-label="Go to homepage">
              <img src="#" alt="RestaurantApp Logo" className="h-12 w-12 mr-3 rounded-full bg-white" />
              <span className="text-3xl font-bold tracking-wide">RestaurantApp</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300 max-w-xs text-center md:text-left">
              Your ultimate destination for delicious meals from top restaurants, delivered right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-orange-300">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-orange-300">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-6 justify-center md:justify-start">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-orange-300" aria-label="Facebook">
                <FaFacebook size={28} />
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-orange-300" aria-label="Instagram">
                <FaInstagram size={28} />
              </Link>
              <Link href="https://twitter.com" className="text-gray-300 hover:text-orange-300" aria-label="Twitter">
                <FaTwitter size={28} />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center md:text-left">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <p className="text-gray-300 mt-2">Email: support@restaurantapp.com</p>
          <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-300">
            &copy; {currentYear || 'Loading...'} RestaurantApp. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
