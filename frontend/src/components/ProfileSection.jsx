import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function ProfileSection({ 
  title, 
  icon, 
  children, 
  defaultOpen = false,
  editable = true,
  onSave
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {editable && isOpen && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <FaEdit />
            </button>
          )}
          {isEditing && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                <FaSave />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FaTimes />
              </button>
            </>
          )}
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white">
              {typeof children === 'function' ? children(isEditing) : children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
