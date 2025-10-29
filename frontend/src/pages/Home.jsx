import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaUtensils, FaBook, FaStore, FaArrowRight } from 'react-icons/fa';

function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <FaLeaf className="text-6xl text-primary-600 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Diet to <span className="text-primary-600">Vegan</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover delicious vegan alternatives to your favorite dishes, powered by AI.
            Find ingredients at nearby stores and start your plant-based journey today!
          </p>
          <Link
            to="/dish-input"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
          >
            <span>Get Started</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaUtensils className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              1. Enter Your Dish
            </h3>
            <p className="text-gray-600">
              Simply type in any non-vegan dish you love. Our AI will analyze it and find or generate a perfect vegan alternative.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaBook className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              2. Get Vegan Recipe
            </h3>
            <p className="text-gray-600">
              Receive a complete vegan recipe with ingredients, instructions, and nutritional information tailored to your taste.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <FaStore className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              3. Find Ingredients
            </h3>
            <p className="text-gray-600">
              Discover nearby stores where you can buy all the ingredients you need, with directions and store details.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-16 rounded-2xl">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Join the Vegan Movement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Vegan Recipes</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Community Menus</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">200+</div>
              <div className="text-primary-100">Partner Stores</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Start Your Vegan Journey?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're looking to go fully vegan or just want to add more plant-based meals to your diet, we're here to help!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/dish-input"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
          >
            Find Vegan Alternative
          </Link>
          <Link
            to="/menus"
            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition"
          >
            Browse Menus
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
