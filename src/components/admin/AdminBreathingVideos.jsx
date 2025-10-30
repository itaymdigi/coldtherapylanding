import React, { useState, useEffect, useId } from 'react';
import { 
  getAllVideosForAdmin,
  getVideoStats,
  addVideo,
  updateVideo,
  deleteVideo,
  toggleVideoPublishStatus,
  toggleVideoPremiumStatus,
  uploadVideoThumbnail,
  deleteVideoThumbnail,
  uploadVideoFile,
  deleteVideoFile,
  getAllCategories,
  createCategory
} from '../../api/breathingVideos';

const AdminBreathingVideos = () => {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, unpublished, free, premium
  const [videoInputType, setVideoInputType] = useState('url'); // 'url' or 'file'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    difficulty: 'beginner',
    category: 'breathing',
    isPremium: false,
    order: 0,
  });

  // Generate unique IDs for form inputs
  const titleInputId = useId();
  const descriptionInputId = useId();
  const videoUrlInputId = useId();
  const thumbnailInputId = useId();
  const durationInputId = useId();
  const difficultyInputId = useId();
  const categoryInputId = useId();
  const orderInputId = useId();
  const isPremiumInputId = useId();

  // Load videos and stats on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [videosData, statsData, categoriesData] = await Promise.all([
        getAllVideosForAdmin(),
        getVideoStats(),
        getAllCategories()
      ]);
      setVideos(videosData);
      setStats(statsData);
      setCategories(categoriesData);
      
      // Set default category to first available category or empty string
      if (categoriesData.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: categoriesData[0].name
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleEdit = (video) => {
    setEditingId(video.id);
    setFormData({
      title: video.title,
      description: video.description,
      videoUrl: video.video_url,
      thumbnailUrl: video.thumbnail_url,
      duration: video.duration,
      difficulty: video.difficulty,
      category: video.category,
      isPremium: video.is_premium,
      order: video.order,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '',
      difficulty: 'beginner',
      category: categories.length > 0 ? categories[0].name : '',
      isPremium: false,
      order: 0,
    });
    setShowAddCategory(false);
    setNewCategoryName('');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('❌ Please enter a category name');
      return;
    }

    try {
      const formattedCategory = await createCategory(newCategoryName.trim());
      
      // Add to categories list
      const newCategories = [...categories, { name: formattedCategory, videoCount: 0 }]
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(newCategories);
      
      // Update form data to use new category
      setFormData({
        ...formData,
        category: formattedCategory
      });
      
      alert(`✅ Category "${formattedCategory}" created successfully!`);
      setShowAddCategory(false);
      setNewCategoryName('');
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`❌ Failed to create category: ${error.message}`);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.videoUrl) {
      alert('❌ Please fill in all required fields (title, video URL)');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        order: formData.order || videos.length,
      };

      if (editingId) {
        await updateVideo({
          id: editingId,
          ...dataToSave,
        });
        alert('✅ Video updated successfully!');
      } else {
        await addVideo(dataToSave);
        alert('✅ Video added successfully!');
      }

      handleCancel();
      await loadData();
    } catch (error) {
      console.error('Error saving video:', error);
      alert(`❌ Failed to save video: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      // Get video data before deletion
      const video = videos.find(v => v.id === id);
      
      // Delete thumbnail file if it's a Supabase URL
      if (video && video.thumbnail_url && video.thumbnail_url.includes('supabase.co')) {
        await deleteVideoThumbnail(video.thumbnail_url);
      }
      
      // Delete video file if it's a Supabase URL
      if (video && video.video_url && video.video_url.includes('supabase.co')) {
        await deleteVideoFile(video.video_url);
      }
      
      // Delete from database
      await deleteVideo(id);
      
      alert('✅ Video deleted successfully!');
      await loadData();
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('❌ Failed to delete video');
    }
  };

  const handleThumbnailUpload = async (e) => {
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
      const publicUrl = await uploadVideoThumbnail(file);
      
      // Update form with uploaded URL
      setFormData({
        ...formData,
        thumbnailUrl: publicUrl
      });
      
      alert('✅ Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      alert('❌ Failed to upload thumbnail: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload to Supabase Storage with progress tracking
      const publicUrl = await uploadVideoFile(file, (progress) => {
        const percentage = (progress.loaded / progress.total) * 100;
        setUploadProgress(Math.round(percentage));
      });
      
      // Update form with uploaded URL
      setFormData({
        ...formData,
        videoUrl: publicUrl
      });
      
      alert('✅ Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('❌ Failed to upload video: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '',
      difficulty: 'beginner',
      category: categories.length > 0 ? categories[0].name : '',
      isPremium: false,
      order: videos.length,
    });
    setShowAddCategory(false);
    setNewCategoryName('');
  };

  const handleTogglePublish = async (id) => {
    try {
      await toggleVideoPublishStatus(id);
      alert('✅ Publish status updated successfully!');
      await loadData();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('❌ Failed to update publish status');
    }
  };

  const handleTogglePremium = async (id) => {
    try {
      await toggleVideoPremiumStatus(id);
      alert('✅ Premium status updated successfully!');
      await loadData();
    } catch (error) {
      console.error('Error toggling premium status:', error);
      alert('❌ Failed to update premium status');
    }
  };

  const filteredVideos = videos.filter(video => {
    switch (filter) {
      case 'published':
        return video.is_published;
      case 'unpublished':
        return !video.is_published;
      case 'free':
        return video.is_published && !video.is_premium;
      case 'premium':
        return video.is_published && video.is_premium;
      default:
        return true;
    }
  });

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
      /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const getEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold text-white">
          Manage Breathing Videos
        </h4>
        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
        >
          ➕ Add Video
        </button>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h5 className="text-xl font-semibold text-white mb-4">
            Video Statistics
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
              <div className="text-sm text-blue-300">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.published}</div>
              <div className="text-sm text-blue-300">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.free}</div>
              <div className="text-sm text-blue-300">Free</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.premium}</div>
              <div className="text-sm text-blue-300">Premium</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalViews}</div>
              <div className="text-sm text-blue-300">Total Views</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Management */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-semibold text-white">
            Categories ({categories.length})
          </h5>
          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
          >
            ➕ Add Category
          </button>
        </div>

        {showAddCategory && (
          <div className="mb-4 p-4 bg-white/10 rounded-xl space-y-3">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                New Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="e.g., Advanced Techniques"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
              />
              <p className="text-blue-300 text-xs mt-1">
                💡 Will be formatted as: lower-case-with-hyphens
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCreateCategory}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
              >
                Create Category
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-cyan-400/20"
            >
              <span className="text-white font-medium">{category.name}</span>
              <span className="text-blue-300 text-sm">{category.videoCount}</span>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8 text-blue-200">
            <div className="text-3xl mb-2">📂</div>
            <p>No categories yet. Create your first category above!</p>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All Videos' },
          { value: 'published', label: 'Published' },
          { value: 'unpublished', label: 'Drafts' },
          { value: 'free', label: 'Free' },
          { value: 'premium', label: 'Premium' },
        ].map(filterOption => (
          <button
            key={filterOption.value}
            type="button"
            onClick={() => setFilter(filterOption.value)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === filterOption.value
                ? 'bg-cyan-500 text-white'
                : 'bg-white/10 text-blue-300 hover:bg-white/20'
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white/5 p-6 rounded-2xl space-y-4">
          <h5 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Video' : 'Add New Video'}
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={titleInputId} className="block text-white text-sm font-semibold mb-2">
                Title *
              </label>
              <input
                id={titleInputId}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="Video title"
                required
              />
            </div>

            <div>
              <label htmlFor={durationInputId} className="block text-white text-sm font-semibold mb-2">
                Duration
              </label>
              <input
                id={durationInputId}
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="e.g., 10:30"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor={descriptionInputId} className="block text-white text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                id={descriptionInputId}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="Video description..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white text-sm font-semibold mb-2">
                Video Source *
              </label>
              
              {/* Toggle between URL and File Upload */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="videoInputType"
                    checked={videoInputType === 'url'}
                    onChange={() => setVideoInputType('url')}
                    className="w-4 h-4 text-cyan-500"
                  />
                  <span className="text-blue-300">🔗 URL (YouTube/Vimeo)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="videoInputType"
                    checked={videoInputType === 'file'}
                    onChange={() => setVideoInputType('file')}
                    className="w-4 h-4 text-cyan-500"
                  />
                  <span className="text-blue-300">📁 Upload File</span>
                </label>
              </div>

              {videoInputType === 'url' ? (
                <>
                  <input
                    id={videoUrlInputId}
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-blue-300 text-xs mt-1">
                    💡 YouTube or Vimeo URL
                  </p>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
                    onChange={handleVideoFileUpload}
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
                  />
                  <p className="text-blue-300 text-xs mt-1">
                    💡 Upload video file (MP4, WebM, OGG, MOV, AVI - max 500MB)
                  </p>
                  
                  {/* Upload Progress Bar */}
                  {isUploading && uploadProgress > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-blue-300 mb-1">
                        <span>Uploading video...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-900/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Show uploaded video URL */}
                  {formData.videoUrl && !isUploading && (
                    <p className="text-green-300 text-xs mt-2">
                      ✅ Video uploaded successfully
                    </p>
                  )}
                </>
              )}
            </div>

            <div>
              <label htmlFor={thumbnailInputId} className="block text-white text-sm font-semibold mb-2">
                Thumbnail
              </label>
              <input
                id={thumbnailInputId}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                disabled={isUploading}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
              />
              <p className="text-blue-300 text-xs mt-1">
                💡 Upload thumbnail (max 5MB)
              </p>
            </div>

            <div>
              <label htmlFor={orderInputId} className="block text-white text-sm font-semibold mb-2">
                Display Order
              </label>
              <input
                id={orderInputId}
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor={difficultyInputId} className="block text-white text-sm font-semibold mb-2">
                Difficulty
              </label>
              <select
                id={difficultyInputId}
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor={categoryInputId} className="block text-white text-sm font-semibold mb-2">
                Category
              </label>
              <select
                id={categoryInputId}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.videoCount} videos)
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-yellow-300 text-xs mt-1">
                  ⚠️ No categories available. Create a category above first.
                </p>
              )}
            </div>

            <div>
              <label htmlFor={isPremiumInputId} className="block text-white text-sm font-semibold mb-2">
                Access Type
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isPremium"
                    checked={!formData.isPremium}
                    onChange={() => setFormData({ ...formData, isPremium: false })}
                    className="w-4 h-4 text-cyan-500"
                  />
                  <span className="text-blue-300">Free</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={() => setFormData({ ...formData, isPremium: true })}
                    className="w-4 h-4 text-cyan-500"
                  />
                  <span className="text-purple-300">Premium</span>
                </label>
              </div>
            </div>

            {formData.thumbnailUrl && (
              <div className="md:col-span-2">
                <div className="block text-white text-sm font-semibold mb-2">
                  Thumbnail Preview
                </div>
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-32 h-20 object-cover rounded-lg border-2 border-cyan-400/30"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isUploading}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                '💾 Save Video'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white">
          Videos ({filteredVideos.length})
        </h4>
        
        <div className="space-y-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`bg-white/5 p-6 rounded-xl border ${
                video.is_published ? 'border-cyan-400/20' : 'border-red-400/20'
              } hover:border-cyan-400/50 transition-all`}
            >
              <div className="flex items-start gap-6">
                {/* Thumbnail/Video Preview */}
                <div className="flex-shrink-0">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-32 h-20 rounded-lg object-cover border-2 border-cyan-400/30"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-32 h-20 rounded-lg bg-gray-700 flex items-center justify-center text-white/50 text-xs">
                            No thumbnail
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-32 h-20 rounded-lg bg-gray-700 flex items-center justify-center text-white/50 text-xs">
                      No thumbnail
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="text-lg font-bold text-white">{video.title}</h5>
                      <p className="text-sm text-blue-300 mb-2">
                        {video.category} • {video.difficulty} • {video.duration}
                      </p>
                      <p className="text-white/80 text-sm line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          video.is_published 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {video.is_published ? 'Published' : 'Draft'}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          video.is_premium 
                            ? 'bg-purple-500/20 text-purple-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {video.is_premium ? 'Premium' : 'Free'}
                        </span>
                      </div>
                      <div className="text-xs text-blue-300">
                        {video.views || 0} views
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(video)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm disabled:opacity-50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(video.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm disabled:opacity-50"
                    >
                      {video.is_published ? '📝 Draft' : '📢 Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTogglePremium(video.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-all text-sm disabled:opacity-50"
                    >
                      {video.is_premium ? '🔓 Make Free' : '🔒 Make Premium'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(video.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && !isAdding && (
          <div className="text-center py-12 text-blue-200">
            <div className="text-4xl mb-2">🎬</div>
            <p>No videos found. Add your first breathing video above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBreathingVideos;
