import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

// Navigation ID for this section - must be static for anchor links to work
const GALLERY_SECTION_ID = 'gallery';

const GalleryDebug = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGalleryImages() {
      try {
        console.log('🖼️ DEBUG: Loading gallery images directly from Supabase...');
        setError(null);
        
        // Direct Supabase call - bypassing API layer for debugging
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        console.log('📸 DEBUG: Gallery images loaded directly:', data);
        setGalleryImages(data || []);
      } catch (error) {
        console.error('❌ DEBUG: Error loading gallery images:', error);
        setError(error.message);
        setGalleryImages([]);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryImages();
  }, []);

  return (
    <div
      id={GALLERY_SECTION_ID}
      className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"
    >
      <div className="max-w-6xl mx-auto">
        {/* Debug Info */}
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Debug Info:</h3>
          <p className="text-green-400">Loading: {loading ? 'Yes' : 'No'}</p>
          <p className="text-red-400">Error: {error || 'None'}</p>
          <p className="text-blue-400">Images Count: {galleryImages.length}</p>
          <p className="text-purple-400">Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
          Gallery (DEBUG)
        </h2>
        <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4 scroll-reveal">
          See our cold therapy sessions in action and meet our community
        </p>

        {loading ? (
          <div className="text-center py-12 text-blue-200">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-xl">Loading gallery...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-200">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-xl mb-4">Error loading gallery</p>
            <p className="text-sm mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        ) : galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 scroll-reveal">
            {galleryImages
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div
                  key={image.id}
                  className="relative group overflow-hidden rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500"
                >
                  <img
                    src={image.url}
                    alt={image.alt_text || 'Gallery image'}
                    className="w-full h-64 sm:h-72 object-cover"
                    loading="lazy"
                    onLoad={() => console.log('✅ Image loaded:', image.url)}
                    onError={() => console.log('❌ Image failed:', image.url)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.alt_text && (
                        <p className="text-white text-sm font-medium">{image.alt_text}</p>
                      )}
                    </div>
                  </div>
                  {/* Debug overlay */}
                  <div className="absolute top-0 left-0 bg-black/70 text-xs p-2 text-green-400">
                    ID: {image.id.substring(0, 8)}...
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-blue-200 scroll-reveal">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-xl mb-2">No Gallery Images Found</p>
            <p className="text-base">Check the database for gallery_images data!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryDebug;
