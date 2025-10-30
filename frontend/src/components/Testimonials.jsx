import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: "Sarah Martinez",
    location: "Paris, France",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Martinez&background=10b981&color=fff",
    text: "I never thought I could make vegan versions of my favorite dishes. This app changed everything! The AI suggestions are spot-on.",
    rating: 5,
    recipeTried: "Vegan Carbonara",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Marcus Chen",
    location: "London, UK",
    avatar: "https://ui-avatars.com/api/?name=Marcus+Chen&background=3b82f6&color=fff",
    text: "As a chef, I was skeptical at first. But the vegan alternatives are creative and delicious. My customers love them!",
    rating: 5,
    recipeTried: "Vegan Beef Wellington",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Emma Johnson",
    location: "New York, USA",
    avatar: "https://ui-avatars.com/api/?name=Emma+Johnson&background=ec4899&color=fff",
    text: "The store locator feature is a game-changer. I can find all ingredients nearby and save so much time!",
    rating: 5,
    recipeTried: "Vegan Mac & Cheese",
    date: "3 days ago"
  },
  {
    id: 4,
    name: "Lucas Silva",
    location: "São Paulo, Brazil",
    avatar: "https://ui-avatars.com/api/?name=Lucas+Silva&background=f59e0b&color=fff",
    text: "Started my vegan journey 30 days ago with this app. Lost 5kg and feel amazing! The recipes are so easy to follow.",
    rating: 5,
    recipeTried: "Vegan Feijoada",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Aisha Patel",
    location: "Mumbai, India",
    avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=8b5cf6&color=fff",
    text: "Finally, authentic Indian recipes made vegan! The AI understands spices and flavors perfectly.",
    rating: 5,
    recipeTried: "Vegan Butter Chicken",
    date: "1 day ago"
  },
  {
    id: 6,
    name: "Tom Anderson",
    location: "Sydney, Australia",
    avatar: "https://ui-avatars.com/api/?name=Tom+Anderson&background=ef4444&color=fff",
    text: "My family didn't even notice I switched to vegan versions. The recipes taste that good!",
    rating: 5,
    recipeTried: "Vegan Meat Pie",
    date: "4 days ago"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join 10,000+ People Going Vegan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real people transforming their diet
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Recipe Badge */}
              <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🌱 Tried: {testimonial.recipeTried}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location} • {testimonial.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
            <div className="text-gray-600">Recipes Generated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
