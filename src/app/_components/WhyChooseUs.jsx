'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const features = [
    {
        img: "https://thumbs.dreamstime.com/z/d-render-illustration-delivery-woman-character-riding-scooter-motorcycle-large-box-online-food-order-service-289057531.jpg",
        title: "Fast Delivery",
        description: "Get your food delivered to your doorstep within minutes.",
    },
    {
        img: "https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg",
        title: "Top Restaurants",
        description: "Choose from a wide variety of cuisines from the best restaurants.",
    },
    {
        img: "https://thumbs.dreamstime.com/b/little-asian-boy-money-hand-flat-vector-illustration-rich-happy-child-holding-banknotes-cartoon-character-earnings-savings-196051551.jpg",
        title: "Affordable Prices",
        description: "Enjoy delicious food at prices that won't break the bank.",
    },
    {
        img: "https://img.freepik.com/free-vector/illustration-hygiene-concept-clean-hands_23-2148510944.jpg",
        title: "Hygienic Food",
        description: "Prepared in clean environments with the highest hygiene standards.",
    },
    {
        img: "https://img.freepik.com/free-vector/illustration-customer-review-concept_23-2148534794.jpg",
        title: "Customer Reviews",
        description: "Highly rated by thousands of happy customers.",
    },
    {
        img: "https://img.freepik.com/free-vector/loyalty-program-isometric-concept_1284-28094.jpg",
        title: "Loyalty Rewards",
        description: "Earn points on every order and redeem for exciting offers.",
    },
    {
        img: "https://img.freepik.com/free-vector/vector-isometric-illustration-secure-online-payment_107791-6517.jpg",
        title: "Secure Payments",
        description: "Safe and reliable payment options for your convenience.",
    },
    {
        img: "https://img.freepik.com/free-vector/sustainable-lifestyle-concept-illustration_114360-7578.jpg",
        title: "Eco-Friendly Packaging",
        description: "We care for the planet with sustainable packaging solutions.",
    },
    {
        img: "https://img.freepik.com/free-vector/chef-cartoon-character-design_82574-4809.jpg",
        title: "Expert Chefs",
        description: "Food prepared by experienced chefs to ensure top quality.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-12 px-6 md:py-16 md:px-12">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
                    Why Choose Us?
                </h2>
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
                    {features.map((feature, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition flex flex-col items-center text-center">
                                <img
                                    src={feature.img}
                                    alt={feature.title}
                                    className="w-32 h-32 object-cover rounded-full mb-4"
                                />
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom pagination styling using Tailwind CSS */}
                <div className="custom-pagination mt-4 flex justify-center gap-2">
                    {/* Pagination dots will be automatically rendered by Swiper */}
                </div>
            </div>

            {/* Tailwind CSS for pagination dots */}
            <style jsx>{`
        .swiper-pagination {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .swiper-pagination .swiper-pagination-bullet {
            @apply w-2 h-2 rounded-full bg-gray-300 transition-all duration-300 cursor-pointer;
        }
        .swiper-pagination .swiper-pagination-bullet-active {
            @apply bg-indigo-600 scale-125;
        }
        .swiper-pagination .swiper-pagination-bullet:hover {
            @apply bg-gray-500;
        }
    `}</style>
        </section>

    );
}
