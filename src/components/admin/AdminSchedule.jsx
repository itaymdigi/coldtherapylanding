import { useCallback, useEffect, useId, useState } from 'react';
import { 
  addScheduleImage,
  deleteScheduleImage,
  deleteScheduleImageFile,
  getAllScheduleImages,
  setActiveSchedule,
  updateScheduleImage,
  uploadScheduleImage
} from '../../api/scheduleImages';

const AdminSchedule = () => {
  const [scheduleForm, setScheduleForm] = useState({
    url: '',
    title: '',
    description: '',
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [scheduleImages, setScheduleImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = useId();
  const urlInputId = useId();
  const titleInputId = useId();
  const descriptionInputId = useId();

  const loadScheduleImages = useCallback(async () => {
    try {
      const images = await getAllScheduleImages();
      setScheduleImages(images);
    } catch (error) {
      console.error('Error loading schedule images:', error);
    }
  }, []);

  // Load schedule images on component mount
  useEffect(() => {
    loadScheduleImages();
  }, [loadScheduleImages]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate URL format
    try {
      new URL(scheduleForm.url);
    } catch {
      alert('❌ Please enter a valid image URL starting with https://');
      return;
    }

    setIsLoading(true);
    try {
      if (editingScheduleId) {
        await updateScheduleImage({
          id: editingScheduleId,
          ...scheduleForm,
        });
        alert('✅ Schedule updated successfully!');
      } else {
        await addScheduleImage({
          ...scheduleForm,
          isActive: false,
        });
        alert('✅ Schedule added successfully!');
      }

      // Reset form and reload schedules
      setScheduleForm({ url: '', title: '', description: '' });
      setEditingScheduleId(null);
      await loadScheduleImages();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`❌ Failed to save schedule: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const publicUrl = await uploadScheduleImage(file);
      
      // Update form with uploaded URL
      setScheduleForm({
        ...scheduleForm,
        url: publicUrl
      });
      
      alert('✅ Schedule image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading schedule image:', error);
      alert(`❌ Failed to upload schedule image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetActiveSchedule = async (scheduleId) => {
    try {
      await setActiveSchedule({ id: scheduleId });
      alert('✅ Schedule set as active!');
      await loadScheduleImages();
    } catch (error) {
      console.error('Error setting active schedule:', error);
      alert('❌ Failed to set active schedule.');
    }
  };

  const handleEditSchedule = (schedule) => {
    setScheduleForm({
      url: schedule.url,
      title: schedule.title,
      description: schedule.description || '',
    });
    setEditingScheduleId(schedule.id);
  };

  const handleDeleteScheduleImage = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;

    try {
      // Get schedule URL before deletion
      const schedule = scheduleImages.find(s => s.id === scheduleId);
      
      // Delete from database
      await deleteScheduleImage(scheduleId);
      
      // Delete file from storage if it's a Supabase URL
      if (schedule?.url.includes('supabase.co')) {
        await deleteScheduleImageFile(schedule.url);
      }
      
      alert('✅ Schedule deleted successfully!');
      await loadScheduleImages();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('❌ Failed to delete schedule.');
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <h4 className="text-2xl font-semibold text-white mb-4">
        {editingScheduleId ? 'Edit Schedule' : 'Add New Schedule'}
      </h4>

      {/* Schedule Form */}
      <form onSubmit={handleScheduleSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl">
        <div>
          <label htmlFor={fileInputId} className="block text-white text-sm font-semibold mb-2">
            Upload Schedule Image
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
          />
          <p className="text-blue-300 text-xs mt-1">
            💡 Upload a schedule image or provide a URL below
          </p>
        </div>

        <div>
          <label htmlFor={urlInputId} className="block text-white text-sm font-semibold mb-2">Image URL *</label>
          <input
            id={urlInputId}
            type="url"
            required
            value={scheduleForm.url}
            onChange={(e) => setScheduleForm({ ...scheduleForm, url: e.target.value })}
            placeholder="https://example.com/schedule.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label htmlFor={titleInputId} className="block text-white text-sm font-semibold mb-2">Title *</label>
          <input
            id={titleInputId}
            type="text"
            required
            value={scheduleForm.title}
            onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
            placeholder="e.g., Weekly Schedule"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label htmlFor={descriptionInputId} className="block text-white text-sm font-semibold mb-2">
            Description (Optional)
          </label>
          <textarea
            id={descriptionInputId}
            value={scheduleForm.description}
            onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
            placeholder="Additional details..."
            rows="2"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isLoading || isUploading}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && (
              <>
                <span className="inline-block animate-pulse mr-2">Loading</span>
                {editingScheduleId ? 'Updating...' : 'Adding...'}
              </>
            )}
            {!isLoading && (
              editingScheduleId ? 'Update Schedule' : 'Add Schedule'
            )}
          </button>
          {editingScheduleId && (
            <button
              type="button"
              onClick={() => {
                setEditingScheduleId(null);
                setScheduleForm({ url: '', title: '', description: '' });
              }}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Schedules List */}
      <div className="space-y-3">
        <h4 className="text-xl font-semibold text-white">
          All Schedules ({scheduleImages?.length || 0})
        </h4>
        {scheduleImages?.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
          >
            <div className="flex gap-4">
              <img
                src={schedule.url}
                alt={schedule.title}
                className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400/30"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="text-white font-semibold">{schedule.title}</h5>
                  {schedule.is_active && (
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                {schedule.description && (
                  <p className="text-blue-200 text-sm mb-2">{schedule.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  {!schedule.is_active && (
                    <button
                      type="button"
                      onClick={() => handleSetActiveSchedule(schedule.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm disabled:opacity-50"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEditSchedule(schedule)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteScheduleImage(schedule.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {scheduleImages?.length === 0 && (
          <div className="text-center py-8 text-blue-200">
            <div className="text-4xl mb-2">📅</div>
            <p>No schedules yet. Add your first schedule above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchedule;
