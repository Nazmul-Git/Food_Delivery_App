'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaHome, FaInfoCircle, FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { TfiUser } from "react-icons/tfi";
import { SiSimplelogin } from "react-icons/si";
import { GoGoal } from "react-icons/go";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { VscSignOut } from "react-icons/vsc";
import { TbUserQuestion } from "react-icons/tb";
import { MdForwardToInbox } from "react-icons/md";
import CartModal from './CartModal';
import { useRouter } from 'next/navigation';
import { getSession, signOut } from 'next-auth/react';
import { FaBlog } from 'react-icons/fa6';
import { toast, ToastContainer } from 'react-toastify';


export default function CustomerHeader({ cartData }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keepProf, setKeepProf] = useState({});
  const [touchStartY, setTouchStartY] = useState(0);
  const [isHomeActive, setHomeActive] = useState(false);
  const [isAboutActive, setAboutActive] = useState(false);
  const [isBlogActive, setBlogActive] = useState(false);
  const [isContactActive, setContactActive] = useState(false);
  const [isCartActive, setCartActive] = useState(false);
  const router = useRouter();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch session data
      const currentSession = await getSession();
      // console.log('currentSession', currentSession); 

      setSession(currentSession?.user);

      // Handle user and cart data from localStorage
      if (typeof window !== 'undefined') {
        const userStorage = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('authUser'));
        setUser(userStorage);

        const cartStorage = localStorage.getItem('cart');
        if (cartStorage) {
          const parsedCart = JSON.parse(cartStorage);
          setCartItems(parsedCart);
          setCartCount(parsedCart.length);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Retrieve active state from localStorage on page load
    const activeStates = JSON.parse(localStorage.getItem('menuStates')) || {};
    setHomeActive(activeStates.home || false);
    setAboutActive(activeStates.about || false);
    setBlogActive(activeStates.blog || false);
    setContactActive(activeStates.contact || false);
    setCartActive(activeStates.cart || false);
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
          } else {
            toast.warning('Item is already in the cart!');
          }
        }
      } else {
        initialCartDataSet();
      }
    }
  }, [cartData]);

  const handleLogout = () => {
    if (session) {
      localStorage.removeItem('authUser');
      signOut({
        callbackUrl: '/user',
      });
      toast.success('Successfully signed out!');
    }
    else if (user) {
      localStorage.removeItem('user');
      setUser(null);
      router.push('/user');
      toast.success('Successfully logged out!');
    }
    else {
      toast.error('No user found!');
    }
  };

  // console.log(session);

  // Fallback profile image or initials (first letter of email)
  const getProfileImage = () => {
    // Check if user or session is available and has an email
    const userEmail = user?.email || session?.email;
    const imageUrl = user?.image || session?.image;
    // console.log(imageUrl)

    if (userEmail) {
      // Extract initials from the email (first letter of the email for simplicity)
      const initials = userEmail.charAt(0).toUpperCase();

      // Check if the user has an image
      if (imageUrl) {
        return (
          <img
            src={imageUrl}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        );
      } else {
        // If no image, render the initials in a default circle
        return (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-semibold">
            {initials}
          </div>
        );
      }
    }

    // Fallback if no user or session email exists
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

  const handleMenuClick = (item) => {
    // Reset all states and activate the clicked menu
    const newStates = {
      home: item === 'home',
      about: item === 'about',
      blog: item === 'blog',
      contact: item === 'contact',
      cart: item === 'cart',
    };

    setHomeActive(newStates.home);
    setAboutActive(newStates.about);
    setBlogActive(newStates.blog);
    setContactActive(newStates.contact);
    setCartActive(newStates.cart);

    // Save states to localStorage
    localStorage.setItem('menuStates', JSON.stringify(newStates));
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
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-1 border-black group">
              <img
                src={user?.imageUrl || 'https://cdn1.vectorstock.com/i/1000x1000/71/30/black-fast-delivery-icon-vector-9417130.jpg'}
                alt="Restaurant Logo"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
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
            onClick={() => handleMenuClick('home')}
            href="/" className="text-white font-semibold hover:text-teal-300 transition flex items-center gap-2 relative group">
            Home
            <FaHome className="opacity-0 w-5 h-5 mr-2 mb-6 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            onClick={() => handleMenuClick('about')}
            href="/about" className={`${isAboutActive ? 'text-teal-300' : 'text-white'} font-semibold hover:text-teal-300 transition flex items-center gap-2 relative group`}>
            About
            <FaInfoCircle className={`${isAboutActive ? 'opacity-100': 'opacity-0'} w-5 h-5 mr-2 mb-6 group-hover:opacity-100 transition-opacity duration-300"`} />
          </Link>
          <Link
            onClick={() => handleMenuClick('blog')}
            href="/blog" className={`${isBlogActive ? 'text-teal-300' : 'text-white'} font-semibold hover:text-teal-300 transition flex items-center gap-2 relative group`}>
            Blog
            <FaBlog className={`${isBlogActive ? 'opacity-100': 'opacity-0'} w-5 h-5 mr-2 mb-6 group-hover:opacity-100 transition-opacity duration-300`} />
          </Link>
          <Link
            onClick={() => handleMenuClick('contact')}
            href="/contact" className={`${isContactActive ? 'text-teal-300' : 'text-white'} font-semibold hover:text-teal-300 transition flex items-center gap-2 relative group`}>
            Contact
            <MdForwardToInbox className={`${isContactActive ? 'opacity-100': 'opacity-0'} w-5 h-5 mr-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </Link>
          <button
            onClick={() => {
              toggleModal();
              handleMenuClick('cart');
            }}
            className={`flex items-center gap-2 ${isCartActive ? 'text-teal-300' : 'text-white'} font-semibold hover:text-teal-300 transition relative group`}
          >
            Cart <p className="text-yellow-400 mb-6 text-xl font-mono font-bold">{cartCount ? cartCount : 0}</p>
            {cartCount ? (
              <HiOutlineShoppingCart className={`${isCartActive ? 'opacity-100 text-teal-300': 'text-white'} w-5 h-5 mr-2 mb-6 `} />
            ) : (
              <FaShoppingCart className={`${isCartActive ? 'opacity-100 text-teal-300': 'opacity-0'} w-5 h-5 mr-2 mb-6 group-hover:opacity-100 transition-opacity duration-300`} />
            )}
          </button>

          {/* Profile Image or Initials */}
          <div className="relative group">
            <div
              className="block text-lg hover:text-teal-300 transition flex gap-2 items-center relative cursor-pointer"
            >
              {getProfileImage()}
            </div>

            {/* Dropdown Menu */}
            {(user || session?.user) ? (
              <div className="absolute right-0 mt-4 pl-4 w-48 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <ul className="py-4">
                  <li>
                    <button
                      onClick={() => {
                        if (user || session.user) router.push('/your-profile');
                        else router.push('/user');
                      }}
                      className="text-black font-semibold hover:text-teal-600 transition flex items-center gap-2 relative group"
                    >
                      <TfiUser className="w-5 h-5 mr-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Your Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-black font-semibold hover:text-red-700 transition flex items-center gap-2 relative group"
                    >
                      <VscSignOut className="w-5 h-5 mr-2 text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) :
              <div className="absolute right-0 mt-4 pl-4 w-48 bg-white border border-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <ul className="py-4">

                  <li>
                    <button
                      onClick={() => {
                        user || session?.user
                          ? router.push('/stores')
                          : router.push('/user');
                      }}
                      className="text-black font-semibold hover:text-teal-600 transition flex items-center gap-2 relative group"
                    >
                      <SiSimplelogin className="w-5 h-5 mr-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push('/your-profile')}
                      className="text-black font-semibold hover:text-teal-600 transition flex items-center gap-2 relative group"
                    >
                      <GoGoal className="w-5 h-5 mr-2 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      Vission
                    </button>
                  </li>
                </ul>
              </div>
            }
          </div>

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
        className={`md:hidden overflow-hidden bg-gradient-to-b from-black via-black to-teal-900 text-white px-6 transform transition-all duration-1000 ${isMenuOpen ? 'max-h-96 p-14 text-lg font-semibold flex flex-col gap-4' : 'max-h-0 p-12 py-0 text-lg font-semibold flex flex-col gap-4'}`}
      >
        <Link href="/" onClick={() => {
          setIsMenuOpen(false);
          handleMenuClick('home')
        }} className={`${isHomeActive ? 'text-teal-300' : 'text-white'} font-semibold transition flex items-center gap-2 relative group`}>
          <FaHome className="w-5 h-5 text-teal-500" />
          Home
        </Link>
        <Link
          href="/about" onClick={() => {
            setIsMenuOpen(false);
            handleMenuClick('about');
          }} className={`${isAboutActive ? 'text-teal-300' : 'text-white'} font-semibold flex items-center gap-2 relative group`}>
          <FaInfoCircle className="w-5 h-5 text-teal-500" />
          About
        </Link>
        <Link
          onClick={() => handleMenuClick('contact')}
          href="/contact" className={`${isContactActive ? 'text-teal-300' : 'text-white'} font-semibold flex items-center gap-2 relative group`}>
          <MdForwardToInbox className="w-5 h-5 opacity-100 text-teal-300 transition-opacity duration-300" />
          Contact
        </Link>
        <Link
          onClick={() => handleMenuClick('blog')}
          href="/blog" className={`${isBlogActive ? 'text-teal-300' : 'text-white'} font-semibold hover:text-teal-300 transition flex items-center gap-2 relative group`}>
          <FaBlog className="w-5 h-5 text-teal-500" />
          Blog
        </Link>
        {/* Conditional Rendering for User */}
        {user || session?.user ? (
          <button onClick={handleLogout} className="block text-lg hover:text-teal-300 transition flex gap-2 items-center relative group">
            <VscSignOut className="w-5 h-5 text-teal-500" />
            Sign Out
          </button>
        ) : (
          <Link href="/user" onClick={() => setIsMenuOpen(false)} className="block text-lg hover:text-teal-300 transition flex gap-2 items-center relative group">
            <TbUserQuestion className="w-5 h-5 text-teal-500" />
            Login/Signup
          </Link>
        )}

        <button
          onClick={() => {
            toggleModal();
            handleMenuClick('cart');
          }}
          className={`block text-lg ${isCartActive ? 'text-teal-300' : 'text-white'} flex gap-2 items-center relative group`}
        >
          <HiOutlineShoppingCart className="w-5 h-5 text-teal-500" />
          Cart <p className="text-orange-600 text-2xl font-mono font-bold">{cartCount ? cartCount : 0}</p>
        </button>
        {/* Profile Image or Initials */}
        <button
          onClick={() => {
            user || session?.user ?
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        style={{ marginTop: '80px' }}
      />
    </header>
  );
}
