'use client'
import React from 'react';
import RestaurantHeader from '../_components/RestaurantHeader';
import Footer from '../_components/Footer';
import ScrollToTop from '../_components/ScrollToTop';

export default function about() {
    return (
        <div>
            {/*Header*/}
            <RestaurantHeader />
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-24 px-6 text-center">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold">Welcome to Foodie Haven</h1>
                    <p className="mt-4 text-lg md:text-2xl">Your favorite meals, delivered with love.</p>
                    <a href="#about-us" className="mt-6 inline-block px-6 py-3 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold shadow-lg hover:bg-yellow-500 transition">Learn More</a>
                </div>
            </section>

            <div className="bg-gray-50 min-h-screen flex flex-col items-center py-12 px-6 md:px-12">
                {/* Page Header */}
                <div className="max-w-6xl text-center mb-12" id="about-us">
                    <h1 className="text-3xl md:text-5xl font-bold text-indigo-600">About Us</h1>
                    <p className="text-gray-700 mt-4 text-lg">
                        At <span className="font-bold">Foodie Haven</span>, we connect people with their favorite meals, one bite at a time.
                    </p>
                </div>

                {/* Mission and Vision Section */}
                <section className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="p-6 bg-white rounded-lg transition">
                        <h2 className="text-xl font-semibold text-indigo-600 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To deliver happiness in every meal by partnering with top-notch restaurants and ensuring the fastest, freshest, and most reliable food delivery service.
                        </p>
                    </div>
                    <div className="p-6 bg-white rounded-lg transition">
                        <h2 className="text-xl font-semibold text-indigo-600 mb-4">Our Vision</h2>
                        <p className="text-gray-600 leading-relaxed">
                            To revolutionize the food delivery industry by becoming the most trusted, innovative, and customer-centric platform worldwide.
                        </p>
                    </div>
                </section>

                <ScrollToTop/>

                {/* Why Choose Us Section */}
                <section className="max-w-6xl text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img
                                src="https://thumbs.dreamstime.com/z/d-render-illustration-delivery-woman-character-riding-scooter-motorcycle-large-box-online-food-order-service-289057531.jpg"
                                alt="Fast Delivery"
                                className="mx-auto mb-4 w-24 h-24 object-cover"
                            />
                            <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">
                                Get your food delivered within minutes without compromising quality.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img
                                src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg"
                                alt="Top Restaurants"
                                className="mx-auto mb-4 w-24 h-24 object-cover"
                            />
                            <h3 className="text-lg font-semibold mb-2">Top Restaurants</h3>
                            <p className="text-gray-600">
                                Choose from a diverse menu curated by the best restaurants in town.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img
                                src="https://thumbs.dreamstime.com/b/little-asian-boy-money-hand-flat-vector-illustration-rich-happy-child-holding-banknotes-cartoon-character-earnings-savings-196051551.jpg"
                                alt="Affordable Prices"
                                className="mx-auto mb-4 w-24 h-24 object-cover"
                            />
                            <h3 className="text-lg font-semibold mb-2">Affordable Prices</h3>
                            <p className="text-gray-600">
                                Indulge in delicious meals without breaking the bank.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                <section className="max-w-6xl text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Our Core Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Integrity</h3>
                            <p className="text-gray-600">We believe in honesty, transparency, and trust with both our partners and customers.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Innovation</h3>
                            <p className="text-gray-600">Constantly improving and adapting to deliver the best food delivery experience.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Customer-Centric</h3>
                            <p className="text-gray-600">Your satisfaction is our priority, and we always put your needs first.</p>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="max-w-6xl text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">What Our Customers Say</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition max-w-xs">
                            <p className="text-gray-600 italic">"Foodie Haven has completely changed how I order food! Fast, reliable, and always delicious."</p>
                            <h4 className="mt-4 font-semibold text-indigo-600">Emma W.</h4>
                            <p className="text-gray-500">Frequent Customer</p>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition max-w-xs">
                            <p className="text-gray-600 italic">"I love the variety of restaurants available. There’s something for every mood!"</p>
                            <h4 className="mt-4 font-semibold text-indigo-600">James T.</h4>
                            <p className="text-gray-500">Regular User</p>
                        </div>
                    </div>
                </section>

                {/* Meet the Team Section */}
                <section className="max-w-6xl text-center mb-12">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" className="rounded-full mx-auto mb-4 w-24 h-24 object-cover" />
                            <h3 className="text-lg font-semibold">John Doe</h3>
                            <p className="text-gray-600">Founder & CEO</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" className="rounded-full mx-auto mb-4 w-24 h-24 object-cover" />
                            <h3 className="text-lg font-semibold">Jane Smith</h3>
                            <p className="text-gray-600">Head of Operations</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                            <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Team Member" className="rounded-full mx-auto mb-4 w-24 h-24 object-cover" />
                            <h3 className="text-lg font-semibold">Alex Johnson</h3>
                            <p className="text-gray-600">Lead Developer</p>
                        </div>
                    </div>
                </section>

                {/* Closing Section */}
                <div className="max-w-6xl text-center">
                    <p className="text-lg text-gray-700">
                        Thank you for choosing <span className="font-bold text-indigo-600">Foodie Haven</span> as your trusted food delivery partner. We're here to serve you better, one meal at a time.
                    </p>
                </div>
            </div>
            {/*Footer*/}
            <Footer/>
        </div>
    );
}
