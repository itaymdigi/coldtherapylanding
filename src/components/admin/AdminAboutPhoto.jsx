import React, { useState, useEffect, useId } from 'react';
import { 
  getActiveDanPhoto,
  getAllDanPhotos,
  addDanPhoto,
  updateDanPhoto,
  deleteDanPhoto,
  deleteDanPhotoFile,
  setActiveDanPhoto,
  uploadDanPhoto
} from '../../api/danPhoto';

const AdminAboutPhoto = () => {
  const [activePhoto, setActivePhoto] = useState(null);
  const [allPhotos, setAllPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Generate unique ID for file input
  const fileUploadId = useId();

  // Load photos on component mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const [active, all] = await Promise.all([
        getActiveDanPhoto(),
        getAllDanPhotos()
      ]);
      setActivePhoto(active);
      setAllPhotos(all);
    } catch (error) {
      console.error('Error loading Dan photos:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const publicUrl = await uploadDanPhoto(file);
      
      // Set preview URL
      setPreviewUrl(publicUrl);
      
      alert('✅ Photo uploaded successfully! Click "Save as Active Photo" to set it as the About section photo.');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('❌ Failed to upload photo: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAsActive = async () => {
    if (!previewUrl) {
      alert('❌ Please upload a photo first');
      return;
    }

    setIsLoading(true);

    try {
      // Add new photo to database and set as active
      await addDanPhoto({ url: previewUrl, isActive: true });
      
      // Deactivate all other photos
      if (activePhoto) {
        await updateDanPhoto({ id: activePhoto.id, isActive: false });
      }

      alert('✅ About photo updated successfully!');
      setPreviewUrl('');
      
      // Reload photos
      await loadPhotos();
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('❌ Failed to save photo: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetActive = async (photoId) => {
    setIsLoading(true);

    try {
      await setActiveDanPhoto(photoId);
      
      alert('✅ About photo updated successfully!');
      
      // Reload photos
      await loadPhotos();
    } catch (error) {
      console.error('Error setting active photo:', error);
      alert('❌ Failed to update photo: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      // Get photo data before deletion
      const photo = allPhotos.find(p => p.id === photoId);
      
      // Delete from database
      await deleteDanPhoto(photoId);
      
      // Delete file from storage if it's a Supabase URL
      if (photo && photo.url && photo.url.includes('supabase.co')) {
        await deleteDanPhotoFile(photo.url);
      }
      
      alert('✅ Photo deleted successfully!');
      
      // Reload photos
      await loadPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('❌ Failed to delete photo');
    }
  };

  const handleCancelUpload = () => {
    setPreviewUrl('');
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold text-white">
          Manage About Section Photo
        </h4>
      </div>

      {/* Current Active Photo */}
      <div className="bg-white/5 p-6 rounded-2xl space-y-4">
        <h5 className="text-xl font-semibold text-white mb-4">
          Current About Photo
        </h5>
        
        {activePhoto ? (
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={activePhoto.url}
                alt="Current Dan photo"
                className="w-32 h-32 rounded-xl object-cover border-2 border-cyan-400/30"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-2">
                This photo is currently active in the About section
              </p>
              <p className="text-blue-300 text-sm mb-4">
                Uploaded: {new Date(activePhoto.created_at).toLocaleDateString()}
              </p>
              <button
                type="button"
                onClick={() => handleDelete(activePhoto.id)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
              >
                🗑️ Delete Current Photo
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-blue-200">
            <div className="text-4xl mb-2">📸</div>
            <p>No photo set for the About section yet.</p>
            <p className="text-sm mt-2">Upload a photo below to get started.</p>
          </div>
        )}
      </div>

      {/* Upload New Photo */}
      <div className="bg-white/5 p-6 rounded-2xl space-y-4">
        <h5 className="text-xl font-semibold text-white mb-4">
          Upload New Photo
        </h5>
        
        <div>
          <label htmlFor={fileUploadId} className="block text-white text-sm font-semibold mb-2">
            Select Photo {isUploading && <span className="text-cyan-400">(Uploading...)</span>}
          </label>
          <input
            id={fileUploadId}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
          />
          <p className="text-blue-300 text-xs mt-2">
            💡 Upload a new About section photo (max 5MB, JPG/PNG/WebP)
          </p>
          <p className="text-blue-200 text-sm mt-1">
            Recommended: Square or portrait image, high quality for professional appearance
          </p>
        </div>

        {previewUrl && (
          <div className="space-y-4">
            <div>
              <div className="block text-white text-sm font-semibold mb-2">
                Photo Preview
              </div>
              <img
                src={previewUrl}
                alt="New About photo preview"
                className="w-32 h-32 rounded-xl object-cover border-2 border-cyan-400/30"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSaveAsActive}
                disabled={isLoading || isUploading}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  '💾 Save as Active Photo'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancelUpload}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Photo History */}
      {allPhotos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white">
            Photo History ({allPhotos.length})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`bg-white/5 p-4 rounded-xl border ${photo.is_active ? 'border-cyan-400/50' : 'border-cyan-400/20'} hover:border-cyan-400/50 transition-all`}
              >
                <div className="space-y-3">
                  <img
                    src={photo.url}
                    alt="Dan photo"
                    className="w-full h-32 rounded-lg object-cover border-2 border-cyan-400/30"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150';
                    }}
                  />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium">
                        {photo.is_active ? (
                          <span className="text-cyan-400">✓ Active</span>
                        ) : (
                          <span className="text-blue-300">Inactive</span>
                        )}
                      </span>
                      <span className="text-blue-300 text-xs">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {!photo.is_active && (
                        <button
                          type="button"
                          onClick={() => handleSetActive(photo.id)}
                          disabled={isLoading}
                          className="flex-1 px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-xs disabled:opacity-50"
                        >
                          ✓ Set Active
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id)}
                        disabled={isLoading}
                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-xs disabled:opacity-50"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutPhoto;
