import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaShoppingCart, 
  FaCheck, 
  FaStore, 
  FaDownload,
  FaArrowLeft,
  FaPrint,
  FaPlus,
  FaTrash,
  FaStickyNote,
  FaCalendarDay,
  FaList,
  FaDollarSign,
  FaEnvelope,
  FaTimes
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { shoppingListAPI } from '../services/api';
import jsPDF from 'jspdf';

export default function ShoppingList() {
  const [shoppingList, setShoppingList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState([]);
  const [itemNotes, setItemNotes] = useState({});
  const [viewMode, setViewMode] = useState('category'); // 'category', 'store', 'day'
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState({ name: '', quantity: '', category: 'Other' });
  const [activeNoteItem, setActiveNoteItem] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    loadShoppingList();
  }, []);

  // Auto-save when checked items or custom items change
  useEffect(() => {
    if (shoppingList && currentUser) {
      const timeoutId = setTimeout(() => {
        saveToBackend();
      }, 1000); // Debounce 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [checkedItems, customItems, itemNotes]);

  const loadShoppingList = async () => {
    try {
      setLoading(true);
      
      // Try to load from backend first
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          const response = await shoppingListAPI.get(token);
          
          if (response.data) {
            setShoppingList(response.data);
            setCheckedItems(response.data.checkedItems || {});
            setCustomItems(response.data.customItems || []);
            setItemNotes(response.data.itemNotes || {});
            setLoading(false);
            return;
          }
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Error loading from backend:', error);
          }
        }
      }
      
      // Fallback to localStorage
      const storedList = localStorage.getItem('currentShoppingList');
      if (storedList) {
        const parsed = JSON.parse(storedList);
        setShoppingList(parsed);
        
        // Load persisted state
        const storedChecked = localStorage.getItem('checkedItems');
        const storedCustom = localStorage.getItem('customItems');
        const storedNotes = localStorage.getItem('itemNotes');
        
        if (storedChecked) setCheckedItems(JSON.parse(storedChecked));
        if (storedCustom) setCustomItems(JSON.parse(storedCustom));
        if (storedNotes) setItemNotes(JSON.parse(storedNotes));
      } else {
        toast.info('No shopping list available. Generate a weekly menu first!');
      }
    } catch (error) {
      console.error('Error loading shopping list:', error);
      toast.error('Failed to load shopping list');
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async () => {
    if (!currentUser || !shoppingList) return;
    
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();
      
      await shoppingListAPI.update(token, {
        checkedItems,
        customItems,
        itemNotes
      });
    } catch (error) {
      console.error('Error saving to backend:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleItem = (itemId) => {
    const newCheckedItems = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId]
    };
    
    setCheckedItems(newCheckedItems);
    localStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
  };

  const addCustomItem = () => {
    if (!newCustomItem.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }
    
    const item = {
      id: Date.now().toString(),
      ...newCustomItem,
      custom: true
    };
    
    const updatedCustomItems = [...customItems, item];
    setCustomItems(updatedCustomItems);
    localStorage.setItem('customItems', JSON.stringify(updatedCustomItems));
    
    setNewCustomItem({ name: '', quantity: '', category: 'Other' });
    setShowAddCustom(false);
    toast.success('Item added!');
  };

  const removeCustomItem = (itemId) => {
    const updatedCustomItems = customItems.filter(item => item.id !== itemId);
    setCustomItems(updatedCustomItems);
    localStorage.setItem('customItems', JSON.stringify(updatedCustomItems));
    
    // Remove from checked items and notes
    const newCheckedItems = { ...checkedItems };
    const newItemNotes = { ...itemNotes };
    delete newCheckedItems[`custom-${itemId}`];
    delete newItemNotes[`custom-${itemId}`];
    
    setCheckedItems(newCheckedItems);
    setItemNotes(newItemNotes);
    
    toast.success('Item removed');
  };

  const openNoteModal = (itemId) => {
    setActiveNoteItem(itemId);
    setNoteText(itemNotes[itemId] || '');
  };

  const saveNote = () => {
    const newItemNotes = {
      ...itemNotes,
      [activeNoteItem]: noteText
    };
    
    setItemNotes(newItemNotes);
    localStorage.setItem('itemNotes', JSON.stringify(newItemNotes));
    
    setActiveNoteItem(null);
    setNoteText('');
    toast.success('Note saved');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (!shoppingList) return;
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Shopping List', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${new Date(shoppingList.weekStart).toLocaleDateString()} - ${new Date(shoppingList.weekEnd).toLocaleDateString()}`, 20, yPos);
    
    yPos += 15;
    
    // Items by current view mode
    const itemsByView = viewMode === 'category' ? shoppingList.byCategory :
                       viewMode === 'store' ? shoppingList.byStore :
                       shoppingList.byDay;
    
    Object.entries(itemsByView || {}).forEach(([group, items]) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Group header
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(group, 20, yPos);
      yPos += 8;
      
      // Items
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      items.forEach(item => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        const checkbox = '[ ]';
        const text = `${checkbox} ${item.name} - ${item.quantity} ${item.unit || ''}`;
        doc.text(text, 25, yPos);
        yPos += 6;
      });
      
      yPos += 5;
    });
    
    // Custom items
    if (customItems.length > 0) {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Custom Items', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      customItems.forEach(item => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        
        const checkbox = '[ ]';
        const text = `${checkbox} ${item.name} ${item.quantity ? `- ${item.quantity}` : ''}`;
        doc.text(text, 25, yPos);
        yPos += 6;
      });
    }
    
    doc.save(`shopping-list-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF downloaded!');
  };

  const handleEmailList = () => {
    if (!shoppingList) return;
    
    let emailBody = 'SHOPPING LIST\n\n';
    emailBody += `Week: ${new Date(shoppingList.weekStart).toLocaleDateString()} - ${new Date(shoppingList.weekEnd).toLocaleDateString()}\n\n`;
    
    const itemsByView = viewMode === 'category' ? shoppingList.byCategory :
                       viewMode === 'store' ? shoppingList.byStore :
                       shoppingList.byDay;
    
    Object.entries(itemsByView || {}).forEach(([group, items]) => {
      emailBody += `\n${group.toUpperCase()}\n`;
      emailBody += '----------------------------------------\n';
      items.forEach(item => {
        const checked = checkedItems[`${group}-${items.indexOf(item)}`] ? '[X]' : '[ ]';
        emailBody += `${checked} ${item.name} - ${item.quantity} ${item.unit || ''}\n`;
      });
    });
    
    if (customItems.length > 0) {
      emailBody += '\n\nCUSTOM ITEMS\n';
      emailBody += '----------------------------------------\n';
      customItems.forEach(item => {
        const checked = checkedItems[`custom-${item.id}`] ? '[X]' : '[ ]';
        emailBody += `${checked} ${item.name} ${item.quantity ? `- ${item.quantity}` : ''}\n`;
      });
    }
    
    const subject = `Shopping List - ${new Date().toLocaleDateString()}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    window.location.href = mailtoLink;
    toast.success('Opening email client...');
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

  const calculateEstimatedCost = () => {
    if (!shoppingList) return '0.00';
    
    const itemsByView = viewMode === 'category' ? shoppingList.byCategory :
                       viewMode === 'store' ? shoppingList.byStore :
                       shoppingList.byDay;
    
    const totalItems = Object.values(itemsByView || {}).reduce(
      (sum, items) => sum + items.length, 
      0
    ) + customItems.length;
    
    // Simple estimation: $3 per item on average
    return (totalItems * 3).toFixed(2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-xl text-gray-600">Loading shopping list...</p>
      </div>
    );
  }

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

  const itemsByView = viewMode === 'category' ? shoppingList.byCategory :
                      viewMode === 'store' ? shoppingList.byStore :
                      shoppingList.byDay;

  const totalItems = Object.values(itemsByView || {}).reduce(
    (sum, items) => sum + items.length, 
    0
  ) + customItems.length;
  
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? (checkedCount / totalItems) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto pb-8">
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
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition print:hidden"
            >
              <FaPrint className="inline mr-2" />
              Print
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition print:hidden"
            >
              <FaDownload className="inline mr-2" />
              PDF
            </button>
            <button
              onClick={handleEmailList}
              className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg font-medium hover:bg-pink-200 transition print:hidden"
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4 mb-6 print:hidden"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('category')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                viewMode === 'category'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaList className="inline mr-2" />
              By Category
            </button>
            {shoppingList.byStore && Object.keys(shoppingList.byStore).length > 0 && (
              <button
                onClick={() => setViewMode('store')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'store'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaStore className="inline mr-2" />
                By Store
              </button>
            )}
            {shoppingList.byDay && Object.keys(shoppingList.byDay).length > 0 && (
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'day'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCalendarDay className="inline mr-2" />
                By Day
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <FaDollarSign className="inline text-green-600" />
              <span className="font-semibold ml-1">${calculateEstimatedCost()}</span>
              <span className="ml-1">estimated</span>
            </div>
            {saving && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}
          </div>
        </div>
      </motion.div>

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

      {/* Add Custom Item Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 print:hidden"
      >
        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg"
        >
          <FaPlus className="inline mr-2" />
          Add Custom Item
        </button>
        
        <AnimatePresence>
          {showAddCustom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white rounded-xl shadow-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newCustomItem.name}
                  onChange={(e) => setNewCustomItem({ ...newCustomItem, name: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Quantity (optional)"
                  value={newCustomItem.quantity}
                  onChange={(e) => setNewCustomItem({ ...newCustomItem, quantity: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={newCustomItem.category}
                  onChange={(e) => setNewCustomItem({ ...newCustomItem, category: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Produce">Produce</option>
                  <option value="Grains">Grains</option>
                  <option value="Proteins">Proteins</option>
                  <option value="Dairy Alternatives">Dairy Alternatives</option>
                  <option value="Pantry">Pantry</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addCustomItem}
                  className="flex-1 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddCustom(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Shopping List Items */}
      <div className="space-y-6">
        {Object.entries(itemsByView || {}).map(([group, items], index) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">{getCategoryIcon(group)}</span>
                {group}
                <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                  {items.length} items
                </span>
              </h3>
            </div>

            {/* Items List */}
            <div className="p-4">
              <div className="space-y-2">
                {items.map((item, itemIndex) => {
                  const itemId = `${group}-${itemIndex}`;
                  const isChecked = checkedItems[itemId];
                  const hasNote = itemNotes[itemId];
                  
                  return (
                    <div key={itemId}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center p-3 rounded-lg border-2 transition ${
                          isChecked
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 bg-white'
                        }`}
                      >
                        <div 
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 transition cursor-pointer ${
                            isChecked
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}
                          onClick={() => toggleItem(itemId)}
                        >
                          {isChecked && <FaCheck className="text-white text-sm" />}
                        </div>
                        
                        <div className="flex-1 cursor-pointer" onClick={() => toggleItem(itemId)}>
                          <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                          {hasNote && (
                            <p className="text-xs text-gray-500 mt-1">
                              📝 {itemNotes[itemId]}
                            </p>
                          )}
                        </div>
                        
                        <div className={`text-sm font-medium mr-3 ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.quantity} {item.unit}
                        </div>
                        
                        <button
                          onClick={() => openNoteModal(itemId)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition"
                          title="Add note"
                        >
                          <FaStickyNote />
                        </button>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Custom Items Section */}
        {customItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <span className="text-2xl mr-3">📝</span>
                Custom Items
                <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                  {customItems.length} items
                </span>
              </h3>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {customItems.map((item) => {
                  const itemId = `custom-${item.id}`;
                  const isChecked = checkedItems[itemId];
                  const hasNote = itemNotes[itemId];
                  
                  return (
                    <div key={itemId}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center p-3 rounded-lg border-2 transition ${
                          isChecked
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300 bg-white'
                        }`}
                      >
                        <div 
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 transition cursor-pointer ${
                            isChecked
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}
                          onClick={() => toggleItem(itemId)}
                        >
                          {isChecked && <FaCheck className="text-white text-sm" />}
                        </div>
                        
                        <div className="flex-1 cursor-pointer" onClick={() => toggleItem(itemId)}>
                          <span className={`font-medium ${isChecked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                          {item.quantity && (
                            <span className={`text-sm ml-2 ${isChecked ? 'text-gray-400' : 'text-gray-600'}`}>
                              - {item.quantity}
                            </span>
                          )}
                          {hasNote && (
                            <p className="text-xs text-gray-500 mt-1">
                              📝 {itemNotes[itemId]}
                            </p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => openNoteModal(itemId)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition"
                          title="Add note"
                        >
                          <FaStickyNote />
                        </button>
                        
                        <button
                          onClick={() => removeCustomItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
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

      {/* Note Modal */}
      <AnimatePresence>
        {activeNoteItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveNoteItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <FaStickyNote className="mr-2 text-blue-600" />
                  Add Note
                </h3>
                <button
                  onClick={() => setActiveNoteItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note for this item..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                autoFocus
              />
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={saveNote}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Save Note
                </button>
                <button
                  onClick={() => setActiveNoteItem(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
