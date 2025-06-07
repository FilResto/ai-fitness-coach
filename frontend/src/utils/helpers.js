// localStorage functions
export const saveToLocalStorage = (step, data) => {
  try {
    localStorage.setItem(`fitnessApp_step${step}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Impossibile salvare in localStorage:', error);
  }
};

export const loadFromLocalStorage = (step) => {
  try {
    const saved = localStorage.getItem(`fitnessApp_step${step}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Impossibile caricare da localStorage:', error);
    return null;
  }
};

// Daily limit functions
export const checkDailyLimit = () => {
  const today = new Date().toDateString();
  const lastGeneration = localStorage.getItem('lastGenerationDate');
  const generationCount = parseInt(localStorage.getItem('generationCount') || '0');

  if (lastGeneration !== today) {
    // Nuovo giorno, reset counter
    localStorage.setItem('lastGenerationDate', today);
    localStorage.setItem('generationCount', '0');
    return { canGenerate: true, remaining: 1 };
  }

  const remaining = Math.max(0, 1 - generationCount);
  return { canGenerate: remaining > 0, remaining };
};

export const incrementDailyCount = () => {
  const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
  localStorage.setItem('generationCount', (currentCount + 1).toString());
};

// File conversion functions
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}; 