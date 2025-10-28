import { useCallback, useEffect, useId, useState } from 'react';
import { 
  addGalleryImage,
  deleteGalleryImage,
  deleteGalleryImageFile,
  getGalleryImages,
  updateGalleryImage,
  uploadGalleryImage
} from '../../api/galleryImages';

const AdminGallery = () => {
  const [galleryForm, setGalleryForm] = useState({ url: '', altText: '' });
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Generate unique IDs for form inputs
  const urlInputId = useId();
  const altInputId = useId();
  const fileInputId = useId();

  const loadGalleryImages = useCallback(async () => {
    try {
      const images = await getGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
  }, []);

  // Load gallery images on component mount
  useEffect(() => {
    loadGalleryImages();
  }, [loadGalleryImages]);

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
          order: galleryImages?.length || 0,
        });
        alert('✅ Gallery image updated successfully!');
      } else {
        await addGalleryImage({
          ...galleryForm,
          order: galleryImages?.length || 0,
        });
        alert('✅ Gallery image added successfully!');
      }

      // Reset form and reload images
      setGalleryForm({ url: '', altText: '' });
      setEditingGalleryId(null);
      setImagePreview('');
      await loadGalleryImages();
    } catch (error) {
      console.error('Error saving gallery image:', error);
      alert(`❌ Failed to save gallery image: ${error.message}`);
    } finally {
      setIsLoading(false);
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
    setUploadProgress(0);

    try {
      // Upload to Supabase Storage
      const publicUrl = await uploadGalleryImage(file);
      
      // Update form with uploaded URL
      setGalleryForm({
        ...galleryForm,
        url: publicUrl,
        altText: galleryForm.altText || file.name.replace(/\.[^/.]+$/, '')
      });
      
      // Set preview
      setImagePreview(publicUrl);
      
      alert('✅ Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`❌ Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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

  const handleEditGalleryImage = (image) => {
    setGalleryForm({
      url: image.url,
      altText: image.alt_text || '',
    });
    setEditingGalleryId(image.id);
    setImagePreview(image.url);
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;

    try {
      // Get image URL before deletion
      const image = galleryImages.find(img => img.id === imageId);
      
      // Delete from database
      await deleteGalleryImage(imageId);
      
      // Delete file from storage if it's a Supabase URL
      if (image?.url.includes('supabase.co')) {
        await deleteGalleryImageFile(image.url);
      }
      
      alert('✅ Gallery image deleted successfully!');
      await loadGalleryImages();
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      alert(`❌ Failed to delete gallery image: ${error.message}`);
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
          <label htmlFor={fileInputId} className="block text-white text-sm font-semibold mb-2">
            Upload Image File
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
          />
          {isUploading && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-cyan-300 text-xs mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
          <p className="text-blue-300 text-xs mt-1">
            💡 Upload a file or provide a URL below
          </p>
        </div>

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
            disabled={isLoading || isUploading}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <>
                <span className="inline-block animate-pulse mr-2">Loading</span>
                {editingGalleryId ? 'Updating...' : 'Adding...'}
              </>
            )}
            {!isLoading && (
              editingGalleryId ? 'Update Image' : 'Add Image'
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
          Gallery Images ({galleryImages?.length || 0})
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages?.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={image.alt_text || 'Gallery image'}
                className="w-full h-40 object-cover rounded-lg border-2 border-cyan-400/30"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleEditGalleryImage(image)}
                  className="px-3 py-1 bg-blue-500/80 text-white rounded-lg hover:bg-blue-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDeleteGalleryImage(image.id)}
                  className="px-3 py-1 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {galleryImages?.length === 0 && (
          <div className="text-center py-8 text-blue-200">
            <div className="text-4xl mb-2">Gallery</div>
            <p>No gallery images yet. Add your first image above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
