import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaCheck, 
  FaStore, 
  FaDownload,
  FaArrowLeft,
  FaPrint
} from 'react-icons/fa';

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [groupBy, setGroupBy] = useState('category'); // 'category' or 'store'
  const navigate = useNavigate();

  useEffect(() => {
    // Load shopping list from localStorage
    const storedList = localStorage.getItem('currentShoppingList');
    if (storedList) {
      try {
        const parsed = JSON.parse(storedList);
        setShoppingList(parsed);
      } catch (error) {
        console.error('Error parsing shopping list:', error);
        toast.error('Failed to load shopping list');
      }
    } else {
      toast.info('No shopping list available. Generate a weekly menu first!');
    }
  }, []);

  const toggleItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!shoppingList) return;
    
    // Create text version of shopping list
    let text = '🛒 SHOPPING LIST\n\n';
    text += `Week: ${new Date(shoppingList.weekStart).toLocaleDateString()} - ${new Date(shoppingList.weekEnd).toLocaleDateString()}\n\n`;
    
    Object.entries(shoppingList.byCategory || {}).forEach(([category, items]) => {
      text += `\n${category.toUpperCase()}\n`;
      text += '─'.repeat(40) + '\n';
      items.forEach(item => {
        text += `☐ ${item.name} - ${item.quantity} ${item.unit}\n`;
      });
    });
    
    // Download as text file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Shopping list downloaded!');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Produce': '🥬',
      'Grains': '🌾',
      'Proteins': '🫘',
      'Dairy Alternatives': '🥛',
      'Pantry': '🏺',
      'Spices': '🌶️',
      'Condiments': '🍯',
      'Frozen': '❄️',
      'Beverages': '🥤',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  if (!shoppingList) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-12"
        >
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Shopping List Yet
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Generate a weekly menu first to create your shopping list!
          </p>
          <button
            onClick={() => navigate('/weekly-menu')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-lg text-lg"
          >
            <FaArrowLeft className="inline mr-2" />
            Go to Weekly Menu
          </button>
        </motion.div>
      </div>
    );
  }

  const totalItems = Object.values(shoppingList.byCategory || {}).reduce(
    (sum, items) => sum + items.length, 
    0
  );
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/weekly-menu')}
          className="mb-4 text-green-600 hover:text-green-700 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Back to Weekly Menu
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <FaShoppingCart className="inline mr-3 text-green-600" />
              Shopping List
            </h1>
            <p className="text-gray-600">
              {new Date(shoppingList.weekStart).toLocaleDateString()} - {new Date(shoppingList.weekEnd).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition print:hidden"
            >
              <FaPrint className="inline mr-2" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition print:hidden"
            >
              <FaDownload className="inline mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6 print:hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Progress: {checkedCount} of {totalItems} items
          </span>
          <span className="text-sm font-medium text-green-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Shopping List by Category */}
      <div className="space-y-6">
        {Object.entries(shoppingList.byCategory || {}).map(([category, items], index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Category Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                {category}
                <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                  {items.length} items
                </span>
              </h3>
            </div>

            {/* Items List */}
            <div className="p-4">
              <div className="space-y-2">
                {items.map((item, itemIndex) => {
                  const itemId = `${category}-${itemIndex}`;
                  const isChecked = checkedItems[itemId];
                  
                  return (
                    <motion.div
                      key={itemId}
                      whileHover={{ scale: 1.01 }}
                      className={`flex items-center p-3 rounded-lg border-2 transition cursor-pointer ${
                        isChecked
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 bg-white'
                      }`}
                      onClick={() => toggleItem(itemId)}
                    >
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 transition ${
                        isChecked
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {isChecked && <FaCheck className="text-white text-sm" />}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.name}
                        </span>
                      </div>
                      
                      <div className={`text-sm font-medium ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.quantity} {item.unit}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nearby Stores */}
      {shoppingList.nearbyStores && shoppingList.nearbyStores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mt-6 print:hidden"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaStore className="mr-3 text-green-600" />
            Nearby Stores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shoppingList.nearbyStores.slice(0, 4).map((store, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{store.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{store.address}</p>
                {store.distance && (
                  <p className="text-xs text-green-600 mt-2">
                    📍 {store.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
