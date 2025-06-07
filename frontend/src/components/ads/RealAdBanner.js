import React from 'react';
import GoogleAdBanner from './GoogleAdBanner';

const RealAdBanner = ({ 
  type = 'banner', 
  position = 'default',
  className = "" 
}) => {
  console.log(`🎯 Rendering RealAdBanner: type=${type}, position=${position}`);

  // SLOT IDS - Devi creare questi slot nel tuo account AdSense
  const getAdSlot = (type, position) => {
    const slots = {
      // Usa sempre lo stesso slot per ora, poi ne creerai altri
      'banner': "7386807442",
      'rectangle': "7386807442", // Stesso slot per ora
      'gym_photos': "7386807442",
      'workout_success': "7386807442",
      'between_workouts': "7386807442"
    };
    
    return slots[type] || slots[position] || "7386807442";
  };

  // STILI DIVERSI PER TIPO
  const getAdStyle = () => {
    switch (type) {
      case 'rectangle':
        return {
          minHeight: '250px',
          maxWidth: '300px',
          margin: '0 auto',
          width: '100%'
        };
      case 'banner':
      default:
        return {
          minHeight: '90px',
          width: '100%'
        };
    }
  };

  const adSlot = getAdSlot(type, position);

  return (
    <div className={`ad-wrapper my-4 ${className}`}>
      <GoogleAdBanner 
        adSlot={adSlot}
        adFormat="auto"
        style={getAdStyle()}
        className="w-full"
      />
    </div>
  );
};

export default RealAdBanner; 