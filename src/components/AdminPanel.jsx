import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../contexts/AppContext';

const AdminPanel = () => {
  const {
    t,
    isAuthenticated,
    password,
    setPassword,
    adminSection,
    setAdminSection,
    scheduleImage,
    galleryImages,
    danPhoto,
    heroVideo,
    handleImageUpload,
    handleLogin,
    handleAdminClose,
  } = useApp();

  // Helper function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url) => {
    if (!url) return url;

    // Already an embed URL
    if (url.includes('/embed/')) return url;

    // Convert youtube.com/watch?v=VIDEO_ID to youtube.com/embed/VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // Convert vimeo.com/VIDEO_ID to player.vimeo.com/video/VIDEO_ID
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && !url.includes('player.vimeo.com')) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  // Video management state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: 10,
    difficulty: 'beginner',
    category: 'wim-hof',
    isPremium: false,
    order: 1,
  });
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [customCategory, setCustomCategory] = useState('');

  // Convex queries and mutations - Videos
  const videos = useQuery(api.breathingVideos.getAllVideos);
  const addVideo = useMutation(api.breathingVideos.addVideo);
  const updateVideo = useMutation(api.breathingVideos.updateVideo);
  const deleteVideo = useMutation(api.breathingVideos.deleteVideo);

  // Get unique categories from existing videos
  const uniqueCategories = React.useMemo(() => {
    if (!videos) return [];
    const categories = [...new Set(videos.map((v) => v.category))];
    console.log('📊 Unique categories found:', categories);
    return categories.sort();
  }, [videos]);

  // Get unique difficulties from existing videos
  const uniqueDifficulties = React.useMemo(() => {
    if (!videos) return [];
    const difficulties = [...new Set(videos.map((v) => v.difficulty))];
    console.log('📊 Unique difficulties found:', difficulties);
    return difficulties.sort();
  }, [videos]);

  // Debug: Log videos data
  React.useEffect(() => {
    if (videos) {
      console.log('🎬 Total videos loaded:', videos.length);
      console.log('🎬 Videos data:', videos);
    }
  }, [videos]);

  // Media library
  const allMedia = useQuery(api.media.getAllMedia);
  const uploadMedia = useMutation(api.media.uploadMedia);
  const deleteMedia = useMutation(api.media.deleteMedia);

  // Gallery Images
  const allGalleryImages = useQuery(api.galleryImages.getGalleryImages);
  const addGalleryImage = useMutation(api.galleryImages.addGalleryImage);
  const updateGalleryImage = useMutation(api.galleryImages.updateGalleryImage);
  const deleteGalleryImage = useMutation(api.galleryImages.deleteGalleryImage);

  // Schedule Images
  const allScheduleImages = useQuery(api.scheduleImages.getAllScheduleImages);
  const addScheduleImage = useMutation(api.scheduleImages.addScheduleImage);
  const updateScheduleImage = useMutation(api.scheduleImages.updateScheduleImage);
  const deleteScheduleImage = useMutation(api.scheduleImages.deleteScheduleImage);

  // Dan Photos
  const allDanPhotos = useQuery(api.danPhoto.getAllDanPhotos);
  const addDanPhoto = useMutation(api.danPhoto.addDanPhoto);
  const deleteDanPhoto = useMutation(api.danPhoto.deleteDanPhoto);

  // Hero Videos
  const allHeroVideos = useQuery(api.heroVideo.getAllHeroVideos);
  const uploadHeroVideo = useMutation(api.heroVideo.uploadHeroVideo);
  const updateHeroVideo = useMutation(api.heroVideo.updateHeroVideo);
  const deleteHeroVideo = useMutation(api.heroVideo.deleteHeroVideo);

  // Media upload state
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFilter, setMediaFilter] = useState('all'); // 'all', 'image', 'video'

  // Gallery state
  const [galleryForm, setGalleryForm] = useState({ url: '', altText: '' });
  const [editingGalleryId, setEditingGalleryId] = useState(null);

  // Schedule state
  const [scheduleForm, setScheduleForm] = useState({
    url: '',
    title: '',
    description: '',
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Dan Photo state
  const [danPhotoUrl, setDanPhotoUrl] = useState('');

  // Hero Video state
  const [heroVideoForm, setHeroVideoForm] = useState({ url: '', altText: '' });
  const [editingHeroVideoId, setEditingHeroVideoId] = useState(null);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted!', videoForm);
    console.log('📝 Custom category field:', customCategory);

    try {
      // Use custom category if provided, otherwise use dropdown selection
      const finalCategory = customCategory.trim() || videoForm.category;

      console.log('💾 Saving video with final category:', finalCategory);
      console.log('💾 Video data:', { ...videoForm, category: finalCategory });

      if (editingVideoId) {
        console.log('✏️ Updating video:', editingVideoId);
        await updateVideo({
          id: editingVideoId,
          ...videoForm,
          category: finalCategory,
        });
        alert(
          `✅ Video updated successfully!\nCategory: ${finalCategory}\nPremium: ${videoForm.isPremium ? 'Yes' : 'No'}`
        );
      } else {
        console.log('➕ Adding new video...');
        const result = await addVideo({
          ...videoForm,
          category: finalCategory,
        });
        console.log('✅ Video added successfully with ID:', result);
        alert(
          `✅ Video added successfully!\nCategory: ${finalCategory}\nPremium: ${videoForm.isPremium ? 'Yes' : 'No'}\n\nThe new category will appear in the dropdown now!`
        );
      }

      // Reset form
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 10,
        difficulty: 'beginner',
        category: 'wim-hof',
        isPremium: false,
        order: 1,
      });
      setCustomCategory('');
      setEditingVideoId(null);
    } catch (error) {
      console.error('❌ Error saving video:', error);
      alert('❌ Failed to save video: ' + error.message);
    }
  };

  const handleEditVideo = (video) => {
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      duration: video.duration,
      difficulty: video.difficulty,
      category: video.category,
      isPremium: video.isPremium,
      order: video.order,
    });
    setEditingVideoId(video._id);
    setAdminSection('videos');
  };

  const handleDeleteVideo = async (videoId) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo({ id: videoId });
        alert('Video deleted successfully!');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Failed to delete video.');
      }
    }
  };

  const handleMediaUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Check file size limit (2MB per file - Convex has document size limits)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    for (let file of files) {
      if (file.size > MAX_SIZE) {
        alert(
          `❌ File "${file.name}" is too large. Maximum size is 2MB.\n\nTip: Compress images before uploading or use smaller files.`
        );
        return;
      }
    }

    setUploadingMedia(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        try {
          await new Promise((resolve, reject) => {
            reader.onloadend = async () => {
              try {
                const fileData = reader.result;
                const fileType = file.type.startsWith('image/') ? 'image' : 'video';

                console.log(`Uploading ${file.name} (${(file.size / 1024).toFixed(1)}KB)...`);

                await uploadMedia({
                  fileName: file.name,
                  fileType: fileType,
                  mimeType: file.type,
                  fileSize: file.size,
                  url: fileData,
                  uploadedBy: 'admin',
                  tags: [],
                  description: '',
                });

                successCount++;
                console.log(`✅ ${file.name} uploaded successfully`);
                resolve();
              } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                failCount++;
                reject(error);
              }
            };

            reader.onerror = () => {
              failCount++;
              reject(new Error(`Failed to read ${file.name}`));
            };
            reader.readAsDataURL(file);
          });
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          // Continue with next file
        }
      }

      if (successCount > 0) {
        alert(
          `✅ ${successCount} file(s) uploaded successfully!${failCount > 0 ? ` (${failCount} failed)` : ''}`
        );
      } else {
        alert('❌ All uploads failed. Files may be too large or invalid.');
      }
      event.target.value = ''; // Reset input
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('❌ Upload failed: ' + error.message);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteMedia({ id: mediaId });
        alert('✅ File deleted successfully!');
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('❌ Failed to delete file.');
      }
    }
  };

  const getFilteredMedia = () => {
    if (!allMedia) return [];
    if (mediaFilter === 'all') return allMedia;
    return allMedia.filter((m) => m.fileType === mediaFilter);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Gallery handlers
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGalleryId) {
        await updateGalleryImage({
          id: editingGalleryId,
          url: galleryForm.url,
          altText: galleryForm.altText,
        });
        alert('✅ Gallery image updated!');
      } else {
        const order = (allGalleryImages?.length || 0) + 1;
        await addGalleryImage({
          url: galleryForm.url,
          order: order,
          altText: galleryForm.altText,
        });
        alert('✅ Gallery image added!');
      }
      setGalleryForm({ url: '', altText: '' });
      setEditingGalleryId(null);
    } catch (error) {
      console.error('Error saving gallery image:', error);
      alert('❌ Failed to save gallery image: ' + error.message);
    }
  };

  const handleDeleteGalleryImage = async (id) => {
    if (confirm('Are you sure you want to delete this gallery image?')) {
      try {
        await deleteGalleryImage({ id });
        alert('✅ Gallery image deleted!');
      } catch (error) {
        console.error('Error deleting gallery image:', error);
        alert('❌ Failed to delete gallery image.');
      }
    }
  };

  const handleSetActiveGalleryImage = async (id) => {
    try {
      await updateGalleryImage({ id, order: 1 });
      alert('✅ Gallery image set as primary!');
    } catch (error) {
      console.error('Error updating gallery image:', error);
      alert('❌ Failed to update gallery image.');
    }
  };

  // Schedule handlers
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingScheduleId) {
        await updateScheduleImage({
          id: editingScheduleId,
          url: scheduleForm.url,
          title: scheduleForm.title,
          description: scheduleForm.description,
        });
        alert('✅ Schedule image updated!');
      } else {
        await addScheduleImage({
          url: scheduleForm.url,
          title: scheduleForm.title,
          description: scheduleForm.description,
        });
        alert('✅ Schedule image added!');
      }
      setScheduleForm({ url: '', title: '', description: '' });
      setEditingScheduleId(null);
    } catch (error) {
      console.error('Error saving schedule image:', error);
      alert('❌ Failed to save schedule image: ' + error.message);
    }
  };

  const handleDeleteScheduleImage = async (id) => {
    if (confirm('Are you sure you want to delete this schedule image?')) {
      try {
        await deleteScheduleImage({ id });
        alert('✅ Schedule image deleted!');
      } catch (error) {
        console.error('Error deleting schedule image:', error);
        alert('❌ Failed to delete schedule image.');
      }
    }
  };

  const handleSetActiveSchedule = async (id) => {
    try {
      await updateScheduleImage({ id, isActive: true });
      alert('✅ Schedule set as active!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('❌ Failed to update schedule.');
    }
  };

  // Dan Photo handlers
  const handleDanPhotoSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDanPhoto({ url: danPhotoUrl });
      alert("✅ Dan's photo uploaded!");
      setDanPhotoUrl('');
    } catch (error) {
      console.error("Error uploading Dan's photo:", error);
      alert('❌ Failed to upload photo: ' + error.message);
    }
  };

  const handleDeleteDanPhoto = async (id) => {
    if (confirm('Are you sure you want to delete this photo?')) {
      try {
        await deleteDanPhoto({ id });
        alert('✅ Photo deleted!');
      } catch (error) {
        console.error('Error deleting photo:', error);
        alert('❌ Failed to delete photo.');
      }
    }
  };

  // Hero Video handlers
  const handleHeroVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHeroVideoId) {
        await updateHeroVideo({
          id: editingHeroVideoId,
          url: heroVideoForm.url,
          altText: heroVideoForm.altText,
        });
        alert('✅ Hero video updated!');
      } else {
        await uploadHeroVideo({
          url: heroVideoForm.url,
          altText: heroVideoForm.altText,
          isActive: true,
        });
        alert('✅ Hero video uploaded!');
      }
      setHeroVideoForm({ url: '', altText: '' });
      setEditingHeroVideoId(null);
    } catch (error) {
      console.error('Error saving hero video:', error);
      alert('❌ Failed to save hero video: ' + error.message);
    }
  };

  const handleDeleteHeroVideo = async (id) => {
    if (confirm('Are you sure you want to delete this hero video?')) {
      try {
        await deleteHeroVideo({ id });
        alert('✅ Hero video deleted!');
      } catch (error) {
        console.error('Error deleting hero video:', error);
        alert('❌ Failed to delete hero video.');
      }
    }
  };

  const handleSetActiveHeroVideo = async (id) => {
    try {
      await updateHeroVideo({ id, isActive: true });
      alert('✅ Hero video set as active!');
    } catch (error) {
      console.error('Error updating hero video:', error);
      alert('❌ Failed to update hero video.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-4 overflow-y-auto"
      onClick={handleAdminClose}
    >
      <div
        className="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/50 max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {!isAuthenticated ? (
          <>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🔐 Admin Login</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder={t.enterPassword}
              className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 mb-4"
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
            >
              {t.login}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-white mb-6 text-center">⚙️ Admin Panel</h3>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setAdminSection('media')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'media' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                📁 Media Library
              </button>
              <button
                onClick={() => setAdminSection('videos')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'videos' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                🎬 Videos
              </button>
              <button
                onClick={() => setAdminSection('schedule')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'schedule' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                📅 Schedule
              </button>
              <button
                onClick={() => setAdminSection('gallery')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'gallery' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                🖼️ Gallery
              </button>
              <button
                onClick={() => setAdminSection('danPhoto')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'danPhoto' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                👤 Dan's Photo
              </button>
              <button
                onClick={() => setAdminSection('heroVideo')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'heroVideo' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
              >
                🎥 Hero Video
              </button>
            </div>

            {/* Media Library Section */}
            {adminSection === 'media' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">📁 Media Library</h4>

                {/* Upload Section */}
                <div className="bg-white/5 p-6 rounded-2xl border-2 border-dashed border-cyan-400/30 hover:border-cyan-400 transition-all">
                  <label className="cursor-pointer block text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      disabled={uploadingMedia}
                      className="hidden"
                    />
                    <div className="py-8">
                      <div className="text-6xl mb-4">📤</div>
                      <h5 className="text-white font-bold text-xl mb-2">
                        {uploadingMedia ? 'Uploading...' : 'Upload Media Files'}
                      </h5>
                      <p className="text-blue-200 mb-4">Click to browse or drag and drop</p>
                      <p className="text-blue-300 text-sm">
                        Supports: Images (JPG, PNG, GIF) and Videos (MP4, MOV, etc.)
                      </p>
                      <p className="text-yellow-400 text-sm mt-2">
                        ⚠️ Maximum file size: 2MB per file
                      </p>
                      <p className="text-cyan-400 text-sm mt-1">📱 Works on mobile and desktop!</p>
                    </div>
                  </label>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMediaFilter('all')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${mediaFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200'}`}
                  >
                    All ({allMedia?.length || 0})
                  </button>
                  <button
                    onClick={() => setMediaFilter('image')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${mediaFilter === 'image' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200'}`}
                  >
                    🖼️ Images ({allMedia?.filter((m) => m.fileType === 'image').length || 0})
                  </button>
                  <button
                    onClick={() => setMediaFilter('video')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${mediaFilter === 'video' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200'}`}
                  >
                    🎥 Videos ({allMedia?.filter((m) => m.fileType === 'video').length || 0})
                  </button>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {getFilteredMedia().map((media) => (
                    <div
                      key={media._id}
                      className="bg-white/5 rounded-xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400 transition-all group"
                    >
                      {/* Preview */}
                      <div className="aspect-square bg-slate-800 relative">
                        {media.fileType === 'image' ? (
                          <img
                            src={media.url}
                            alt={media.fileName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl">🎥</div>
                          </div>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteMedia(media._id)}
                          className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        >
                          🗑️
                        </button>

                        {/* Copy URL Button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(media.url);
                            alert('✅ URL copied to clipboard!');
                          }}
                          className="absolute bottom-2 right-2 bg-cyan-500/80 hover:bg-cyan-500 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >
                          📋 Copy URL
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <p
                          className="text-white text-sm font-semibold truncate"
                          title={media.fileName}
                        >
                          {media.fileName}
                        </p>
                        <p className="text-blue-300 text-xs">{formatFileSize(media.fileSize)}</p>
                        <p className="text-blue-400 text-xs">
                          {new Date(media.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {getFilteredMedia().length === 0 && (
                  <div className="text-center py-12 text-blue-200">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-xl">No media files yet</p>
                    <p className="text-sm mt-2">Upload your first file above!</p>
                  </div>
                )}
              </div>
            )}

            {/* Videos Section */}
            {adminSection === 'videos' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">
                  {editingVideoId ? 'Edit Video' : 'Add New Video'}
                </h4>

                {/* Video Form */}
                <form onSubmit={handleVideoSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      placeholder="e.g., Wim Hof Breathing - Beginner"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      value={videoForm.description}
                      onChange={(e) =>
                        setVideoForm({
                          ...videoForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the breathing technique..."
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Video URL (YouTube/Vimeo) *
                    </label>
                    <input
                      type="url"
                      required
                      value={videoForm.videoUrl}
                      onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                      onBlur={(e) => {
                        const convertedUrl = convertToEmbedUrl(e.target.value);
                        if (convertedUrl !== e.target.value) {
                          setVideoForm({
                            ...videoForm,
                            videoUrl: convertedUrl,
                          });
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      Paste any YouTube or Vimeo URL - it will be automatically converted to embed
                      format
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Thumbnail URL (optional)
                    </label>
                    <input
                      type="url"
                      value={videoForm.thumbnailUrl}
                      onChange={(e) =>
                        setVideoForm({
                          ...videoForm,
                          thumbnailUrl: e.target.value,
                        })
                      }
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={videoForm.duration}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            duration: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Order *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={videoForm.order}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            order: parseInt(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Difficulty *
                      </label>
                      <select
                        value={videoForm.difficulty}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            difficulty: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        {/* Default difficulties */}
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>

                        {/* Additional difficulties from existing videos */}
                        {uniqueDifficulties
                          .filter(
                            (diff) => !['beginner', 'intermediate', 'advanced'].includes(diff)
                          )
                          .map((diff) => (
                            <option key={diff} value={diff}>
                              {diff.charAt(0).toUpperCase() + diff.slice(1)}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">
                        Category *
                      </label>
                      <select
                        value={videoForm.category}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        {/* Default categories */}
                        <option value="wim-hof">Wim Hof Method</option>
                        <option value="box-breathing">Box Breathing</option>
                        <option value="4-7-8">4-7-8 Technique</option>
                        <option value="pranayama">Pranayama</option>
                        <option value="beginner">Beginner Friendly</option>

                        {/* Additional categories from existing videos */}
                        {uniqueCategories
                          .filter(
                            (cat) =>
                              ![
                                'wim-hof',
                                'box-breathing',
                                '4-7-8',
                                'pranayama',
                                'beginner',
                              ].includes(cat)
                          )
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat
                                .split('-')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Custom Category (Optional)
                      {customCategory && (
                        <span className="ml-2 text-cyan-400">✓ Will use: "{customCategory}"</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g., breathwork, meditation, relaxation..."
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      💡 Type a new category name here to create a custom category. Leave empty to
                      use the dropdown selection above.
                    </p>
                    {customCategory && (
                      <p className="text-cyan-400 text-xs mt-1 font-semibold">
                        ✓ This video will be saved with category: "{customCategory}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={videoForm.isPremium}
                      onChange={(e) =>
                        setVideoForm({
                          ...videoForm,
                          isPremium: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-cyan-400/30 bg-white/10"
                    />
                    <label htmlFor="isPremium" className="text-white font-semibold">
                      👑 Premium Video (Requires Subscription)
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                    >
                      {editingVideoId ? '💾 Update Video' : '➕ Add Video'}
                    </button>
                    {editingVideoId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVideoId(null);
                          setVideoForm({
                            title: '',
                            description: '',
                            videoUrl: '',
                            thumbnailUrl: '',
                            duration: 10,
                            difficulty: 'beginner',
                            category: 'wim-hof',
                            isPremium: false,
                            order: 1,
                          });
                        }}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Debug Info */}
                {videos && videos.length > 0 && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                    <h5 className="text-blue-200 font-semibold mb-2">📊 Database Stats</h5>
                    <div className="text-blue-100 text-sm space-y-1">
                      <p>• Total Videos: {videos.length}</p>
                      <p>
                        • Categories Found:{' '}
                        <span className="font-bold text-cyan-300">{uniqueCategories.length}</span>
                      </p>
                      <p className="pl-4">
                        → {uniqueCategories.map((cat) => `"${cat}"`).join(', ') || 'None'}
                      </p>
                      <p>• Difficulties: {uniqueDifficulties.join(', ') || 'None'}</p>
                      <p>• Premium Videos: {videos.filter((v) => v.isPremium).length}</p>
                      <p className="text-yellow-300 mt-2">
                        💡 These categories will appear in the dropdown above
                      </p>
                    </div>
                  </div>
                )}

                {/* Videos List */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white">
                    Existing Videos ({videos?.length || 0})
                  </h4>
                  {videos?.map((video) => (
                    <div
                      key={video._id}
                      className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-white font-semibold">{video.title}</h5>
                            {video.isPremium && (
                              <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">
                                👑 Premium
                              </span>
                            )}
                            {!video.isPublished && (
                              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                                📝 Draft
                              </span>
                            )}
                          </div>
                          <p className="text-blue-200 text-sm mb-2">{video.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">
                              {video.duration} min
                            </span>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full capitalize">
                              {video.difficulty}
                            </span>
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                              {video.category}
                            </span>
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                              👁️ {video.views} views
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditVideo(video)}
                            className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
                            className="px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {videos?.length === 0 && (
                    <div className="text-center py-8 text-blue-200">
                      <div className="text-4xl mb-2">🎬</div>
                      <p>No videos yet. Add your first video above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedule Section */}
            {adminSection === 'schedule' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">
                  {editingScheduleId ? 'Edit Schedule' : 'Add New Schedule'}
                </h4>

                {/* Schedule Form */}
                <form
                  onSubmit={handleScheduleSubmit}
                  className="space-y-4 bg-white/5 p-6 rounded-2xl"
                >
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={scheduleForm.url}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/schedule.jpg or paste from Media Library"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      💡 Tip: Upload to Media Library first, then copy URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={scheduleForm.title}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="e.g., Weekly Schedule"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={scheduleForm.description}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Additional details..."
                      rows="2"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                    >
                      {editingScheduleId ? '💾 Update Schedule' : '➕ Add Schedule'}
                    </button>
                    {editingScheduleId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingScheduleId(null);
                          setScheduleForm({
                            url: '',
                            title: '',
                            description: '',
                          });
                        }}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Schedules List */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white">
                    All Schedules ({allScheduleImages?.length || 0})
                  </h4>
                  {allScheduleImages?.map((schedule) => (
                    <div
                      key={schedule._id}
                      className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={schedule.url}
                          alt={schedule.title}
                          className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400/30"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-white font-semibold">{schedule.title}</h5>
                            {schedule.isActive && (
                              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                                ✓ Active
                              </span>
                            )}
                          </div>
                          {schedule.description && (
                            <p className="text-blue-200 text-sm mb-2">{schedule.description}</p>
                          )}
                          <div className="flex gap-2 mt-3">
                            {!schedule.isActive && (
                              <button
                                onClick={() => handleSetActiveSchedule(schedule._id)}
                                className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm"
                              >
                                ✓ Set Active
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setScheduleForm({
                                  url: schedule.url,
                                  title: schedule.title,
                                  description: schedule.description || '',
                                });
                                setEditingScheduleId(schedule._id);
                              }}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteScheduleImage(schedule._id)}
                              className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {allScheduleImages?.length === 0 && (
                    <div className="text-center py-8 text-blue-200">
                      <div className="text-4xl mb-2">📅</div>
                      <p>No schedules yet. Add your first schedule above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery Section */}
            {adminSection === 'gallery' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">
                  {editingGalleryId ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </h4>

                {/* Gallery Form */}
                <form
                  onSubmit={handleGallerySubmit}
                  className="space-y-4 bg-white/5 p-6 rounded-2xl"
                >
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      placeholder="https://example.com/image.jpg or paste from Media Library"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      💡 Tip: Upload to Media Library first, then copy URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Alt Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={galleryForm.altText}
                      onChange={(e) =>
                        setGalleryForm({
                          ...galleryForm,
                          altText: e.target.value,
                        })
                      }
                      placeholder="Describe the image..."
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                    >
                      {editingGalleryId ? '💾 Update Image' : '➕ Add Image'}
                    </button>
                    {editingGalleryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGalleryId(null);
                          setGalleryForm({ url: '', altText: '' });
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
                    All Gallery Images ({allGalleryImages?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allGalleryImages?.map((image) => (
                      <div
                        key={image._id}
                        className="relative group bg-white/5 rounded-xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                      >
                        <img
                          src={image.url}
                          alt={image.altText || 'Gallery image'}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          #{image.order}
                        </div>
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          <button
                            onClick={() => {
                              setGalleryForm({
                                url: image.url,
                                altText: image.altText || '',
                              });
                              setEditingGalleryId(image._id);
                            }}
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryImage(image._id)}
                            className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                        {image.altText && (
                          <div className="p-2 bg-black/50">
                            <p className="text-white text-xs truncate">{image.altText}</p>
                          </div>
                        )}
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
            )}

            {/* Dan's Photo Section */}
            {adminSection === 'danPhoto' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">Add Dan's Photo</h4>

                {/* Dan Photo Form */}
                <form
                  onSubmit={handleDanPhotoSubmit}
                  className="space-y-4 bg-white/5 p-6 rounded-2xl"
                >
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Photo URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={danPhotoUrl}
                      onChange={(e) => setDanPhotoUrl(e.target.value)}
                      placeholder="https://example.com/dan-photo.jpg or paste from Media Library"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      💡 Tip: Upload to Media Library first, then copy URL
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                  >
                    ➕ Add Photo
                  </button>
                </form>

                {/* Dan Photos List */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white">
                    All Dan's Photos ({allDanPhotos?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allDanPhotos?.map((photo) => (
                      <div
                        key={photo._id}
                        className="relative group bg-white/5 rounded-xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                      >
                        <img
                          src={photo.url}
                          alt="Dan's photo"
                          className="w-full h-48 object-cover"
                        />
                        {photo.isActive && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ✓ Active
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          <button
                            onClick={() => handleDeleteDanPhoto(photo._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
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
                      <p>No photos yet. Add Dan's first photo above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hero Video Section */}
            {adminSection === 'heroVideo' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">
                  {editingHeroVideoId ? 'Edit Hero Video' : 'Add New Hero Video'}
                </h4>

                {/* Hero Video Form */}
                <form
                  onSubmit={handleHeroVideoSubmit}
                  className="space-y-4 bg-white/5 p-6 rounded-2xl"
                >
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm font-semibold mb-2">
                      💡 Tips for Hero Videos
                    </p>
                    <p className="text-yellow-100 text-xs">
                      • Use MP4 format, H.264 codec
                      <br />• Keep video under 5 seconds for best results
                      <br />• Upload to Media Library first, then copy URL
                      <br />• Recommended resolution: 720x720 or smaller
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={heroVideoForm.url}
                      onChange={(e) =>
                        setHeroVideoForm({
                          ...heroVideoForm,
                          url: e.target.value,
                        })
                      }
                      placeholder="https://example.com/hero-video.mp4 or paste from Media Library"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">
                      💡 Tip: Upload to Media Library first, then copy URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Alt Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={heroVideoForm.altText}
                      onChange={(e) =>
                        setHeroVideoForm({
                          ...heroVideoForm,
                          altText: e.target.value,
                        })
                      }
                      placeholder="Describe the video..."
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                    >
                      {editingHeroVideoId ? '💾 Update Video' : '➕ Add Video'}
                    </button>
                    {editingHeroVideoId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHeroVideoId(null);
                          setHeroVideoForm({ url: '', altText: '' });
                        }}
                        className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                {/* Hero Videos List */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white">
                    All Hero Videos ({allHeroVideos?.length || 0})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {allHeroVideos?.map((video) => (
                      <div
                        key={video._id}
                        className="relative group bg-white/5 rounded-xl overflow-hidden border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
                      >
                        <video autoPlay loop muted playsInline className="w-full h-40 object-cover">
                          <source src={video.url} type="video/mp4" />
                        </video>
                        {video.isActive && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            ✓ Active
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          {!video.isActive && (
                            <button
                              onClick={() => handleSetActiveHeroVideo(video._id)}
                              className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
                            >
                              ✓ Set Active
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setHeroVideoForm({
                                url: video.url,
                                altText: video.altText || '',
                              });
                              setEditingHeroVideoId(video._id);
                            }}
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHeroVideo(video._id)}
                            className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                        {video.altText && (
                          <div className="p-2 bg-black/50">
                            <p className="text-white text-xs truncate">{video.altText}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {allHeroVideos?.length === 0 && (
                    <div className="text-center py-8 text-blue-200">
                      <div className="text-4xl mb-2">🎥</div>
                      <p>No hero videos yet. Add your first video above!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleAdminClose}
              className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
            >
              ✓ Close & Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
