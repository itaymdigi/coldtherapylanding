import { useId, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Edit2, Save, Trash2, Upload, UserPlus, X } from 'lucide-react';
import { api } from '../../../convex/_generated/api';
import { useFileStorage, formatFileSize } from '../../hooks/useFileStorage';

const AdminInstructorsWithStorage = () => {
  const nameInputId = useId();
  const titleInputId = useId();
  const bioInputId = useId();
  const orderInputId = useId();
  const photoUploadId = useId();
  
  const instructors = useQuery(api.instructor.getAllInstructors) || [];
  const addInstructor = useMutation(api.instructor.addInstructor);
  const updateInstructor = useMutation(api.instructor.updateInstructor);
  const deleteInstructor = useMutation(api.instructor.deleteInstructor);
  const { uploadFile } = useFileStorage();

  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    photoUrl: '',
    order: 0,
  });

  const handleEdit = (instructor) => {
    setEditingId(instructor._id);
    setFormData({
      name: instructor.name,
      title: instructor.title,
      bio: instructor.bio,
      photoUrl: instructor.photoUrl,
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
    try {
      const defaultPhoto = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23334155" width="400" height="400"/%3E%3Ctext fill="%23fff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInstructor%3C/text%3E%3C/svg%3E';
      const dataToSave = {
        ...formData,
        photoUrl: formData.photoUrl || defaultPhoto,
      };

      if (editingId) {
        await updateInstructor({
          id: editingId,
          ...dataToSave,
        });
      } else {
        await addInstructor(dataToSave);
      }
      handleCancel();
    } catch (error) {
      console.error('Error saving instructor:', error);
      alert(`Failed to save instructor: ${error.message || error}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await deleteInstructor({ id });
      } catch (error) {
        console.error('Error deleting instructor:', error);
        alert('Failed to delete instructor');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File size (${formatFileSize(file.size)}) exceeds 10MB limit. Please compress your image.`);
        return;
      }

      // Upload to Convex storage
      const result = await uploadFile(file, {
        category: 'instructor',
        tags: ['profile', 'team'],
        description: `Profile photo for ${formData.name || 'instructor'}`,
      });

      // Get the storage URL
      const storageUrl = await api.fileStorage.getFileUrl({ storageId: result.storageId });
      
      // Update form data with storage URL
      setFormData({ ...formData, photoUrl: storageUrl });
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Instructors (with File Storage)</h2>
        <button
          type="button"
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add Instructor
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? 'Edit Instructor' : 'Add New Instructor'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={nameInputId} className="block text-white mb-2">Name</label>
              <input
                id={nameInputId}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Instructor name"
              />
            </div>

            <div>
              <label htmlFor={titleInputId} className="block text-white mb-2">Title</label>
              <input
                id={titleInputId}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="e.g., Certified Wim Hof Instructor"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor={bioInputId} className="block text-white mb-2">Bio</label>
              <textarea
                id={bioInputId}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Brief bio about the instructor..."
              />
            </div>

            <div>
              <label htmlFor={orderInputId} className="block text-white mb-2">Order</label>
              <input
                id={orderInputId}
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Display order"
              />
            </div>

            <div>
              <label htmlFor={photoUploadId} className="block text-white mb-2">
                Photo {isUploading && <span className="text-cyan-400">(Uploading...)</span>}
              </label>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={photoUploadId}
                  disabled={isUploading}
                />
                <label
                  htmlFor={photoUploadId}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Upload Photo (Max 10MB)'}
                </label>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Supports: JPG, PNG, WebP. Files stored in Convex cloud storage.
              </p>
            </div>

            {formData.photoUrl && (
              <div className="md:col-span-2">
                <img
                  src={formData.photoUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-white/20"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={!formData.name || !formData.title || !formData.bio || isUploading}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-start gap-4">
              <img
                src={instructor.photoUrl || 'https://via.placeholder.com/150'}
                alt={instructor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-cyan-500"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                <p className="text-sm text-cyan-400">{instructor.title}</p>
                <p className="text-xs text-white/60 mt-1">Order: {instructor.order}</p>
              </div>
            </div>

            <p className="text-white/80 text-sm mt-4 line-clamp-3">{instructor.bio}</p>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleEdit(instructor)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(instructor._id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No instructors yet. Add your first instructor!</p>
        </div>
      )}
    </div>
  );
};

export default AdminInstructorsWithStorage;
