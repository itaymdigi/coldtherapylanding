import React, { useState, useEffect, useId } from 'react';
import { 
  getAllInstructors,
  addInstructor,
  updateInstructor,
  deleteInstructor,
  uploadInstructorPhoto,
  deleteInstructorPhoto
} from '../../api/instructors';

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photoUrl: '',
    order: 0,
  });

  // Generate unique IDs for form inputs
  const nameInputId = useId();
  const titleInputId = useId();
  const bioInputId = useId();
  const orderInputId = useId();
  const photoUploadId = useId();

  // Load instructors on component mount
  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      const data = await getAllInstructors();
      setInstructors(data);
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  };

  const handleEdit = (instructor) => {
    setEditingId(instructor.id);
    setFormData({
      name: instructor.name,
      title: instructor.title,
      bio: instructor.bio,
      photoUrl: instructor.photo_url,
      order: instructor.order,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      name: '',
      title: '',
      bio: '',
      photoUrl: '',
      order: 0,
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.title || !formData.bio) {
      alert('❌ Please fill in all required fields (name, title, bio)');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSave = {
        ...formData,
        order: formData.order || instructors.length,
      };

      if (editingId) {
        await updateInstructor({
          id: editingId,
          ...dataToSave,
        });
        alert('✅ Instructor updated successfully!');
      } else {
        await addInstructor(dataToSave);
        alert('✅ Instructor added successfully!');
      }

      handleCancel();
      await loadInstructors();
    } catch (error) {
      console.error('Error saving instructor:', error);
      alert(`❌ Failed to save instructor: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return;

    try {
      // Get instructor data before deletion
      const instructor = instructors.find(i => i.id === id);
      
      // Delete from database
      await deleteInstructor(id);
      
      // Delete photo file from storage if it's a Supabase URL
      if (instructor && instructor.photo_url && instructor.photo_url.includes('supabase.co')) {
        await deleteInstructorPhoto(instructor.photo_url);
      }
      
      alert('✅ Instructor deleted successfully!');
      await loadInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      alert('❌ Failed to delete instructor');
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
      const publicUrl = await uploadInstructorPhoto(file);
      
      // Update form with uploaded URL
      setFormData({
        ...formData,
        photoUrl: publicUrl
      });
      
      alert('✅ Instructor photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading instructor photo:', error);
      alert(`❌ Failed to upload instructor photo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: '',
      title: '',
      bio: '',
      photoUrl: '',
      order: instructors.length,
    });
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold text-white">
          {editingId ? 'Edit Instructor' : 'Manage Instructors'}
        </h4>
        {!isAdding && !editingId && (
          <button
            type="button"
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
          >
            ➕ Add Instructor
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white/5 p-6 rounded-2xl space-y-4">
          <h5 className="text-xl font-semibold text-white mb-4">
            {editingId ? 'Edit Instructor' : 'Add New Instructor'}
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={nameInputId} className="block text-white text-sm font-semibold mb-2">
                Name *
              </label>
              <input
                id={nameInputId}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="Instructor name"
                required
              />
            </div>

            <div>
              <label htmlFor={titleInputId} className="block text-white text-sm font-semibold mb-2">
                Title *
              </label>
              <input
                id={titleInputId}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="e.g., Certified Wim Hof Instructor"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor={bioInputId} className="block text-white text-sm font-semibold mb-2">
                Bio *
              </label>
              <textarea
                id={bioInputId}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="Brief bio about the instructor..."
                required
              />
            </div>

            <div>
              <label htmlFor={orderInputId} className="block text-white text-sm font-semibold mb-2">
                Display Order
              </label>
              <input
                id={orderInputId}
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor={photoUploadId} className="block text-white text-sm font-semibold mb-2">
                Instructor Photo
              </label>
              <input
                id={photoUploadId}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 disabled:opacity-50"
              />
              <p className="text-blue-300 text-xs mt-1">
                💡 Upload instructor photo (max 5MB, JPG/PNG/WebP)
              </p>
            </div>

            {formData.photoUrl && (
              <div className="md:col-span-2">
                <div className="block text-white text-sm font-semibold mb-2">
                  Photo Preview
                </div>
                <img
                  src={formData.photoUrl}
                  alt="Instructor preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-cyan-400/30"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isUploading}
              className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                '💾 Save Instructor'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructors List */}
      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-white">
          All Instructors ({instructors?.length || 0})
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-white/5 p-6 rounded-xl border border-cyan-400/20 hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={instructor.photo_url || 'https://via.placeholder.com/150'}
                  alt={instructor.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400/30"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                  }}
                />
                <div className="flex-1">
                  <h5 className="text-lg font-bold text-white">{instructor.name}</h5>
                  <p className="text-sm text-cyan-400">{instructor.title}</p>
                  <p className="text-xs text-blue-300 mt-1">Order: {instructor.order}</p>
                </div>
              </div>

              <p className="text-white/80 text-sm mb-4 line-clamp-3">
                {instructor.bio}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(instructor)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm disabled:opacity-50"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(instructor.id)}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm disabled:opacity-50"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {instructors?.length === 0 && !isAdding && (
          <div className="text-center py-12 text-blue-200">
            <div className="text-4xl mb-2">👥</div>
            <p>No instructors yet. Add your first instructor above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInstructors;
