import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaUtensils, FaBook, FaStore, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import Testimonials from '../components/Testimonials';
import TrustBadges from '../components/TrustBadges';
import LiveActivity from '../components/LiveActivity';

function Home() {
  return (
    <div className="space-y-0">
      {/* Live Activity Feed */}
      <LiveActivity />

      {/* Hero Section - Enhanced */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/2 -right-1/2 w-full h-full bg-green-100 rounded-full opacity-20"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-green-200 rounded-full opacity-20"
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
              >
                <FaLeaf className="text-7xl text-green-600" />
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                Transform Any Dish to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                  Vegan
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                AI-powered vegan alternatives for your favorite dishes.
                <br />
                <span className="font-semibold text-green-600">
                  Join 10,000+ people going vegan today!
                </span>
              </p>

              {/* Social Proof Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white px-4 py-2 rounded-full shadow-md border border-green-200"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    ⭐ 4.9/5 Rating
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white px-4 py-2 rounded-full shadow-md border border-green-200"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    🌱 50,000+ Recipes Created
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white px-4 py-2 rounded-full shadow-md border border-green-200"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    💯 100% Free
                  </span>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dish-input"
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-green-700 hover:to-green-600 transition shadow-xl hover:shadow-2xl"
                  >
                    <span>Try It Free Now</span>
                    <FaArrowRight className="animate-pulse" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/menus"
                    className="inline-flex items-center justify-center space-x-2 bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-50 transition shadow-lg"
                  >
                    <FaBook />
                    <span>Browse Recipes</span>
                  </Link>
                </motion.div>
              </div>

              <p className="text-sm text-gray-500">
                ✓ No credit card required • ✓ No signup needed to try
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform any dish into a delicious vegan meal
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaUtensils,
                title: "1. Enter Your Dish",
                description: "Simply type in any non-vegan dish you love. Our AI will analyze it instantly.",
                color: "from-blue-500 to-blue-600",
                delay: 0.1
              },
              {
                icon: FaBook,
                title: "2. Get Vegan Recipe",
                description: "Receive a complete recipe with ingredients, instructions, and nutrition info.",
                color: "from-green-500 to-green-600",
                delay: 0.2
              },
              {
                icon: FaStore,
                title: "3. Find Ingredients",
                description: "Discover nearby stores with all ingredients you need, with directions.",
                color: "from-purple-500 to-purple-600",
                delay: 0.3
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-3xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - New */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Go Vegan?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Make a positive impact on your health, animals, and the planet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "💪", text: "Improve your health and energy levels" },
              { icon: "🌍", text: "Reduce your carbon footprint by 50%" },
              { icon: "🐄", text: "Save 100+ animals per year" },
              { icon: "💧", text: "Save 200,000 gallons of water annually" },
              { icon: "❤️", text: "Lower risk of heart disease by 40%" },
              { icon: "⚡", text: "Boost your energy and vitality" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl">{benefit.icon}</div>
                <p className="text-lg font-semibold text-gray-800">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Stats Section - Enhanced */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join the Vegan Revolution
            </h2>
            <p className="text-xl text-green-100">
              Thousands of people are already making the switch
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Happy Users", icon: "👥" },
              { value: "50,000+", label: "Recipes Created", icon: "🍽️" },
              { value: "4.9/5", label: "Average Rating", icon: "⭐" },
              { value: "95%", label: "Success Rate", icon: "✅" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Start Your Vegan Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Whether you're looking to go fully vegan or just want to add more plant-based meals to your diet, we're here to help every step of the way!
            </p>

            {/* Feature checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left max-w-2xl mx-auto">
              {[
                "Unlimited AI-generated recipes",
                "Store locator with directions",
                "Nutritional information",
                "Community support",
                "100% free forever",
                "No credit card required"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dish-input"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-10 py-5 rounded-xl text-xl font-bold hover:from-green-700 hover:to-green-600 transition shadow-2xl"
                >
                  <span>Transform Your First Dish</span>
                  <FaArrowRight />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/menus"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-green-600 border-2 border-green-600 px-10 py-5 rounded-xl text-xl font-bold hover:bg-green-50 transition shadow-lg"
                >
                  <FaBook />
                  <span>Explore Recipes</span>
                </Link>
              </motion.div>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Join 10,000+ people who have already started their vegan journey 🌱
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
