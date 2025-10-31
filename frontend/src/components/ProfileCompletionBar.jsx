import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export default function ProfileCompletionBar({ completion = 0 }) {
  const getColor = () => {
    if (completion >= 100) return 'from-green-500 to-emerald-600';
    if (completion >= 75) return 'from-blue-500 to-green-500';
    if (completion >= 50) return 'from-yellow-500 to-blue-500';
    return 'from-red-500 to-yellow-500';
  };

  const getMessage = () => {
    if (completion >= 100) return 'Profile Complete! 🎉';
    if (completion >= 75) return 'Almost there!';
    if (completion >= 50) return 'Halfway done!';
    if (completion >= 25) return 'Good start!';
    return 'Let\'s complete your profile!';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
        {completion >= 100 && <FaCheckCircle className="text-2xl text-green-500" />}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-gray-900">{completion}%</span>
          <span className="text-sm text-gray-600">{getMessage()}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-4 bg-gradient-to-r ${getColor()} rounded-full relative`}
          >
            {completion >= 100 && (
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              />
            )}
          </motion.div>
        </div>
      </div>

      {completion < 100 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Complete your profile to:</p>
          <ul className="text-xs text-gray-500 space-y-1 ml-4">
            <li>✓ Get better recipe recommendations</li>
            <li>✓ Unlock personalized meal plans</li>
            <li>✓ Earn achievement badges</li>
            <li>✓ Track your vegan journey</li>
          </ul>
        </div>
      )}

      {completion >= 100 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 font-medium">
            🎉 Congratulations! Your profile is 100% complete. You're getting the most personalized experience!
          </p>
        </div>
      )}
    </div>
  );
}
