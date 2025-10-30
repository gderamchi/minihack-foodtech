import { motion } from 'framer-motion';
import { FaRobot, FaLeaf, FaShieldAlt, FaBolt, FaHeart, FaGlobe } from 'react-icons/fa';

const badges = [
  {
    icon: FaRobot,
    title: "AI-Powered",
    description: "Advanced AI creates perfect vegan alternatives",
    color: "blue"
  },
  {
    icon: FaLeaf,
    title: "100% Vegan",
    description: "All recipes are completely plant-based",
    color: "green"
  },
  {
    icon: FaShieldAlt,
    title: "Privacy First",
    description: "Your data is secure and never shared",
    color: "purple"
  },
  {
    icon: FaBolt,
    title: "Instant Results",
    description: "Get recipes in seconds, not hours",
    color: "yellow"
  },
  {
    icon: FaHeart,
    title: "Community Driven",
    description: "Join thousands of vegan enthusiasts",
    color: "pink"
  },
  {
    icon: FaGlobe,
    title: "Global Recipes",
    description: "Cuisines from around the world",
    color: "indigo"
  }
];

const colorClasses = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200"
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200"
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200"
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    border: "border-yellow-200"
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "border-pink-200"
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "border-indigo-200"
  }
};

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            const colors = colorClasses[badge.color];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 text-center transition-all hover:shadow-lg`}
              >
                <Icon className={`${colors.text} text-3xl mx-auto mb-2`} />
                <h3 className={`${colors.text} font-bold text-sm mb-1`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-gray-600 leading-tight">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
