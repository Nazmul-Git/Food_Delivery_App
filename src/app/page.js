'use client';

import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-indigo-600 text-white py-12 px-6 md:py-20 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Delicious Food, Delivered to Your Doorstep
            </h1>
            <p className="text-lg mb-6">
              Savor the taste of your favorite meals from top restaurants, delivered fresh and fast. 
            </p>
            <div className="space-x-4">
              <Link href='#' className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-100 transition">
                Order Now
              </Link>
              <Link href='/restaurants' className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-100 transition">
                Become a seller
              </Link>
              <button className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://via.placeholder.com/500x300"
              alt="Delicious food"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 md:py-16 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-8">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/80"
                alt="Fast Delivery"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered to your doorstep within minutes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/80"
                alt="Top Restaurants"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Top Restaurants</h3>
              <p className="text-gray-600">
                Choose from a wide variety of cuisines from the best restaurants.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src="https://via.placeholder.com/80"
                alt="Affordable Prices"
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Affordable Prices</h3>
              <p className="text-gray-600">
                Enjoy delicious food at prices that won't break the bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories Section */}
      <section className="py-12 px-6 md:py-16 md:px-12 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Browse Food Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {["Pizza", "Burger", "Sushi", "Desserts", "Drinks", "Salads"].map(
              (category, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src="https://via.placeholder.com/200x150"
                    alt={category}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <p className="text-white text-lg font-bold">{category}</p>
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
