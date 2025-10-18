import React from 'react';
import { useApp } from '../../contexts/AppContext';
import AdminAuth from './AdminAuth';
import AdminSchedule from './AdminSchedule';
import AdminGallery from './AdminGallery';
import AdminDanPhoto from './AdminDanPhoto';

const AdminPanelNew = () => {
  const {
    isAuthenticated,
    adminSection,
    setAdminSection,
    handleAdminClose,
  } = useApp();

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
          <AdminAuth />
        ) : (
          <>
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              ⚙️ Admin Panel
            </h3>
            
            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button 
                onClick={() => setAdminSection('schedule')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'schedule' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                📅 Schedule
              </button>
              <button 
                onClick={() => setAdminSection('gallery')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'gallery' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                🖼️ Gallery
              </button>
              <button 
                onClick={() => setAdminSection('danPhoto')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'danPhoto' 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                👤 Dan's Photo
              </button>
            </div>

            {/* Section Content */}
            {adminSection === 'schedule' && <AdminSchedule />}
            {adminSection === 'gallery' && <AdminGallery />}
            {adminSection === 'danPhoto' && <AdminDanPhoto />}

            {/* Close Button */}
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

export default AdminPanelNew;
