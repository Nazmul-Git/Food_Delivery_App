'use client';
import React from 'react';
import { motion } from 'framer-motion';
import CustomerHeader from '../_components/CustomerHeader';
import Footer from '../_components/Footer';
import ScrollToTop from '../_components/ScrollToTop';

const BlogPage = () => {
    const categories = [
        { id: 1, name: 'Recipes', imageUrl: 'https://www.youngisthan.in/wp-content/uploads/2017/10/pizza-delivery.jpg' },
        { id: 2, name: 'Delivery Stories', imageUrl: 'https://ozonetel.com/wp-content/uploads/2021/02/food-delivery-stories-min.jpg' },
        { id: 3, name: 'Restaurant Features', imageUrl: 'https://www.mobiindia.in/blog/wp-content/uploads/2017/11/features-of-restaurants-app-development.jpg' },
        { id: 4, name: 'Health Tips', imageUrl: 'https://publichealth.tulane.edu/wp-content/uploads/sites/3/2022/09/blog-restaurant-safety-1024x683.jpg' },
    ];

    const blogPosts = [
        { id: 1, title: 'Blog Title 1', imageUrl: 'https://www.uparcel.sg/static/uparceldelivery/img/block/deliveryboy.jpg', description: 'This is a short description of blog post 1.', date: '2024-12-19' },
        { id: 2, title: 'Blog Title 2', imageUrl: 'https://www.shutterstock.com/image-photo/food-delivery-concept-man-ringing-260nw-1756657538.jpg', description: 'This is a short description of blog post 2.', date: '2024-12-19' },
        { id: 3, title: 'Blog Title 3', imageUrl: 'https://img.freepik.com/premium-photo/food-delivery-man-elderly-man_493343-41639.jpg', description: 'This is a short description of blog post 3.', date: '2024-12-19' },
        { id: 4, title: 'Blog Title 4', imageUrl: 'https://foundersguide.com/wp-content/uploads/2019/09/delivery.jpg', description: 'This is a short description of blog post 4.', date: '2024-12-19' },
        { id: 5, title: 'Blog Title 5', imageUrl: 'https://image.shutterstock.com/image-photo/delivery-girl-delivers-bags-food-260nw-2063590508.jpg', description: 'This is a short description of blog post 5.', date: '2024-12-19' },
        { id: 6, title: 'Blog Title 6', imageUrl: 'https://assets.brandinside.asia/uploads/2019/07/Takeaway-com-delivery-girl-company-1-pix.jpg', description: 'This is a short description of blog post 6.', date: '2024-12-19' },
    ];

    const authors = [
        { id: 1, name: 'Author 1', imageUrl: 'https://c.tadst.com/gfx/750x500/authors-day-fun.jpg', bio: 'A passionate food enthusiast sharing their love for all things culinary.' },
        { id: 2, name: 'Author 2', imageUrl: 'https://i-d-images.vice.com/images/2016/06/15/5-young-female-writers-whose-books-you-need-to-read-now-body-image-1466028774.jpg', bio: 'A passionate food enthusiast sharing their love for all things culinary.' },
        { id: 3, name: 'Author 3', imageUrl: 'https://i.huffpost.com/gadgets/slideshows/306562/slide_306562_2651832_free.jpg', bio: 'A passionate food enthusiast sharing their love for all things culinary.' },
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="blog-page"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.3 }}
        >
            <CustomerHeader />

            {/* Featured Blog Section */}
            <motion.section
                className="featured-blog my-20 px-10"
                variants={fadeInUp}
                transition={{ duration: 0.8 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <motion.img
                        src="https://www.cerebruminfotech.com/blog/wp-content/uploads/2020/11/Food-Delivery-App.png"
                        alt="Featured Blog"
                        className="w-full rounded-lg shadow-md"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.div>
                        <motion.h3 className="text-3xl font-bold mb-4"
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            The Secret Recipe to Perfect Pasta
                        </motion.h3>
                        <motion.p
                            className="text-gray-600 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            Learn the art of creating pasta dishes that are nothing short of perfection. From classic recipes to unique twists, this guide has it all!
                        </motion.p>
                        <motion.button
                            className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600"
                            whileHover={{ scale: 1.1 }}
                        >
                            Read More
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>

            <ScrollToTop />

            {/* Blog Categories Section */}
            <motion.section
                className="categories-section bg-gray-100 py-16 px-10"
                id="categories"
                variants={fadeInUp}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.h3
                    className="text-3xl font-bold text-center mb-10 "
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >Explore Blog Categories</motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            className="category-card text-center bg-white p-6 rounded shadow hover:shadow-lg transition"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-40 object-cover rounded mb-4"
                            />
                            <h4 className="text-xl font-bold">{category.name}</h4>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Blog Grid Section */}
            <motion.section
                className="blog-grid py-16 px-10"
                variants={fadeInUp}
                transition={{ duration: 0.8 }}
            >
                <motion.h3
                    className="text-3xl font-bold text-center mb-10"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >Latest Blog Posts</motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map((blog) => (
                        <motion.div
                            key={blog.id}
                            className="blog-card bg-white p-4 rounded shadow hover:shadow-lg transition"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={blog.imageUrl}
                                alt={`Blog Post ${blog.id}`}
                                className="w-full h-40 object-cover rounded mb-4 hover:scale-105 transition-transform"
                            />
                            <h4 className="text-xl font-bold mb-2">{blog.title}</h4>
                            <p className="text-gray-600 mb-4">{blog.description}</p>
                            <span className="text-sm text-gray-400">Date: {blog.date}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Subscription Section */}
            <motion.section
                className="subscription-section py-16 px-10 bg-red-500 text-white"
                variants={fadeInUp}
            >
                <h3 className="text-3xl font-bold text-center mb-6">Subscribe to Our Newsletter</h3>
                <p className="text-center mb-6">Stay updated with the latest posts and exclusive content.</p>
                <motion.form
                    className="flex justify-center"
                    whileHover={{ scale: 1.02 }}
                >
                    <input type="email" placeholder="Enter your email" className="p-2 rounded-l w-80" />
                    <button className="bg-white text-red-500 px-6 rounded-r">Subscribe</button>
                </motion.form>
            </motion.section>
            <Footer />
        </motion.div>
    );
};

export default BlogPage;
