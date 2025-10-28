import { useApp } from '../../contexts/AppContext';
import AdminAuth from './AdminAuth';

const AdminPanelNew = () => {
  const { isAuthenticated, adminSection, setAdminSection, handleAdminClose } = useApp();

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Modal backdrop - Escape handled on dialog element
    // biome-ignore lint/a11y/noStaticElementInteractions: Modal backdrop pattern requires click to close
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-4 overflow-y-auto"
      onClick={handleAdminClose}
    >
      <div
        className="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/50 max-w-4xl w-full my-8 relative"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleAdminClose();
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {!isAuthenticated ? (
          <AdminAuth />
        ) : (
          <>
            <h3 className="text-3xl font-bold text-white mb-6 text-center">⚙️ Admin Panel</h3>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                type="button"
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
                type="button"
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
                type="button"
                onClick={() => setAdminSection('danPhoto')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'danPhoto'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                👤 Dan's Photo
              </button>
              <button
                type="button"
                onClick={() => setAdminSection('instructors')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'instructors'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                👥 Instructors
              </button>
              <button
                type="button"
                onClick={() => setAdminSection('settings')}
                className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${
                  adminSection === 'settings'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
              >
                ⚙️ Settings
              </button>
            </div>

            {/* Section Content - Load dynamically */}
            <AuthenticatedAdminContent adminSection={adminSection} />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleAdminClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Separate component to avoid Convex imports being loaded when not authenticated
const AuthenticatedAdminContent = ({ adminSection }) => {
  // Simple stub components to avoid Convex import errors
  const AdminStub = ({ title }) => (
    <div className="p-8 text-center text-white">
      <h2 className="text-2xl font-bold mb-4">{title} - Under Maintenance</h2>
      <p>This admin section is being migrated to Supabase.</p>
    </div>
  );

  // Render the appropriate admin section stub
  switch (adminSection) {
    case 'schedule':
      return <AdminStub title="Schedule Management" />;
    case 'gallery':
      return <AdminStub title="Gallery Management" />;
    case 'danPhoto':
      return <AdminStub title="Dan's Photo Management" />;
    case 'instructors':
      return <AdminStub title="Instructors Management" />;
    case 'settings':
      return <AdminStub title="Settings" />;
    default:
      return <AdminStub title="Schedule Management" />;
  }
};

export default AdminPanelNew;
