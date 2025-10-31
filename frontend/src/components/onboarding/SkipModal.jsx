import { motion, AnimatePresence } from 'framer-motion';

export default function SkipModal({ isOpen, onClose, onConfirm, stepTitle }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black bg-opacity-50"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="text-5xl mb-4">⏭️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Skip "{stepTitle}"?
            </h3>
            <p className="text-gray-600 mb-6">
              You can always complete this section later in your profile settings. 
              Skipping may result in less personalized recommendations.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Go Back
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
              >
                Skip Step
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
