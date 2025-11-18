'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const triggerConfetti = () => {
  const confetti = [...Array(40)].map((_, i) => ({
    id: i,
    emoji: ['🎉', '🎊', '✨', '💎', '🌟', '🎈', '🎁', '💝'][Math.floor(Math.random() * 8)],
    x: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random(),
  }));

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  confetti.forEach(piece => {
    const el = document.createElement('div');
    el.textContent = piece.emoji;
    el.style.position = 'absolute';
    el.style.left = piece.x + '%';
    el.style.top = '-20px';
    el.style.fontSize = '24px';
    el.style.animation = `fall ${piece.duration}s linear ${piece.delay}s forwards`;
    container.appendChild(el);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall {
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  setTimeout(() => {
    container.remove();
    style.remove();
  }, 3000);
};

export default function AdminPanel({ items, onItemsChange, onEditItem, onDeleteItem }) {
  const { signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        category: item.category || '',
        image_url: item.image_url || '',
      });
      setImagePreview(item.image_url || '');
    } else {
      setEditingItem(null);
      setFormData({ title: '', description: '', category: '', image_url: '' });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ title: '', description: '', category: '', image_url: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('collection-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('collection-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const itemData = {
        ...formData,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        // Update existing item
        const { error } = await supabase
          .from('collections')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase
          .from('collections')
          .insert([itemData]);

        if (error) throw error;

        // Trigger confetti celebration!
        triggerConfetti();
      }

      // Refresh items
      onItemsChange();
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onItemsChange();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  // Expose functions for external use
  useEffect(() => {
    if (onEditItem) onEditItem.current = openModal;
    if (onDeleteItem) onDeleteItem.current = handleDelete;
  }, [onEditItem, onDeleteItem]);

  return (
    <div className="mb-8">
      {/* Admin Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>

      {/* Hint for editing */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200"
        >
          <p className="text-sm text-blue-800 text-center">
            ✏️ <span className="font-semibold">Tip:</span> Edit and delete buttons are now on each item card!
          </p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl my-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {editingItem ? 'Edit Item' : 'Add New Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload with Drag & Drop */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center transition-all duration-300 ${
                      isDragging ? 'scale-105' : ''
                    }`}
                  >
                    {imagePreview ? (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-full aspect-square max-w-sm mb-4 rounded-2xl overflow-hidden group"
                      >
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-semibold">Change Image</p>
                        </div>
                      </motion.div>
                    ) : (
                      <div
                        className={`w-full aspect-square max-w-sm mb-4 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed transition-all ${
                          isDragging
                            ? 'border-purple-500 bg-purple-50 scale-105'
                            : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50/50'
                        }`}
                      >
                        <motion.div
                          animate={isDragging ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                        >
                          <ImageIcon className={`w-16 h-16 mb-4 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                        </motion.div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          {isDragging ? 'Drop your image here!' : 'Drag & drop your image here'}
                        </p>
                        <p className="text-xs text-gray-500">or click below to browse</p>
                      </div>
                    )}
                    <label className="cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      {imagePreview ? 'Change Image' : 'Choose Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="Give your treasure a name..."
                    required
                  />
                </motion.div>

                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g., Hirono, Plushies, Figures"
                  />
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Tell us about this precious treasure..."
                    rows={4}
                  />
                </motion.div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
