import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLeaf, FaHome, FaUtensils, FaBook, FaStore, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import DishInput from './pages/DishInput';
import MenuBrowser from './pages/MenuBrowser';
import StoreLocator from './pages/StoreLocator';
import DishDetail from './pages/DishDetail';
import MenuDetail from './pages/MenuDetail';
import WeeklyMenu from './pages/WeeklyMenu';
import WeeklyMenuView from './pages/WeeklyMenuView';
import MenuTemplates from './pages/MenuTemplates';
import ShoppingList from './pages/ShoppingList';

function Navigation() {
  const { currentUser, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaLeaf className="text-green-600 text-3xl" />
              <span className="text-2xl font-bold text-gray-900">
                Vegan<span className="text-green-600">Diet</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/dish-input"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
            >
              <FaUtensils />
              <span>Find Alternative</span>
            </Link>
            <Link
              to="/menus"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
            >
              <FaBook />
              <span>Menus</span>
            </Link>
            <Link
              to="/stores"
              className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
            >
              <FaStore />
              <span>Stores</span>
            </Link>
            
            {currentUser && (
              <Link
                to="/weekly-menu"
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
              >
                <FaUtensils />
                <span>Weekly Menu</span>
              </Link>
            )}
            
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition"
                >
                  <FaUser />
                  <span>{userProfile?.user?.name || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />

          {/* Main Content */}
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dish-input" element={<DishInput />} />
              <Route path="/menus" element={<MenuBrowser />} />
              <Route path="/menus/:id" element={<MenuDetail />} />
              <Route path="/dishes/:id" element={<DishDetail />} />
              <Route path="/stores" element={<StoreLocator />} />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireOnboarding={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/weekly-menu"
                element={
                  <ProtectedRoute requireOnboarding={true}>
                    <WeeklyMenuView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu-templates"
                element={
                  <ProtectedRoute requireOnboarding={true}>
                    <MenuTemplates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shopping-list"
                element={
                  <ProtectedRoute requireOnboarding={true}>
                    <ShoppingList />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                    <FaLeaf className="text-green-400" />
                    <span>VeganDiet</span>
                  </h3>
                  <p className="text-gray-400">
                    Helping you transition to a healthy vegan lifestyle, one meal at a time.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/dish-input" className="hover:text-green-400">Find Alternatives</Link></li>
                    <li><Link to="/menus" className="hover:text-green-400">Browse Menus</Link></li>
                    <li><Link to="/stores" className="hover:text-green-400">Find Stores</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">About</h4>
                  <p className="text-gray-400">
                    Powered by Blackbox AI to provide personalized vegan alternatives and local store recommendations.
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
      </AuthProvider>
    </Router>
  );
}

export default App;
