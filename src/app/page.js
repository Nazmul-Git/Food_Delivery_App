'use client';

import Link from "next/link";
import ScrollToTop from "./_components/ScrollToTop";
import WhyChooseUs from "./_components/WhyChooseUs";

export default function Home() {

  const categories = [
    { category: "Pizza", imageUrl: "https://realfood.tesco.com/media/images/1400x919-MargaritaPizza-555a4065-2573-4b41-bcf3-7193cd095d8f-0-1400x919.jpg" },
    { category: "Burger", imageUrl: "https://insanelygoodrecipes.com/wp-content/uploads/2020/02/Burger-and-Fries.jpg" },
    { category: "Sushi", imageUrl: "https://www.thespruceeats.com/thmb/IzejeJObvz4lvYpW06uwhX6iR00%3D/3680x2456/filters:fill(auto%2C1)/GettyImages-Ridofranz-1053855542-60b89644efd2470fbfb6475b175064df.jpg" },
    { category: "Desserts", imageUrl: "https://digtoknow.com/wp-content/uploads/2016/01/Dessert.jpg" },
    { category: "Drinks", imageUrl: "https://think.ing.com/uploads/hero/_w1200/250321-image-drinks-market-food-beverages.jpg" },
    { category: "Salads", imageUrl: "https://images.immediate.co.uk/production/volatile/sites/30/2014/05/Epic-summer-salad-hub-2646e6e.jpg?quality=90&resize=960%2C872" },
  ];



  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-12 px-6 md:py-20 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          {/* Text section */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Delicious Food, Delivered to Your Doorstep
            </h1>
            <p className="text-lg mb-6">
              Savor the taste of your favorite meals from top restaurants, delivered fresh and fast.
            </p>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center md:justify-start">
              <Link
                href="/stores"
                className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg hover:scale-105 transition duration-300"
              >
                Order Now
              </Link>
              <Link
                href="/restaurants"
                className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg hover:scale-105 transition duration-300"
              >
                Become a supplier
              </Link>
              <Link
                href="/dashboard"
                className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-100 hover:shadow-lg hover:scale-105 transition duration-300"
              >
                Become a distributor
              </Link>
            </div>
            <div className="my-6">
              <Link
                href="/about"
                className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 hover:shadow-lg hover:scale-105 transition duration-300"
              >
                Learn More
              </Link>
            </div>

          </div>

          {/* Image section */}
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
            <img
              src="https://img.freepik.com/premium-photo/young-beautiful-delivery-woman-isolates_1368-138592.jpg"
              alt="Delicious food"
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <ScrollToTop />

      {/* Features Section */}
      <WhyChooseUs/>

      {/* Food Categories Section */}
      <section className="py-12 px-6 md:py-16 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Browse Food Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {categories.map(
              (category, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={category.imageUrl}
                    alt={category.category}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <p className="text-white text-lg font-bold">{category.category}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-indigo-600 text-white py-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 Food Delivery App. All Rights Reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
