import { motion } from 'framer-motion';

export default function AchievementBadge({ achievement, earned = false, size = 'md' }) {
  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl'
  };

  return (
    <motion.div
      whileHover={{ scale: earned ? 1.1 : 1 }}
      className={`${sizes[size]} rounded-full flex items-center justify-center ${
        earned
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg'
          : 'bg-gray-200 opacity-50'
      } relative group cursor-pointer`}
    >
      <span className={earned ? '' : 'grayscale'}>{achievement.icon}</span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
          <div className="font-semibold">{achievement.name}</div>
          <div className="text-gray-300 text-xs">{achievement.description}</div>
          {!earned && <div className="text-yellow-400 text-xs mt-1">🔒 Locked</div>}
        </div>
      </div>
    </motion.div>
  );
}
