'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ScrollToTop from './ScrollToTop'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Services() {
    const [isClient, setIsClient] = useState(false);
    // Dummy data for Swiper images, services, and testimonials
    // Ensures that Swiper and MapContainer only render on the client side
    useEffect(() => {
        setIsClient(true);
    }, []);

    const sliderImages = [
        '/images/delivery1.jpg',
        '/images/delivery2.jpg',
        '/images/delivery3.jpg',
        '/images/delivery1.jpg',
        '/images/delivery2.jpg',
        '/images/delivery3.jpg',
    ];

    const services = [
        {
            title: 'Fast Delivery',
            text: 'We ensure your parcels reach their destination in the shortest possible time.',
            image: 'https://jaguarind.com/wp-content/uploads/2011/12/Fast-Delivery-Jaguar-Industries.jpg',
        },
        {
            title: 'Secure Handling',
            text: 'Your items are handled with utmost care and security throughout the journey.',
            image: 'https://remood.co/wp-content/uploads/2020/04/Mjffc57GPS.jpg',
        },
        {
            title: 'Tracking & Updates',
            text: 'Track your delivery in real-time and get notified about every step.',
            image: 'https://www.transportify.com.ph/wp-content/uploads/sites/5/2021/10/logistics-apps-with-tracking-system-for-delivery-og.jpg',
        },
    ];

    const testimonials = [
        {
            name: 'John Doe',
            text: 'Fast and reliable service. Highly recommended!',
            image: 'https://www.lensmen.ie/wp-content/uploads/2015/02/Profile-Portrait-Photographer-in-Dublin-Ireland..jpg',
        },
        {
            name: 'Jane Smith',
            text: 'Great experience! My package arrived safely and on time.',
            image: 'https://purepng.com/public/uploads/large/purepng.com-manmanadult-malemale-childboy-beingmens-1421526920869cscbo.png',
        },
        {
            name: 'Michael Johnson',
            text: 'Excellent communication and prompt delivery.',
            image: 'https://petapixel.com/assets/uploads/2019/02/download-2.jpeg',
        },
    ];
    return (
        <div className="container mx-auto p-6">
            {/* Hero Section */}
            <section className="hero text-center bg-gray-100 py-12">
                <h1 className="text-4xl font-bold text-gray-800">Reliable Delivery Services at Your Doorstep</h1>
                <p className="text-xl text-gray-600 mt-4">Fast, secure, and professional delivery services for all your needs.</p>
                <Link href="#services" passHref>
                    <button className="cta-button mt-6 py-2 px-6 bg-green-500 text-white text-lg rounded-lg hover:bg-green-600 transition duration-300">
                        Get Started
                    </button>
                </Link>
            </section>

            <ScrollToTop />
            {/* Swiper Section */}
            <section className="slider-section text-center py-12">
                <h2 className="text-3xl font-semibold text-gray-800 p-8">Our Services in Action</h2>
                {isClient && (
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{
                            clickable: true,
                            el: '.custom-pagination',
                        }}
                        className="py-6"
                    >
                        {sliderImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="slider-image rounded-xl overflow-hidden shadow-lg">
                                    <img src={image} alt={`Delivery Service ${index + 1}`} className="w-full" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>

            <section id="services" className="services-section py-12 px-12 bg-gradient-to-b from-gray-50 to-gray-100">
                <h2 className="text-4xl p-4 font-bold text-center text-gray-800 mb-12">Our Premium Services</h2>
                <div className="service-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="service-card bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <div className="service-image relative h-52">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold text-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    {service.title}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="testimonials-section py-16 px-12 bg-gradient-to-b from-gray-100 to-gray-200">
                <h2 className="text-4xl p-4 font-extrabold text-center text-gray-800 mb-12">What Our Customers Say</h2>
                <div className="testimonials grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial bg-white rounded-2xl p-8 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:rotate-2"
                        >
                            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-indigo-500 mb-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-gray-600 italic text-lg leading-relaxed mb-6 font-medium">
                                &ldquo;{testimonial.text}&rdquo;
                            </p>
                            <h4 className="text-xl font-bold text-gray-800">{testimonial.name}</h4>
                            <p className="text-sm text-indigo-500 mt-2">{testimonial.position}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
