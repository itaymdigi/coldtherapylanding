import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Custom hook for file storage operations
 *
 * Usage:
 * ```jsx
 * const { uploadFile, isUploading, error } = useFileStorage();
 *
 * const handleUpload = async (file) => {
 *   const result = await uploadFile(file, {
 *     category: 'instructor',
 *     tags: ['profile', 'team'],
 *     description: 'Instructor profile photo'
 *   });
 *   console.log('Uploaded:', result);
 * };
 * ```
 */
export const useFileStorage = () => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const saveFileMetadata = useMutation(api.fileStorage.saveFileMetadata);

  /**
   * Upload a file to Convex storage
   * @param {File} file - The file to upload
   * @param {Object} options - Upload options
   * @param {string} options.category - File category (e.g., 'instructor', 'gallery')
   * @param {string[]} options.tags - Tags for the file
   * @param {string} options.description - File description
   * @param {string} options.uploadedBy - Uploader identifier (default: 'admin')
   * @returns {Promise<{storageId: string, fileId: string, url: string}>}
   */
  const uploadFile = async (file, options = {}) => {
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Step 1: Generate upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload the file
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // Step 3: Save metadata
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type.startsWith('video/')
          ? 'video'
          : 'document';

      const fileId = await saveFileMetadata({
        storageId,
        fileName: file.name,
        fileType,
        mimeType: file.type,
        fileSize: file.size,
        category: options.category,
        tags: options.tags,
        description: options.description,
        uploadedBy: options.uploadedBy || 'admin',
      });

      return {
        storageId,
        fileId,
        success: true,
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  };

  return {
    uploadFile,
  };
};

/**
 * Helper function to convert File to base64 (for preview purposes)
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Helper function to format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
