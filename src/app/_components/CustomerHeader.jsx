'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { TbUserQuestion } from "react-icons/tb";
import { MdForwardToInbox } from "react-icons/md";
import CartModal from './CartModal';
import { useRouter } from 'next/navigation';

export default function CustomerHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keepProf, setKeepProf] = useState({});
  const [touchStartY, setTouchStartY] = useState(0);
  const [activeMenu, setActiveMenu] = useState('');
  const router = useRouter();

  // This effect will handle clearing the cart when the order is confirmed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStorage = JSON.parse(localStorage.getItem('user'));
      setUser(userStorage);

      const cartStorage = localStorage.getItem('cart');
      if (cartStorage) {
        const parsedCart = JSON.parse(cartStorage);
        setCartItems(parsedCart);
        setCartCount(parsedCart.length);
      }
    }
  }, []);

  // after complete order cart will be reset
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile?.success) {
      localStorage.removeItem('cart');
      setCartItems([]);
      setCartCount(0);
      localStorage.removeItem('profile');
      setKeepProf(profile);
    }
  }, [keepProf]);

  // Initial cart item addition
  const initialCartDataSet = () => {
    setCartCount(1);
    setCartItems([cartData]);
    localStorage.setItem('cart', JSON.stringify([cartData]));
    alert('Item added successfully');
  };

  useEffect(() => {
    if (cartData) {
      if (cartCount) {
        // Check if another restaurant's item is being added
        if (cartItems[0]?.restaurantId !== cartData.restaurantId) {
          localStorage.removeItem('cart');
          initialCartDataSet();
        } else {
          let localCartItem = cartItems;
          const itemExists = localCartItem.some(item => item._id === cartData._id);
          if (!itemExists) {
            const updatedCartItems = [...localCartItem, cartData];
            setCartItems(updatedCartItems);
            setCartCount(updatedCartItems.length);
            localStorage.setItem('cart', JSON.stringify(updatedCartItems));
            alert('Item added to cart!');
          } else {
            alert('Item is already in the cart!');
          }
        }
      } else {
        initialCartDataSet();
      }
    }
  }, [cartData]);

  // Logout functionality
  const handleLogout = () => {
    // Clear user and cart data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    // Reset state
    setUser(null);
    setCartCount(0);
    setCartItems([]);
    router.push('/user');
  };

  // Fallback profile image or initials (first letter of email)
  const getProfileImage = () => {
    console.log('user', user);
    if (user && user?.email) {
      const initials = user?.email?.charAt(0).toUpperCase();
      return (
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
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

  // Toggle the cart modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-orange-700 to-black shadow-lg py-1">
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
              <span className="block text-2xl font-serif font-extrabold italic text-gray-300 uppercase tracking-wide">
                {user?.restaurantName || 'Food Hunter'}
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
          onClick={()=>handleMenuClick('home')}
          href="/" className={`${activeMenu === 'home' ? 'text-yellow-300' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}>
            Home
            <FaHome className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
          onClick={()=>handleMenuClick('about')}
          href="/about" className={`${activeMenu === 'about' ? 'text-yellow-300' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}>
            About
            <FaInfoCircle className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
           onClick={()=>handleMenuClick('contact')}
           href="/contact" className={`${activeMenu === 'contact' ? 'text-yellow-300' : 'text-white'} font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group`}>
            Contact
            <MdForwardToInbox className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Conditional Rendering for User */}
          {user ? (
            <button onClick={handleLogout} className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Logout
              <FaUserCircle className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ) : (
            <Link href="/user" className="text-white font-semibold hover:text-yellow-300 transition flex items-center gap-2 relative group">
              Login/Signup
              <TbUserQuestion className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}

          <button
            onClick={() => {
              toggleModal();
              handleMenuClick('cart');
            }}            
            className={`flex items-center gap-2 ${activeMenu === 'cart' ? 'text-yellow-300' : 'text-white'} font-semibold hover:text-yellow-300 transition relative group`}
          >
            Cart (<p className="text-orange-600">{cartCount ? cartCount : 0}</p>)
            {cartCount ? (
              <HiOutlineShoppingCart className="w-5 h-5 mr-2 mb-6 text-white" />
            ) : (
              <FaShoppingCart className="w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>

          {/* Profile Image or Initials */}
          <button
            onClick={() => {
              user ?
                router.push('/your-profile')
                :
                router.push('/user');
            }}
            className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group"
          >
            {getProfileImage()}
          </button>

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
        className={`md:hidden overflow-hidden bg-black text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-96 p-14 text-lg font-semibold flex flex-col gap-8' : 'max-h-0 p-12 py-0 text-lg font-semibold flex flex-col gap-4'}`}
      >
        <Link href="/" onClick={() => {
          setIsMenuOpen(false);
          handleMenuClick('home')
        }} className={`${activeMenu === 'home' ? 'text-yellow-300' : 'text-white'} font-semibold transition flex items-center gap-2 relative group`}>
          <FaHome className="w-5 h-5 text-yellow-500" />
          Home
        </Link>
        <Link
         href="/about" onClick={() => {
          setIsMenuOpen(false);
          handleMenuClick('about');
         }} className={`${activeMenu === 'about' ? 'text-yellow-300' : 'text-white'} font-semibold flex items-center gap-2 relative group`}>
          <FaInfoCircle className="w-5 h-5 text-yellow-500" />
          About
        </Link>
        <Link
        onClick={()=>handleMenuClick('contact')}
        href="/contact" className={`${activeMenu === 'contact' ? 'text-yellow-300' : 'text-white'} font-semibold flex items-center gap-2 relative group`}>
          <MdForwardToInbox className="w-5 h-5 opacity-100 text-yellow-300 transition-opacity duration-300" />
          Contact
        </Link>
        {/* Conditional Rendering for User */}
        {user ? (
          <button onClick={handleLogout} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <FaUserCircle className="w-5 h-5 text-yellow-500" />
            Logout
          </button>
        ) : (
          <Link href="/user" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-yellow-300 transition flex gap-2 items-center relative group">
            <TbUserQuestion className="w-5 h-5 text-yellow-500" />
            Login/Signup
          </Link>
        )}

        <button
          onClick={()=>{
            toggleModal();
            handleMenuClick('cart');
          }}
          className={`block text-lg ${activeMenu === 'cart' ? 'text-yellow-300' : 'text-white'} flex gap-2 items-center relative group`}
        >
          <HiOutlineShoppingCart className="w-5 h-5 text-yellow-500" />
          Cart (<p className="text-orange-600">{cartCount ? cartCount : 0}</p>)
        </button>
        {/* Profile Image or Initials */}
        <button
          onClick={() => {
            user ?
              router.push('/your-profile')
              :
              router.push('/user');
          }}
          className="block text-lg transition flex gap-2 items-center relative group"
        >
          {getProfileImage()}
        </button>
      </div>

      {isModalOpen && (
        <CartModal
          cartItems={cartItems}
          onClose={toggleModal}
          setCartCount={setCartCount}
        />
      )}
    </header>
  );
}
