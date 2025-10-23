import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

// Navigation ID for this section - must be static for anchor links to work
const GALLERY_SECTION_ID = 'gallery';

const Gallery = () => {
  const galleryImages = useQuery(api.galleryImages.getGalleryImages);

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

        {galleryImages && galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 scroll-reveal">
            {galleryImages
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <div
                  key={image._id}
                  className="relative group overflow-hidden rounded-2xl border-2 border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500"
                >
                  <img
                    src={image.url}
                    alt={image.altText || 'Gallery image'}
                    className="w-full h-64 sm:h-72 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.altText && (
                        <p className="text-white text-sm font-medium">{image.altText}</p>
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
