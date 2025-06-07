import { useState, useEffect } from 'react';

export const useAdSense = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAdSense = () => {
      if (window.adsbygoogle) {
        setIsLoaded(true);
        console.log('✅ AdSense is ready');
      } else {
        console.log('⏳ Waiting for AdSense...');
        setTimeout(checkAdSense, 500);
      }
    };

    // Aspetta che il DOM sia pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkAdSense);
    } else {
      checkAdSense();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', checkAdSense);
    };
  }, []);

  return { isLoaded, error };
}; 