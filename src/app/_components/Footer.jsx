import React from 'react';
import Link from 'next/link'; 

export default function Footer() {
  return (
    <footer className="bg-indigo-600 text-white pt-10 pb-6">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Logo and About Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Logo" className="h-10 mr-2" />
              <span className="text-2xl font-semibold">RestaurantApp</span>
            </Link>
            <p className="mt-4 text-sm text-gray-300 max-w-xs text-center md:text-left">
              The best place to order delicious food from your favorite restaurants. Delivered to your doorsteps with love!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-6 justify-center md:justify-start">
              <Link href="https://facebook.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook fa-lg"></i>
              </Link>
              <Link href="https://instagram.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram fa-lg"></i>
              </Link>
              <Link href="https://twitter.com" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter fa-lg"></i>
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
            &copy; {new Date().getFullYear()} RestaurantApp. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
