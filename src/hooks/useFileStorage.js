/**
 * Custom hook for file storage operations - DISABLED
 * This was using Convex but has been disabled since migration to Supabase
 */

export const useFileStorage = () => {
  return {
    uploadFile: async () => {
      throw new Error('File storage not available after migration to Supabase');
    },
  };
};

/**
 * Helper function to convert File to base64 (for preview purposes)
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
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
};
