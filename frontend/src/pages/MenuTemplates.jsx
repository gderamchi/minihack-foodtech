import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { weeklyMenuAPI } from '../services/api';
import { 
  FaBolt, 
  FaStar, 
  FaDollarSign, 
  FaDumbbell,
  FaBoxes,
  FaUsers,
  FaTrophy,
  FaHeart
} from 'react-icons/fa';

const TEMPLATES = [
  {
    id: 'quick-easy',
    name: 'Quick & Easy Week',
    icon: FaBolt,
    color: 'from-yellow-400 to-orange-500',
    description: 'Simple recipes under 30 minutes. Perfect for busy weekdays.',
    features: [
      'All meals under 30 minutes',
      'Minimal ingredients',
      'Simple cooking techniques',
      'Great for beginners'
    ],
    avgTime: '20-30 min',
    difficulty: 'Easy',
    avgCost: '$',
    popular: true
  },
  {
    id: 'gourmet',
    name: 'Gourmet Week',
    icon: FaStar,
    color: 'from-purple-400 to-pink-500',
    description: 'Restaurant-quality meals to impress. Elevate your cooking!',
    features: [
      'Restaurant-quality dishes',
      'Advanced techniques',
      'Premium ingredients',
      'Perfect for special occasions'
    ],
    avgTime: '45-60 min',
    difficulty: 'Advanced',
    avgCost: '$$$',
    popular: false
  },
  {
    id: 'budget-friendly',
    name: 'Budget-Friendly Week',
    icon: FaDollarSign,
    color: 'from-green-400 to-emerald-500',
    description: 'Delicious meals that won\'t break the bank. Smart shopping!',
    features: [
      'Cost-effective ingredients',
      'Bulk cooking options',
      'Minimal waste',
      'Under $50/week'
    ],
    avgTime: '30-40 min',
    difficulty: 'Easy',
    avgCost: '$',
    popular: true
  },
  {
    id: 'high-protein',
    name: 'High Protein Week',
    icon: FaDumbbell,
    color: 'from-blue-400 to-indigo-500',
    description: 'Protein-packed meals for muscle building and recovery.',
    features: [
      '25g+ protein per meal',
      'Balanced macros',
      'Post-workout friendly',
      'Muscle building focus'
    ],
    avgTime: '30-45 min',
    difficulty: 'Intermediate',
    avgCost: '$$',
    popular: true
  },
  {
    id: 'meal-prep',
    name: 'Meal Prep Week',
    icon: FaBoxes,
    color: 'from-teal-400 to-cyan-500',
    description: 'Batch cooking for the whole week. Prep once, eat all week!',
    features: [
      'Batch cooking recipes',
      'Freezer-friendly',
      'Portion control',
      'Save time all week'
    ],
    avgTime: '2-3 hours prep',
    difficulty: 'Intermediate',
    avgCost: '$$',
    popular: true
  },
  {
    id: 'family-friendly',
    name: 'Family-Friendly Week',
    icon: FaUsers,
    color: 'from-red-400 to-rose-500',
    description: 'Kid-approved meals the whole family will love!',
    features: [
      'Kid-friendly flavors',
      'Hidden vegetables',
      'Easy to customize',
      'Crowd pleasers'
    ],
    avgTime: '30-40 min',
    difficulty: 'Easy',
    avgCost: '$$',
    popular: false
  },
  {
    id: 'athletic',
    name: 'Athletic Performance Week',
    icon: FaTrophy,
    color: 'from-orange-400 to-red-500',
    description: 'Optimized nutrition for peak athletic performance.',
    features: [
      'Performance-optimized',
      'Pre/post workout meals',
      'High energy',
      'Recovery focused'
    ],
    avgTime: '35-45 min',
    difficulty: 'Intermediate',
    avgCost: '$$',
    popular: false
  },
  {
    id: 'custom',
    name: 'Custom Menu',
    icon: FaHeart,
    color: 'from-pink-400 to-purple-500',
    description: 'Create your own personalized menu from scratch.',
    features: [
      'Fully customizable',
      'Your preferences',
      'AI-powered suggestions',
      'Unique to you'
    ],
    avgTime: 'Varies',
    difficulty: 'Any',
    avgCost: 'Varies',
    popular: false
  }
];

export default function MenuTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generating, setGenerating] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleGenerateMenu = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    try {
      setGenerating(true);
      const token = await currentUser.getIdToken();
      
      toast.info('Generating your weekly menu... This may take a minute!', {
        autoClose: false,
        toastId: 'generating'
      });

      await weeklyMenuAPI.generate(token, currentUser.uid, {
        template: selectedTemplate.id
      });

      toast.dismiss('generating');
      toast.success('Your weekly menu is ready! 🎉');
      navigate('/weekly-menu');
    } catch (error) {
      console.error('Error generating menu:', error);
      toast.dismiss('generating');
      toast.error('Failed to generate menu. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Menu Template
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a pre-designed template or create your own custom menu. 
            Each template is tailored to specific goals and preferences.
          </p>
        </motion.div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {TEMPLATES.map((template, index) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectTemplate(template)}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-4 ring-green-500 shadow-2xl' 
                  : 'hover:shadow-xl'
              }`}
            >
              {/* Popular Badge */}
              {template.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg">
                    ⭐ POPULAR
                  </span>
                </div>
              )}

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    ✓ SELECTED
                  </span>
                </div>
              )}

              {/* Header */}
              <div className={`bg-gradient-to-r ${template.color} p-6 text-white`}>
                <Icon className="text-5xl mb-3" />
                <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                <p className="text-white/90 text-sm">{template.description}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Time</p>
                    <p className="text-sm font-bold text-gray-900">{template.avgTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Level</p>
                    <p className="text-sm font-bold text-gray-900">{template.difficulty}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Cost</p>
                    <p className="text-sm font-bold text-gray-900">{template.avgCost}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Generate Button */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedTemplate.color} flex items-center justify-center`}>
                  <selectedTemplate.icon className="text-2xl text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected Template:</p>
                  <p className="font-bold text-gray-900">{selectedTemplate.name}</p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateMenu}
                disabled={generating}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg text-lg whitespace-nowrap"
              >
                {generating ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      ⚡
                    </motion.span>
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Menu →
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Choose Template</h3>
              <p className="text-sm text-gray-600">
                Select a template that matches your goals and lifestyle
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Generation</h3>
              <p className="text-sm text-gray-600">
                Our AI creates a personalized menu based on your preferences
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Customize & Enjoy</h3>
              <p className="text-sm text-gray-600">
                Swap meals, adjust portions, and get your shopping list
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
