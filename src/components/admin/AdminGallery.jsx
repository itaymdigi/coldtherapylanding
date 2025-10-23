import { useMutation, useQuery } from 'convex/react';
import React, { useId, useState } from 'react';
import { api } from '../../../convex/_generated/api';

const AdminGallery = () => {
  const [galleryForm, setGalleryForm] = useState({ url: '', altText: '' });
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Generate unique IDs for form inputs
  const urlInputId = useId();
  const altInputId = useId();

  // Convex queries and mutations
  const allGalleryImages = useQuery(api.galleryImages.getGalleryImages);
  const addGalleryImage = useMutation(api.galleryImages.addGalleryImage);
  const updateGalleryImage = useMutation(api.galleryImages.updateGalleryImage);
  const deleteGalleryImage = useMutation(api.galleryImages.deleteGalleryImage);

  const handleGallerySubmit = async (e) => {
    e.preventDefault();

    // Validate URL format
    try {
      new URL(galleryForm.url);
    } catch {
      alert('❌ Please enter a valid image URL starting with https://');
      return;
    }

    setIsLoading(true);
    try {
      if (editingGalleryId) {
        await updateGalleryImage({
          id: editingGalleryId,
          ...galleryForm,
          order: allGalleryImages?.length || 0,
        });
        alert('✅ Gallery image updated successfully!');
      } else {
        await addGalleryImage({
          ...galleryForm,
          order: allGalleryImages?.length || 0,
        });
        alert('✅ Gallery image added successfully!');
      }

      // Reset form
      setGalleryForm({ url: '', altText: '' });
      setEditingGalleryId(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving gallery image:', error);
      alert(`❌ Failed to save gallery image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setGalleryForm({ ...galleryForm, url });

    // Update preview if URL is valid
    if (url) {
      try {
        new URL(url);
        setImagePreview(url);
      } catch {
        setImagePreview('');
      }
    } else {
      setImagePreview('');
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <h4 className="text-2xl font-semibold text-white mb-4">
        {editingGalleryId ? 'Edit Gallery Image' : 'Add New Gallery Image'}
      </h4>

      {/* Gallery Form */}
      <form onSubmit={handleGallerySubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl">
        <div>
          <label htmlFor={urlInputId} className="block text-white text-sm font-semibold mb-2">
            Image URL *
          </label>
          <input
            id={urlInputId}
            type="url"
            required
            value={galleryForm.url}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label htmlFor={altInputId} className="block text-white text-sm font-semibold mb-2">
            Alt Text (Optional)
          </label>
          <input
            id={altInputId}
            type="text"
            value={galleryForm.altText}
            onChange={(e) => setGalleryForm({ ...galleryForm, altText: e.target.value })}
            placeholder="Description for accessibility"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="space-y-2">
            <div className="block text-white text-sm font-semibold">
              Image Preview
            </div>
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border-2 border-cyan-400/30"
                onError={() => setImagePreview('')}
                onLoad={() => {
                  // Image loaded successfully
                }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                {editingGalleryId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>{editingGalleryId ? '💾 Update Image' : '➕ Add Image'}</>
            )}
          </button>
          {editingGalleryId && (
            <button
              type="button"
              onClick={() => {
                setEditingGalleryId(null);
                setGalleryForm({ url: '', altText: '' });
                setImagePreview('');
              }}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Gallery Images Grid */}
      <div className="space-y-3">
        <h4 className="text-xl font-semibold text-white">
          Gallery Images ({allGalleryImages?.length || 0})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allGalleryImages?.map((image) => (
            <div key={image._id} className="relative group">
              <img
                src={image.url}
                alt={image.altText || 'Gallery image'}
                className="w-full h-40 object-cover rounded-lg border-2 border-cyan-400/30"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setGalleryForm({
                      url: image.url,
                      altText: image.altText || '',
                    });
                    setEditingGalleryId(image._id);
                    setImagePreview(image.url);
                  }}
                  className="px-3 py-1 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDeleteGalleryImage(image._id)}
                  className="px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {allGalleryImages?.length === 0 && (
          <div className="text-center py-8 text-blue-200">
            <div className="text-4xl mb-2">🖼️</div>
            <p>No gallery images yet. Add your first image above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
