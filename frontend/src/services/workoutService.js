import { fileToBase64 } from '../utils/helpers';

export const generateWorkoutPlan = async (userData, gymPhotos) => {
  try {
    console.log('🌐 Calling backend API...');

    // Convert files to base64 for sending to backend
    const photoData = [];
    for (const file of gymPhotos) {
      try {
        const base64 = await fileToBase64(file);
        photoData.push({
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64.split(',')[1] // Remove data:image/jpeg;base64, prefix
        });
        console.log(`📸 Converted photo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      } catch (error) {
        console.warn('Failed to process photo:', file.name, error);
      }
    }

    console.log(`📤 Sending ${photoData.length} photos to backend...`);

    const response = await fetch('/api/workout/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalInfo: userData,
        goals: userData,
        gymPhotos: photoData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate workout plan');
    }

    const result = await response.json();
    console.log('✅ Received plan:', result.data);
    return result.data;

  } catch (error) {
    console.error('❌ Frontend API Error:', error);
    throw error;
  }
}; 