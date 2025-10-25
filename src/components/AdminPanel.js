'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, LogOut, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AdminPanel({ items, onItemsChange }) {
  const { signOut } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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

      {/* Edit/Delete buttons on items */}
      {items.length > 0 && (
        <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
          <h3 className="font-semibold text-purple-900 mb-3">Manage Items:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700 truncate flex-1">
                  {item.title}
                </span>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image
                  </label>
                  <div className="flex flex-col items-center">
                    {imagePreview ? (
                      <div className="relative w-full aspect-square max-w-sm mb-4 rounded-2xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square max-w-sm mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <label className="cursor-pointer bg-purple-100 text-purple-700 px-6 py-3 rounded-xl font-semibold hover:bg-purple-200 transition-colors flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Choose Image
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter item title"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g., Hirono, Plushies, Figures"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Tell us about this treasure..."
                    rows={4}
                  />
                </div>

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
