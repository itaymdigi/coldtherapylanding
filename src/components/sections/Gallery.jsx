import { useEffect, useState } from 'react';
import { getGalleryImages } from '../../api/galleryImages';

// Navigation ID for this section - must be static for anchor links to work
const GALLERY_SECTION_ID = 'gallery';

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGalleryImages() {
      try {
        console.log('🖼️ Loading gallery images...');
        setError(null);
        
        // Force fresh data by making direct API call with timestamp
        const timestamp = Date.now();
        console.log('🕐 Fetching with timestamp:', timestamp);
        
        const images = await getGalleryImages();
        console.log('📸 Gallery images loaded:', images);
        
        // Debug: Log actual URLs from Supabase
        if (images && images.length > 0) {
          console.log('🔗 Image URLs from Supabase:', images.map(img => img.url));
          console.log('🔍 First image details:', images[0]);
        }
        
        // ALWAYS use Supabase data if available
        if (images && images.length > 0) {
          console.log('✅ Using Supabase data');
          setGalleryImages(images);
        } else {
          console.log('⚠️ No images from Supabase, using fallback');
          setGalleryImages([
            { id: '1', url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&auto=format&q=80', alt_text: 'Cold therapy session in progress' },
            { id: '2', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format&q=80', alt_text: 'Ice bath preparation' }
          ]);
        }
      } catch (error) {
        console.error('❌ Error loading gallery images:', error);
        setError(error.message);
        setGalleryImages([]); // Set empty array on error to prevent undefined issues
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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
          Gallery
        </h2>
        <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4 scroll-reveal">
          See our cold therapy sessions in action and meet our community
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 scroll-reveal">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/30"
              >
                <div className="w-full h-64 sm:h-72 bg-gradient-to-br from-cyan-900/50 to-blue-900/50 animate-pulse">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-4xl text-cyan-400/50">🖼️</div>
                  </div>
                </div>
              </div>
            ))}
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
                    onLoad={(e) => {
                      console.log('✅ Image loaded successfully:', image.url);
                      e.target.style.opacity = '1';
                    }}
                    onError={(e) => {
                      console.log('❌ Image failed to load, using fallback:', image.url);
                      // Use a reliable fallback image
                      e.target.src = `https://picsum.photos/seed/${image.id}/800/600.jpg`;
                      e.target.onerror = () => {
                        // Ultimate fallback
                        e.target.src = 'https://via.placeholder.com/800x600/0ea5e9/ffffff?text=Cold+Therapy';
                      };
                    }}
                    style={{ opacity: '0', transition: 'opacity 0.3s ease-in-out' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.alt_text && (
                        <p className="text-white text-sm font-medium">{image.alt_text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 text-blue-200 scroll-reveal">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-xl mb-2">Gallery Coming Soon</p>
            <p className="text-base">Check back soon to see our cold therapy sessions and community photos!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
