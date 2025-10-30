import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUtensils } from 'react-icons/fa';

const activities = [
  { user: "Sarah", location: "Paris", recipe: "Vegan Carbonara", time: "2 min ago" },
  { user: "Marcus", location: "London", recipe: "Vegan Butter Chicken", time: "5 min ago" },
  { user: "Emma", location: "New York", recipe: "Vegan Mac & Cheese", time: "8 min ago" },
  { user: "Lucas", location: "São Paulo", recipe: "Vegan Feijoada", time: "12 min ago" },
  { user: "Aisha", location: "Mumbai", recipe: "Vegan Tikka Masala", time: "15 min ago" },
  { user: "Tom", location: "Sydney", recipe: "Vegan Meat Pie", time: "18 min ago" },
  { user: "Sophie", location: "Berlin", recipe: "Vegan Schnitzel", time: "22 min ago" },
  { user: "Diego", location: "Madrid", recipe: "Vegan Paella", time: "25 min ago" },
  { user: "Yuki", location: "Tokyo", recipe: "Vegan Ramen", time: "28 min ago" },
  { user: "Olivia", location: "Toronto", recipe: "Vegan Poutine", time: "32 min ago" }
];

export default function LiveActivity() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const activity = activities[currentActivity];

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentActivity}
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl p-4 max-w-sm border-2 border-green-200"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="w-10 flex justify-center mt-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {activity.user}
                  </p>
                  <span className="text-xs text-gray-500">
                    from {activity.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaUtensils className="text-green-600 flex-shrink-0" />
                  <p className="truncate">
                    just created <span className="font-medium">{activity.recipe}</span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>

            {/* Pulse indicator */}
            <div className="absolute -top-1 -right-1">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-green-500 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
