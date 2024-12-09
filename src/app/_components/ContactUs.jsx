'use client'
import React, { useState } from 'react';

export default function ContactUs() {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFeedback('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFeedback('Thank you for reaching out! We’ll get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form
            } else {
                setFeedback('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            setFeedback('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 text-center max-w-md mb-10">
                Have any questions, feedback, or concerns? We’re here to help! Fill out the form below, and we’ll get back to you as soon as possible.
            </p>
            {/* Contact Section */}
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Get in Touch</h3>
                        <p className="text-gray-600 mt-2">Feel free to reach out through any of the following methods:</p>
                        <ul className="mt-4 text-gray-700 space-y-3">
                            <li>
                                📞 <span className="font-medium">Phone:</span> +123 456 7890
                            </li>
                            <li>
                                ✉️ <span className="font-medium">Email:</span> support@fooddelivery.com
                            </li>
                            <li>
                                📍 <span className="font-medium">Address:</span> 123 Food Street, Flavor Town, USA
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">Our Hours</h3>
                        <p className="text-gray-600 mt-2">We’re here to assist you during the following hours:</p>
                        <ul className="mt-4 text-gray-700 space-y-3">
                            <li>🕒 <span className="font-medium">Monday - Friday:</span> 9:00 AM - 10:00 PM</li>
                            <li>🕒 <span className="font-medium">Saturday - Sunday:</span> 10:00 AM - 11:00 PM</li>
                        </ul>
                    </div>
                </div>
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Form</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-gray-700 font-medium mb-2">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-gray-700 font-medium mb-2">
                                Your Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <label htmlFor="subject" className="text-gray-700 font-medium mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Enter subject"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col sm:col-span-2">
                            <label htmlFor="message" className="text-gray-700 font-medium mb-2">
                                Your Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Write your message here"
                                required
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            ></textarea>
                        </div>
                        <div className="sm:col-span-2 text-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-3 font-semibold rounded-lg focus:outline-none focus:ring-4 ${isSubmitting
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-300'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                    {feedback && (
                        <p className="mt-4 text-center text-lg font-medium text-gray-800">{feedback}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
