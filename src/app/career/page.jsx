'use client';

import Image from 'next/image';
import Link from 'next/link';
import DeliveryUserHeader from '../_components/DeliveryUserHeader';
import Footer from '../_components/Footer';

const DeliveryCareerPage = () => {
    return (
        <div>
            <DeliveryUserHeader />
            {/* Hero Section */}
            <section className="bg-blue-500 text-white py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl font-bold">Join Our Delivery Team</h1>
                    <p className="mt-4 text-lg">Empower your career with opportunities in a dynamic and growing field.</p>
                    <Link
                        href="/apply"
                        className="inline-block mt-6 px-8 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-200"
                    >
                        Apply Now
                    </Link>
                </div>
            </section>

            {/* About the Role */}
            <section className="py-16 px-4 bg-gray-100">
                <div className="container mx-auto grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-3xl font-semibold text-blue-500">Why Join Us?</h2>
                        <p className="mt-4 text-lg text-gray-700">
                            Our delivery team members are the backbone of our operations. You'll enjoy flexible hours, competitive pay, and a supportive environment.
                        </p>
                        <ul className="mt-6 space-y-4 text-gray-700">
                            <li>🚀 Fast-track career growth opportunities</li>
                            <li>🕒 Flexible working hours</li>
                            <li>🎁 Exclusive employee benefits and rewards</li>
                            <li>📚 Comprehensive training and support</li>
                        </ul>
                    </div>
                    <div className="flex justify-center items-center">
                        <Image
                            src="/images/career.jpg"
                            alt="Delivery Person"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 px-4">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-blue-500">What Our Team Says</h2>
                    <div className="grid md:grid-cols-3 gap-8 mt-8">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-gray-700">
                                "Working here has been an incredible experience. The team is supportive, and the benefits are amazing!"
                            </p>
                            <p className="mt-4 text-blue-500 font-semibold">- Alex, Delivery Partner</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-gray-700">
                                "I love the flexibility and opportunities for growth. It's more than just a job!"
                            </p>
                            <p className="mt-4 text-blue-500 font-semibold">- Maria, Senior Delivery Partner</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <p className="text-lg text-gray-700">
                                "The training and support have made me confident in my role. Highly recommend joining!"
                            </p>
                            <p className="mt-4 text-blue-500 font-semibold">- John, Delivery Specialist</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-blue-500 text-white text-center">
                <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
                <p className="mt-4 text-lg">Take the first step towards a rewarding career.</p>
                <Link
                    href="/apply"
                    className="inline-block mt-6 px-8 py-3 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-200"
                >
                    Apply Now
                </Link>
            </section>
            <Footer />
        </div>
    );
};

export default DeliveryCareerPage;
