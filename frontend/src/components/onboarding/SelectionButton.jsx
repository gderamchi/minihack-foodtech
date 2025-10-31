import { motion } from 'framer-motion';

export default function SelectionButton({ 
  item, 
  isSelected, 
  onClick, 
  showDescription = false 
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-6 rounded-xl border-2 transition-all text-left w-full ${
        isSelected
          ? 'border-green-500 bg-green-50'
          : 'border-gray-200 hover:border-green-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl flex-shrink-0">{item.icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{item.label}</h3>
          {showDescription && item.description && (
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}
