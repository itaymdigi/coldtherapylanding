import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import * as api from '../../api';
import { useApp } from '../../contexts/AppContext';

// Component to display image from Convex storage
const StorageImage = ({ storageId, alt, className }) => {
  const [imageKey, setImageKey] = useState(`${storageId}-${Date.now()}`);

  // Check if it's already a full URL or data URI or relative path
  const isDirectUrl = storageId && (storageId.startsWith('data:') || storageId.startsWith('http') || storageId.startsWith('/'));

  // For Supabase, images are direct URLs, no need to query
  const imageUrl = null; // Not needed with Supabase

  // Force image reload when storageId changes
  useEffect(() => {
    setImageKey(`${storageId}-${Date.now()}`);
  }, [storageId]);

  // No storage ID provided
  if (!storageId) {
    return (
      <div
        className={`${className} bg-gray-700 flex items-center justify-center text-white/50 text-xs`}
      >
        No image
      </div>
    );
  }

  // If it's already a URL (data URI, http, or relative path), use it directly
  if (isDirectUrl) {
    // Add cache-busting parameter for HTTP URLs and relative paths
    const cacheBustedUrl = (storageId.startsWith('http') || storageId.startsWith('/'))
      ? `${storageId}${storageId.includes('?') ? '&' : '?'}cb=${storageId.split('/').pop()}&t=${imageKey.split('-').pop()}`
      : storageId;

    return (
      <img
        key={imageKey}
        src={cacheBustedUrl}
        alt={alt}
        className={className}
        onLoad={(e) => {
          // Image loaded successfully - ensure it's visible and remove any error messages
          e.target.style.display = 'block';

          // Remove any error divs that might have been created
          const parent = e.target.parentElement;
          const errorDivs = parent.querySelectorAll('[class*="bg-red-"], [class*="bg-gray-8"]');
          errorDivs.forEach((div) => {
            if (
              div.textContent.includes('Failed to load') ||
              div.textContent.includes('No image')
            ) {
              div.remove();
            }
          });
        }}
        onError={(e) => {
          console.error('Failed to load image:', storageId, e);
          // Hide the broken image
          e.target.style.display = 'none';

          // Create and show error message
          const errorDiv = document.createElement('div');
          errorDiv.className =
            'w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/70 text-sm border-2 border-red-500/30 rounded-lg';
          errorDiv.innerHTML = `
            <div class="text-center p-4">
              <div class="text-red-400 text-2xl mb-2">⚠️</div>
              <div class="text-sm">Failed to load image</div>
              <div class="text-xs text-gray-400 mt-1">${alt || 'Instructor photo'}</div>
            </div>
          `;
          e.target.parentElement.appendChild(errorDiv);
        }}
      />
    );
  }

  // Loading from Convex storage
  if (imageUrl === undefined) {
    return (
      <div
        className={`${className} bg-gray-700 flex items-center justify-center text-white/50 text-xs`}
      >
        Loading...
      </div>
    );
  }

  // Failed to get URL from Convex
  if (!imageUrl) {
    return (
      <div
        className={`${className} bg-red-900/50 flex items-center justify-center text-white/70 text-xs p-2`}
      >
        Error: Invalid storage ID
      </div>
    );
  }

  // Successfully got URL from Convex
  // Add cache-busting parameter to force reload
  const cacheBustedUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cb=${storageId}&t=${imageKey.split('-').pop()}`;

  return (
    <img
      key={imageKey}
      src={cacheBustedUrl}
      alt={alt}
      className={className}
      onLoad={(e) => {
        // Image loaded successfully - ensure it's visible and remove any error messages
        e.target.style.display = 'block';

        // Remove any error divs that might have been created
        const parent = e.target.parentElement;
        const errorDivs = parent.querySelectorAll('[class*="bg-red-"], [class*="bg-gray-8"]');
        errorDivs.forEach((div) => {
          if (div.textContent.includes('Failed to load') || div.textContent.includes('No image')) {
            div.remove();
          }
        });
      }}
      onError={(e) => {
        console.error('Failed to load Convex image:', imageUrl, e);
        // Hide the broken image
        e.target.style.display = 'none';

        // Create and show error message
        const errorDiv = document.createElement('div');
        errorDiv.className =
          'w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white/70 text-sm border-2 border-red-500/30 rounded-lg';
        errorDiv.innerHTML = `
          <div class="text-center p-4">
            <div class="text-red-400 text-2xl mb-2">⚠️</div>
            <div class="text-sm">Failed to load image</div>
            <div class="text-xs text-gray-400 mt-1">${alt || 'Instructor photo'}</div>
          </div>
        `;
        e.target.parentElement.appendChild(errorDiv);
      }}
    />
  );
};

// Default placeholder image as data URI (no external network call)
const DEFAULT_INSTRUCTOR_PHOTO =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23334155;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e293b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="800" height="600"/%3E%3Ccircle cx="400" cy="250" r="80" fill="%2306b6d4" opacity="0.3"/%3E%3Ctext fill="%23fff" font-family="Arial, sans-serif" font-size="28" font-weight="bold" x="50%25" y="45%25" text-anchor="middle" dy=".3em"%3EInstructor%3C/text%3E%3Ctext fill="%2306b6d4" font-family="Arial, sans-serif" font-size="16" x="50%25" y="55%25" text-anchor="middle" dy=".3em"%3EPhoto Coming Soon%3C/text%3E%3C/svg%3E';

const OurInstructors = () => {
  const { t } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const modalTitleId = useId();

  // Query instructors from Supabase
  const [instructors, setInstructors] = useState(undefined);
  
  useEffect(() => {
    async function loadInstructors() {
      try {
        const data = await api.getAllInstructors();
        setInstructors(data);
      } catch (error) {
        console.error('Error loading instructors:', error);
        setInstructors([]);
      }
    }
    loadInstructors();
  }, []);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedInstructor) {
        setSelectedInstructor(null);
      }
    };

    if (selectedInstructor) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedInstructor]);

  // Handle loading state - don't render anything while loading
  if (instructors === undefined) {
    return null;
  }

  // Sort instructors by order
  const sortedInstructors = [...(instructors || [])].sort((a, b) => a.order - b.order);
  const currentInstructor = sortedInstructors[currentIndex] || null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedInstructors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedInstructors.length) % sortedInstructors.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (sortedInstructors.length === 0) {
    console.log('No instructors to display');
    return (
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
              {t.ourInstructorsTitle || 'המדריכים שלנו'}
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {t.noInstructorsYet || 'בקרוב יתווספו מדריכים נוספים'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="instructors" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            {t.ourInstructorsTitle || 'המדריכים שלנו'}
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
            {t.ourInstructorsSubtitle || 'צוות מומחים מוסמכים המוקדשים להדרכתך בטיפול בקור'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {currentInstructor && (
            <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10" style={{ minHeight: '420px' }}>
              <button
                type="button"
                onClick={() => setSelectedInstructor(currentInstructor)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedInstructor(currentInstructor);
                  }
                }}
                className="group w-full text-left"
                aria-label={`View ${currentInstructor.name} details`}
              >
                <div className="relative h-80 sm:h-96 md:h-[520px]">
                  <StorageImage
                    storageId={currentInstructor.photo_url || DEFAULT_INSTRUCTOR_PHOTO}
                    alt={currentInstructor.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 md:px-12 pb-10">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                      {currentInstructor.name}
                    </h3>
                    <p className="text-cyan-400 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
                      {currentInstructor.title}
                    </p>
                    <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed line-clamp-3">
                      {currentInstructor.bio}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* Navigation Arrows */}
          {sortedInstructors.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    prevSlide();
                  }
                }}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group touch-manipulation"
                aria-label="Previous instructor"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    nextSlide();
                  }
                }}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group touch-manipulation"
                aria-label="Next instructor"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {sortedInstructors.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {sortedInstructors.map((instructor, index) => (
                <button
                  key={instructor.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSlide(index);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSlide(index);
                    }
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-12 h-3 bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to instructor ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Preview */}
          {sortedInstructors.length > 1 && (
            <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {sortedInstructors.map((instructor, index) => (
                <button
                  key={instructor.id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSlide(index);
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSlide(index);
                    }
                  }}
                  className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 touch-manipulation ${
                    index === currentIndex
                      ? 'border-cyan-500 scale-105 shadow-lg shadow-cyan-500/30'
                      : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <StorageImage
                    storageId={instructor.photo_url || DEFAULT_INSTRUCTOR_PHOTO}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2">
                    <p className="text-white text-xs sm:text-xs font-semibold truncate">{instructor.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Full Bio */}
      {selectedInstructor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          role="presentation"
          tabIndex={-1}
        >
          <div
            className="relative max-w-4xl w-full bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl border-2 border-cyan-400/50 overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
          >
            <button
              type="button"
              onClick={() => setSelectedInstructor(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedInstructor(null);
                }
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedInstructor(null);
                }
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo */}
              <div
                key={`photo-${selectedInstructor.id}`}
                className="relative h-80 sm:h-96 md:h-full min-h-[400px] w-full"
              >
                <StorageImage
                  key={selectedInstructor.id}
                  storageId={selectedInstructor.photo_url || DEFAULT_INSTRUCTOR_PHOTO}
                  alt={selectedInstructor.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <h3 id={modalTitleId} className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {selectedInstructor.name}
                </h3>
                <p className="text-cyan-400 text-xl font-medium mb-6">{selectedInstructor.title}</p>
                <p className="text-white/90 text-lg leading-relaxed">{selectedInstructor.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurInstructors;
