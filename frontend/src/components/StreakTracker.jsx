import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

export default function StreakTracker({ streak = 0, maxStreak = 0 }) {
  const getStreakColor = () => {
    if (streak >= 30) return 'from-orange-500 to-red-600';
    if (streak >= 7) return 'from-yellow-500 to-orange-500';
    if (streak >= 3) return 'from-green-500 to-yellow-500';
    return 'from-gray-400 to-gray-500';
  };

  const getStreakMessage = () => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Keep it up!';
    if (streak < 7) return 'Building momentum!';
    if (streak < 30) return 'You\'re on fire! 🔥';
    return 'Legendary streak! 🏆';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Login Streak</h3>
        <FaFire className={`text-3xl ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
      </div>

      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`inline-block bg-gradient-to-br ${getStreakColor()} text-white rounded-full w-24 h-24 flex items-center justify-center mb-2`}
        >
          <div>
            <div className="text-4xl font-bold">{streak}</div>
            <div className="text-xs">days</div>
          </div>
        </motion.div>
        <p className="text-sm text-gray-600">{getStreakMessage()}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current Streak</span>
          <span className="font-semibold text-gray-900">{streak} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Best Streak</span>
          <span className="font-semibold text-gray-900">{maxStreak} days</span>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Next Milestone</p>
        <div className="space-y-2">
          {streak < 7 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>7 Day Streak 🔥</span>
                <span>{streak}/7</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${(streak / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
          {streak >= 7 && streak < 30 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>30 Day Streak 🏆</span>
                <span>{streak}/30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
                  style={{ width: `${(streak / 30) * 100}%` }}
                />
              </div>
            </div>
          )}
          {streak >= 30 && (
            <div className="text-center">
              <span className="text-sm font-semibold text-green-600">🎉 All milestones achieved!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
