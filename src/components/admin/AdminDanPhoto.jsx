import React, { useEffect, useState } from 'react';
import * as api from '../../api';

const AdminDanPhoto = () => {
  const [danPhotoUrl, setDanPhotoUrl] = useState('');
  const [allDanPhotos, setAllDanPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load Dan photos on component mount
  useEffect(() => {
    const loadDanPhotos = async () => {
      try {
        const photos = await api.danPhoto.getAllDanPhotos();
        setAllDanPhotos(photos);
      } catch (error) {
        console.error('Error loading Dan photos:', error);
      }
    };
    loadDanPhotos();
  }, []);

  const handleAddDanPhoto = async (e) => {
    e.preventDefault();
    if (!danPhotoUrl.trim()) {
      alert('Please enter a photo URL');
      return;
    }

    setIsLoading(true);
    try {
      await api.danPhoto.addDanPhoto({
        url: danPhotoUrl,
        isActive: false,
      });
      alert("✅ Dan's photo added successfully!");
      setDanPhotoUrl('');
      // Reload photos
      const photos = await api.danPhoto.getAllDanPhotos();
      setAllDanPhotos(photos);
    } catch (error) {
      console.error("Error adding Dan's photo:", error);
      alert(`❌ Failed to add photo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActiveDanPhoto = async (photoId) => {
    try {
      await api.danPhoto.setActiveDanPhoto({ id: photoId });
      alert('✅ Photo set as active!');
      // Reload photos
      const photos = await api.danPhoto.getAllDanPhotos();
      setAllDanPhotos(photos);
    } catch (error) {
      console.error('Error setting active photo:', error);
      alert('❌ Failed to set active photo.');
    }
  };

  const handleDeleteDanPhoto = async (photoId) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await api.danPhoto.deleteDanPhoto({ id: photoId });
        alert('✅ Photo deleted successfully!');
        // Reload photos
        const photos = await api.danPhoto.getAllDanPhotos();
        setAllDanPhotos(photos);
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('❌ Failed to delete photo.');
      }
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <h4 className="text-2xl font-semibold text-white mb-4">Add Dan's Photo</h4>

      {/* Dan Photo Form */}
      <form onSubmit={handleAddDanPhoto} className="space-y-4 bg-white/5 p-6 rounded-2xl">
        <div>
          <label htmlFor="photo-url" className="block text-white text-sm font-semibold mb-2">Photo URL *</label>
          <input
            id="photo-url"
            type="url"
            required
            value={danPhotoUrl}
            onChange={(e) => setDanPhotoUrl(e.target.value)}
            placeholder="https://example.com/dan-photo.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
          <p className="text-blue-300 text-xs mt-1">
            💡 Tip: Upload to Media Library first, then copy URL
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Adding...
            </>
          ) : (
            '➕ Add Photo'
          )}
        </button>
      </form>

      {/* Dan Photos List */}
      <div className="space-y-3">
        <h4 className="text-xl font-semibold text-white">
          All Photos ({allDanPhotos?.length || 0})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allDanPhotos?.map((photo) => (
            <div key={photo._id} className="relative group">
              <img
                src={photo.url}
                alt="Dan Hayat"
                className="w-full h-48 object-cover rounded-lg border-2 border-cyan-400/30"
              />
              {photo.isActive && (
                <div className="absolute top-2 right-2 bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                  ✓ Active
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                {!photo.isActive && (
                  <button
                    type="button"
                    onClick={() => handleSetActiveDanPhoto(photo._id)}
                    className="px-3 py-1 bg-green-500/80 text-white rounded-lg hover:bg-green-500 transition-all text-sm"
                  >
                    ✓ Set Active
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteDanPhoto(photo._id)}
                  className="px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {allDanPhotos?.length === 0 && (
          <div className="text-center py-8 text-blue-200">
            <div className="text-4xl mb-2">👤</div>
            <p>No photos yet. Add your first photo above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDanPhoto;
