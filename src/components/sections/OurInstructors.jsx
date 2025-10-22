import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useApp } from '../../contexts/AppContext';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Default placeholder image as data URI (no external network call)
const DEFAULT_INSTRUCTOR_PHOTO = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23334155" width="800" height="600"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="32" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInstructor%3C/text%3E%3C/svg%3E';

const OurInstructors = () => {
  const { t } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  
  // Query instructors - will return undefined while loading or if function doesn't exist
  const instructors = useQuery(api.instructor?.getAllInstructors);

  // Handle loading state - don't render anything while loading
  if (instructors === undefined) {
    return null;
  }

  // Sort instructors by order
  const sortedInstructors = [...(instructors || [])].sort((a, b) => a.order - b.order);

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
    return (
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 scroll-reveal">
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
    <section className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 scroll-reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
            {t.ourInstructorsTitle || 'המדריכים שלנו'}
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
            {t.ourInstructorsSubtitle || 'צוות מומחים מוסמכים המוקדשים להדרכתך בטיפול בקור'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {sortedInstructors.map((instructor) => (
                <div
                  key={instructor._id}
                  className="min-w-full px-4"
                >
                  <div
                    onClick={() => setSelectedInstructor(instructor)}
                    className="group cursor-pointer bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    {/* Instructor Photo */}
                    <div className="relative h-96 sm:h-[500px] overflow-hidden">
                      <img
                        src={instructor.photoUrl || DEFAULT_INSTRUCTOR_PHOTO}
                        alt={instructor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Name and Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                          {instructor.name}
                        </h3>
                        <p className="text-cyan-400 text-xl sm:text-2xl font-medium mb-4">
                          {instructor.title}
                        </p>
                        <p className="text-white/90 text-base sm:text-lg leading-relaxed line-clamp-3">
                          {instructor.bio}
                        </p>
                        <button
                          type="button"
                          className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 text-sm font-semibold"
                        >
                          קרא עוד
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {sortedInstructors.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                aria-label="Previous instructor"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                aria-label="Next instructor"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {sortedInstructors.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {sortedInstructors.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
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
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {sortedInstructors.map((instructor, index) => (
                <button
                  key={instructor._id}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'border-cyan-500 scale-105'
                      : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={instructor.photoUrl || DEFAULT_INSTRUCTOR_PHOTO}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="text-white text-xs font-semibold truncate">
                      {instructor.name}
                    </p>
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
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md rounded-3xl border-2 border-cyan-400/50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo */}
              <div className="relative h-64 md:h-full min-h-[400px]">
                <img
                  src={selectedInstructor.photoUrl || DEFAULT_INSTRUCTOR_PHOTO}
                  alt={selectedInstructor.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {selectedInstructor.name}
                </h3>
                <p className="text-cyan-400 text-xl font-medium mb-6">
                  {selectedInstructor.title}
                </p>
                <p className="text-white/90 text-lg leading-relaxed">
                  {selectedInstructor.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OurInstructors;
