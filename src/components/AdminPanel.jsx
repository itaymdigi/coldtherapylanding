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
    handleImageUpload,
    handleLogin,
    handleAdminClose,
  } = useApp();

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

  // Convex queries and mutations
  const videos = useQuery(api.breathingVideos.getAllVideos);
  const addVideo = useMutation(api.breathingVideos.addVideo);
  const updateVideo = useMutation(api.breathingVideos.updateVideo);
  const deleteVideo = useMutation(api.breathingVideos.deleteVideo);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use custom category if provided
      const finalCategory = customCategory.trim() || videoForm.category;
      
      if (editingVideoId) {
        await updateVideo({
          id: editingVideoId,
          ...videoForm,
          category: finalCategory,
        });
      } else {
        await addVideo({
          ...videoForm,
          category: finalCategory,
        });
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
      alert('Video saved successfully! ✅');
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Failed to save video. Please try again.');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-4 overflow-y-auto" onClick={handleAdminClose}>
      <div className="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/50 max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
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
            </div>

            {/* Videos Section */}
            {adminSection === 'videos' && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <h4 className="text-2xl font-semibold text-white mb-4">
                  {editingVideoId ? 'Edit Video' : 'Add New Video'}
                </h4>
                
                {/* Video Form */}
                <form onSubmit={handleVideoSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Video Title *</label>
                    <input
                      type="text"
                      required
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                      placeholder="e.g., Wim Hof Breathing - Beginner"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Description *</label>
                    <textarea
                      required
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                      placeholder="Describe the breathing technique..."
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Video URL (YouTube/Vimeo Embed) *</label>
                    <input
                      type="url"
                      required
                      value={videoForm.videoUrl}
                      onChange={(e) => setVideoForm({...videoForm, videoUrl: e.target.value})}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">Use embed URL, not watch URL</p>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Thumbnail URL (optional)</label>
                    <input
                      type="url"
                      value={videoForm.thumbnailUrl}
                      onChange={(e) => setVideoForm({...videoForm, thumbnailUrl: e.target.value})}
                      placeholder="https://example.com/thumbnail.jpg"
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Duration (minutes) *</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={videoForm.duration}
                        onChange={(e) => setVideoForm({...videoForm, duration: parseInt(e.target.value)})}
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
                        onChange={(e) => setVideoForm({...videoForm, order: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Difficulty *</label>
                      <select
                        value={videoForm.difficulty}
                        onChange={(e) => setVideoForm({...videoForm, difficulty: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Category *</label>
                      <select
                        value={videoForm.category}
                        onChange={(e) => setVideoForm({...videoForm, category: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="wim-hof">Wim Hof Method</option>
                        <option value="box-breathing">Box Breathing</option>
                        <option value="4-7-8">4-7-8 Technique</option>
                        <option value="pranayama">Pranayama</option>
                        <option value="beginner">Beginner Friendly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">Custom Category (Optional)</label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category name..."
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                    />
                    <p className="text-blue-300 text-xs mt-1">Leave empty to use selected category above</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={videoForm.isPremium}
                      onChange={(e) => setVideoForm({...videoForm, isPremium: e.target.checked})}
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

                {/* Videos List */}
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-white">Existing Videos ({videos?.length || 0})</h4>
                  {videos?.map((video) => (
                    <div key={video._id} className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="text-white font-semibold">{video.title}</h5>
                            {video.isPremium && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">👑 Premium</span>}
                            {!video.isPublished && <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">📝 Draft</span>}
                          </div>
                          <p className="text-blue-200 text-sm mb-2">{video.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full">{video.duration} min</span>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full capitalize">{video.difficulty}</span>
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">{video.category}</span>
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full">👁️ {video.views} views</span>
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
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white mb-4">Upload Event Schedule</h4>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'schedule')}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                />
                {scheduleImage && (
                  <div className="mt-4">
                    <img src={scheduleImage} alt="Schedule Preview" className="w-full rounded-lg border-2 border-cyan-400/30" />
                  </div>
                )}
              </div>
            )}

            {/* Gallery Section */}
            {adminSection === 'gallery' && (
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white mb-4">Upload Gallery Images</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-40 object-cover rounded-lg border-2 border-cyan-400/30"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg">
                        <span className="text-white font-semibold">📷 Change</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'gallery', index)}
                          className="hidden"
                        />
                      </label>
                      <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dan's Photo Section */}
            {adminSection === 'danPhoto' && (
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white mb-4">Upload Dan's Photo</h4>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'danPhoto')}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                />
                {danPhoto && (
                  <div className="mt-4">
                    <img src={danPhoto} alt="Dan Preview" className="w-full max-w-md mx-auto rounded-lg border-2 border-cyan-400/30" />
                  </div>
                )}
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
