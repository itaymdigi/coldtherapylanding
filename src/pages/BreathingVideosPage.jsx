import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { api } from '../../convex/_generated/api';
import { useApp } from '../contexts/AppContext';

const BreathingVideosPage = () => {
  const { t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userEmail, setUserEmail] = useState(''); // In real app, get from auth

  // Helper function to ensure URL is in embed format with sound enabled
  const ensureEmbedUrl = (url) => {
    if (!url) return url;

    // If already an embed URL, ensure it doesn't have mute parameter
    if (url.includes('/embed/')) {
      // Remove mute parameter if present and ensure autoplay is enabled
      const cleanUrl = url.replace(/[?&]mute=1/, '').replace(/[?&]muted=1/, '');
      const separator = cleanUrl.includes('?') ? '&' : '?';
      return `${cleanUrl}${separator}autoplay=1`;
    }

    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && !url.includes('player.vimeo.com')) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return url;
  };

  // Fetch videos and subscription
  const allVideos = useQuery(api.breathingVideos.getAllVideos);
  const freeVideos = useQuery(api.breathingVideos.getFreeVideos);
  const premiumVideos = useQuery(api.breathingVideos.getPremiumVideos);
  const subscription = useQuery(
    api.subscriptions.checkSubscription,
    userEmail ? { userEmail } : 'skip'
  );

  const hasActiveSubscription = subscription?.status === 'active';

  // Get unique categories from all videos dynamically
  const uniqueCategories = React.useMemo(() => {
    if (!allVideos) return [];
    const cats = [...new Set(allVideos.map((v) => v.category))];
    return cats.sort();
  }, [allVideos]);

  // Default categories with translations
  const defaultCategories = [
    { id: 'all', name: t.allVideos, emoji: '🎬' },
    { id: 'wim-hof', name: t.categoryWimHof, emoji: '❄️' },
    { id: 'box-breathing', name: t.categoryBoxBreathing, emoji: '📦' },
    { id: '4-7-8', name: t.category478, emoji: '🌙' },
    { id: 'pranayama', name: t.categoryPranayama, emoji: '🧘' },
    { id: 'beginner', name: t.categoryBeginnerFriendly, emoji: '🌱' },
  ];

  // Add custom categories from database
  const customCategories = uniqueCategories
    .filter((cat) => !['wim-hof', 'box-breathing', '4-7-8', 'pranayama', 'beginner'].includes(cat))
    .map((cat) => ({
      id: cat,
      name: cat
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      emoji: '🎯',
    }));

  const categories = [...defaultCategories, ...customCategories];

  const getFilteredVideos = () => {
    if (!allVideos) return [];
    if (selectedCategory === 'all') return allVideos;
    // Filter by category only
    const filtered = allVideos.filter((v) => v.category === selectedCategory);
    console.log(`🔍 Filtering by category: "${selectedCategory}"`);
    console.log(`📊 Found ${filtered.length} videos in this category`);
    return filtered;
  };

  const filteredVideos = getFilteredVideos();

  // Debug: Log when category changes
  React.useEffect(() => {
    console.log('🎯 Selected category changed to:', selectedCategory);
    console.log('📹 Total videos available:', allVideos?.length || 0);
    console.log('📹 Filtered videos:', filteredVideos.length);
  }, [selectedCategory, allVideos]);

  const VideoCard = ({ video }) => {
    const isLocked = video.isPremium && !hasActiveSubscription;

    return (
      <div
        onClick={() => !isLocked && setSelectedVideo(video)}
        className={`group relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg rounded-3xl border-2 border-cyan-400/30 overflow-hidden transition-all duration-500 ${
          isLocked
            ? 'cursor-not-allowed opacity-75'
            : 'cursor-pointer hover:border-cyan-400 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">🌬️</div>
            </div>
          )}

          {/* Premium Badge */}
          {video.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
              <span>👑</span> PREMIUM
            </div>
          )}

          {/* Lock Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-2">🔒</div>
                <p className="text-white font-semibold">Subscribe to Unlock</p>
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-3 left-3 bg-black/70 px-3 py-1 rounded-full text-white text-sm font-semibold">
            {video.duration} min
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {video.title}
            </h3>
            <span className="text-2xl">{getCategoryEmoji(video.category)}</span>
          </div>

          <p className="text-blue-200 text-sm mb-4 line-clamp-2">{video.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  video.difficulty === 'beginner'
                    ? 'bg-green-500/20 text-green-300'
                    : video.difficulty === 'intermediate'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                }`}
              >
                {video.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2 text-blue-300 text-sm">
              <span>👁️</span>
              <span>{video.views}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'wim-hof': '❄️',
      'box-breathing': '📦',
      '4-7-8': '🌙',
      pranayama: '🧘',
      beginner: '🌱',
    };
    return emojiMap[category] || '🌬️';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Guided Breathing Videos
          </h1>
          <p className="text-xl text-blue-200 mb-8">
            Master breathwork techniques with expert-led video guides
          </p>

          {/* Subscription Status */}
          {hasActiveSubscription ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full text-white font-semibold">
              <span>✓</span> Premium Member
            </div>
          ) : (
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
              🚀 Upgrade to Premium
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12 relative z-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Category button clicked:', cat.id);
                setSelectedCategory(cat.id);
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white scale-110'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
              style={{ pointerEvents: 'auto' }}
            >
              <span className="mr-2">{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-cyan-900/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{allVideos?.length || 0}</div>
            <div className="text-blue-200 text-sm">Total Videos</div>
          </div>
          <div className="bg-cyan-900/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{freeVideos?.length || 0}</div>
            <div className="text-blue-200 text-sm">Free Videos</div>
          </div>
          <div className="bg-cyan-900/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {premiumVideos?.length || 0}
            </div>
            <div className="text-blue-200 text-sm">Premium Videos</div>
          </div>
          <div className="bg-cyan-900/20 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">
              +{uniqueCategories.length}
            </div>
            <div className="text-blue-200 text-sm">Categories</div>
          </div>
        </div>

        {/* Current Filter Info */}
        {selectedCategory !== 'all' && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 text-center">
            <p className="text-blue-200">
              Showing <span className="font-bold text-cyan-400">{filteredVideos.length}</span> video
              {filteredVideos.length !== 1 ? 's' : ''} in category:
              <span className="font-bold text-white ml-2">
                "{categories.find((c) => c.id === selectedCategory)?.name}"
              </span>
            </p>
          </div>
        )}

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos?.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>

        {filteredVideos?.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-xl text-blue-200">No videos found in this category</p>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute -top-12 right-0 text-white text-4xl hover:text-cyan-400 transition-colors"
              >
                ✕
              </button>

              <div className="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/50 overflow-hidden">
                {/* Video Player */}
                <div className="aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={ensureEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>

                {/* Video Info */}
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-white mb-4">{selectedVideo.title}</h2>
                  <p className="text-blue-100 text-lg mb-6">{selectedVideo.description}</p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-blue-200">
                      <span>⏱️</span>
                      <span>{selectedVideo.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <span>📊</span>
                      <span className="capitalize">{selectedVideo.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-200">
                      <span>👁️</span>
                      <span>{selectedVideo.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingVideosPage;
