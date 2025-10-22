import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useApp } from '../../contexts/AppContext';

const OurInstructors = () => {
  const { t } = useApp();
  
  // Query instructors - will return undefined while loading or if function doesn't exist
  const instructors = useQuery(api.instructor?.getAllInstructors);

  // Handle loading state - don't render anything while loading
  if (instructors === undefined) {
    return null;
  }

  // Sort instructors by order
  const sortedInstructors = [...(instructors || [])].sort((a, b) => a.order - b.order);

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

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedInstructors.map((instructor, index) => (
            <div
              key={instructor._id}
              className="group scroll-reveal bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Instructor Photo */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={instructor.photoUrl || 'https://via.placeholder.com/400x400?text=Instructor'}
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Name and Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {instructor.name}
                  </h3>
                  <p className="text-cyan-400 font-medium">
                    {instructor.title}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6">
                <p className="text-white/80 leading-relaxed">
                  {instructor.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedInstructors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">
              {t.noInstructorsYet || 'בקרוב יתווספו מדריכים נוספים'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurInstructors;
