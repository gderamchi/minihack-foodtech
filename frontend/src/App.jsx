import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLeaf, FaHome, FaUtensils, FaBook, FaStore, FaUser } from 'react-icons/fa';

// Pages
import Home from './pages/Home';
import DishInput from './pages/DishInput';
import MenuBrowser from './pages/MenuBrowser';
import StoreLocator from './pages/StoreLocator';
import DishDetail from './pages/DishDetail';
import MenuDetail from './pages/MenuDetail';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <FaLeaf className="text-primary-600 text-3xl" />
                  <span className="text-2xl font-bold text-gray-900">
                    Vegan<span className="text-primary-600">Diet</span>
                  </span>
                </Link>
              </div>

              <div className="flex items-center space-x-6">
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <FaHome />
                  <span>Home</span>
                </Link>
                <Link
                  to="/dish-input"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <FaUtensils />
                  <span>Find Vegan Alternative</span>
                </Link>
                <Link
                  to="/menus"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <FaBook />
                  <span>Menus</span>
                </Link>
                <Link
                  to="/stores"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
                >
                  <FaStore />
                  <span>Stores</span>
                </Link>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Hi, {user.name}!</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dish-input" element={<DishInput />} />
            <Route path="/menus" element={<MenuBrowser />} />
            <Route path="/menus/:id" element={<MenuDetail />} />
            <Route path="/dishes/:id" element={<DishDetail />} />
            <Route path="/stores" element={<StoreLocator />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <FaLeaf className="text-primary-400" />
                  <span>VeganDiet</span>
                </h3>
                <p className="text-gray-400">
                  Helping you transition to a healthy vegan lifestyle, one meal at a time.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/dish-input" className="hover:text-primary-400">Find Alternatives</Link></li>
                  <li><Link to="/menus" className="hover:text-primary-400">Browse Menus</Link></li>
                  <li><Link to="/stores" className="hover:text-primary-400">Find Stores</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">About</h4>
                <p className="text-gray-400">
                  Powered by AI to provide personalized vegan alternatives and local store recommendations.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 VeganDiet. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
