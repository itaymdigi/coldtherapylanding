import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const AdminSchedule = () => {
  const [scheduleForm, setScheduleForm] = useState({ 
    url: '', 
    title: '', 
    description: '' 
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Convex queries and mutations
  const allScheduleImages = useQuery(api.scheduleImages.getAllScheduleImages);
  const addScheduleImage = useMutation(api.scheduleImages.addScheduleImage);
  const updateScheduleImage = useMutation(api.scheduleImages.updateScheduleImage);
  const deleteScheduleImage = useMutation(api.scheduleImages.deleteScheduleImage);
  const setActiveSchedule = useMutation(api.scheduleImages.setActiveSchedule);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
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
      
      // Reset form
      setScheduleForm({ url: '', title: '', description: '' });
      setEditingScheduleId(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('❌ Failed to save schedule: ' + error.message);
    }
  };

  const handleSetActiveSchedule = async (scheduleId) => {
    try {
      await setActiveSchedule({ id: scheduleId });
      alert('✅ Schedule set as active!');
    } catch (error) {
      console.error('Error setting active schedule:', error);
      alert('❌ Failed to set active schedule.');
    }
  };

  const handleDeleteScheduleImage = async (scheduleId) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteScheduleImage({ id: scheduleId });
        alert('✅ Schedule deleted successfully!');
      } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('❌ Failed to delete schedule.');
      }
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
          <label className="block text-white text-sm font-semibold mb-2">Image URL *</label>
          <input
            type="url"
            required
            value={scheduleForm.url}
            onChange={(e) => setScheduleForm({...scheduleForm, url: e.target.value})}
            placeholder="https://example.com/schedule.jpg"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
          <p className="text-blue-300 text-xs mt-1">💡 Tip: Upload to Media Library first, then copy URL</p>
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">Title *</label>
          <input
            type="text"
            required
            value={scheduleForm.title}
            onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})}
            placeholder="e.g., Weekly Schedule"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-semibold mb-2">Description (Optional)</label>
          <textarea
            value={scheduleForm.description}
            onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
            placeholder="Additional details..."
            rows="2"
            className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
          >
            {editingScheduleId ? '💾 Update Schedule' : '➕ Add Schedule'}
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
        <h4 className="text-xl font-semibold text-white">All Schedules ({allScheduleImages?.length || 0})</h4>
        {allScheduleImages?.map((schedule) => (
          <div key={schedule._id} className="bg-white/5 p-4 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all">
            <div className="flex gap-4">
              <img 
                src={schedule.url} 
                alt={schedule.title}
                className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400/30"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="text-white font-semibold">{schedule.title}</h5>
                  {schedule.isActive && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">✓ Active</span>}
                </div>
                {schedule.description && <p className="text-blue-200 text-sm mb-2">{schedule.description}</p>}
                <div className="flex gap-2 mt-3">
                  {!schedule.isActive && (
                    <button
                      onClick={() => handleSetActiveSchedule(schedule._id)}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all text-sm"
                    >
                      ✓ Set Active
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setScheduleForm({
                        url: schedule.url,
                        title: schedule.title,
                        description: schedule.description || '',
                      });
                      setEditingScheduleId(schedule._id);
                    }}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteScheduleImage(schedule._id)}
                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {allScheduleImages?.length === 0 && (
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
