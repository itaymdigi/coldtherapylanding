import React from 'react';
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
