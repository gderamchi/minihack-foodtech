import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingSteps = [
  { icon: "🔍", text: "Analyzing your dish...", duration: 3000 },
  { icon: "🌱", text: "Finding perfect vegan substitutes...", duration: 4000 },
  { icon: "🥗", text: "Calculating nutritional values...", duration: 4000 },
  { icon: "👨‍🍳", text: "Creating your personalized recipe...", duration: 4000 },
  { icon: "✨", text: "Almost ready! This will be delicious...", duration: 4000 }
];

const veganFacts = [
  "💧 Going vegan saves 200,000 gallons of water per year!",
  "🌍 A vegan diet reduces your carbon footprint by 50%",
  "🐄 You'll save 100+ animals per year by going vegan",
  "💪 Vegan athletes include Lewis Hamilton & Venus Williams",
  "🌱 Plant-based diets can reduce heart disease risk by 40%",
  "🌊 Animal agriculture uses 70% of global freshwater",
  "🌳 Going vegan is equivalent to planting 3,000 trees per year",
  "⚡ Plant proteins require 10x less energy to produce"
];

export default function EnhancedLoading({ isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + 1;
      });
    }, 200);

    // Step progression
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 4000);

    // Fact rotation
    const factInterval = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % veganFacts.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(factInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Main Loading Animation */}
        <div className="text-center mb-6">
          <motion.div
            key={currentStep}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-6xl mb-4"
          >
            {loadingSteps[currentStep].icon}
          </motion.div>
          
          <AnimatePresence mode="wait">
            <motion.h3
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-xl font-semibold text-gray-800 mb-2"
            >
              {loadingSteps[currentStep].text}
            </motion.h3>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            {progress}% complete
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {loadingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-green-500 w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>

        {/* Vegan Facts */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800 mb-1">
            Did you know?
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentFact}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-sm text-green-700"
            >
              {veganFacts[currentFact]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Spinning loader */}
        <div className="flex justify-center mt-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
