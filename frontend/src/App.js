import React, { useState, useEffect, useRef } from 'react';
import { User, AlertTriangle, Target, Camera, FileText, ChevronRight, ChevronLeft, Upload, X, Sparkles, CheckCircle, Clock, Calendar, Dumbbell, Download, Heart } from 'lucide-react';

// Componente per Google AdSense
const GoogleAdBanner = ({
  adSlot,
  adFormat = "auto",
  style = {},
  className = "",
  adLayout = null,
  adLayoutKey = null
}) => {
  const adRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aspetta un momento per essere sicuri che tutto sia caricato
    const timer = setTimeout(() => {
      try {
        console.log('🔍 Checking AdSense availability...');
        
        // Verifica che adsbygoogle sia disponibile
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          console.log('✅ AdSense script found');
          
          // Verifica che l'elemento ins non sia già stato processato
          if (adRef.current) {
            const insElement = adRef.current;
            
            // Controlla se l'ad è già stato caricato
            if (insElement.getAttribute('data-adsbygoogle-status')) {
              console.log('⚠️ Ad already loaded, skipping');
              return;
            }

            console.log('🚀 Pushing ad to AdSense queue...');
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoaded(true);
            console.log('✅ AdSense ad pushed successfully');
          }
        } else {
          const errorMsg = 'AdSense script not loaded';
          console.warn('⚠️', errorMsg);
          setError(errorMsg);
        }
      } catch (error) {
        console.error('❌ AdSense error:', error);
        setError(error.message);
      }
    }, 500); // Delay di 500ms

    return () => clearTimeout(timer);
  }, [adSlot]);
   // Debug info in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 AdSense Debug Info:', {
        adSlot,
        scriptLoaded: !!window.adsbygoogle,
        isLocalhost: window.location.hostname === 'localhost',
        currentURL: window.location.href
      });
    }
  }, [adSlot]);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <div className="text-xs text-gray-400 mb-1 text-center">Ads</div>
      
      {/* Test mode placeholder per localhost */}
      {window.location.hostname === 'localhost' && (
        <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-8 text-center">
          <div className="text-gray-600">
            <div className="text-lg mb-2">📺 AdSense Test Mode</div>
            <div className="text-sm">
              Slot: {adSlot}<br/>
              Format: {adFormat}<br/>
              {error && <span className="text-red-500">Error: {error}</span>}
              {isLoaded && <span className="text-green-500">✅ Script loaded</span>}
            </div>
          </div>
        </div>
      )}
      
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block',
          textAlign: 'center',
          minHeight: window.location.hostname === 'localhost' ? '0px' : '90px',
          ...style 
        }}
        data-ad-client="ca-pub-2663565811118495"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(adLayout && { 'data-ad-layout': adLayout })}
        {...(adLayoutKey && { 'data-ad-layout-key': adLayoutKey })}
      />
    </div>
  );
};

// 3. COMPONENTE REAL AD BANNER MIGLIORATO
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

// 4. COMPONENT PER DEBUG ADSENSE
const AdSenseDebugger = () => {
  const [debugInfo, setDebugInfo] = React.useState({});

  React.useEffect(() => {
    const checkAdSense = () => {
      const info = {
        scriptLoaded: !!window.adsbygoogle,
        adsbygoogleArray: window.adsbygoogle ? window.adsbygoogle.length : 0,
        userAgent: navigator.userAgent,
        currentURL: window.location.href,
        isLocalhost: window.location.hostname === 'localhost',
        adBlockerPossible: !window.adsbygoogle && document.readyState === 'complete'
      };
      setDebugInfo(info);
    };

    // Check subito e dopo 2 secondi
    checkAdSense();
    setTimeout(checkAdSense, 2000);
  }, []);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2">🔍 AdSense Debug Info:</h3>
      <ul className="space-y-1">
        <li>Script Loaded: {debugInfo.scriptLoaded ? '✅' : '❌'}</li>
        <li>AdSense Queue: {debugInfo.adsbygoogleArray || 0} items</li>
        <li>Is Localhost: {debugInfo.isLocalhost ? '⚠️ YES (ads may not show)' : '✅ NO'}</li>
        <li>Possible AdBlocker: {debugInfo.adBlockerPossible ? '⚠️ YES' : '✅ NO'}</li>
        <li>URL: {debugInfo.currentURL}</li>
      </ul>
    </div>
  );
};

// 5. HOOK PER GESTIRE ADSENSE
const useAdSense = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
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


const steps = [
  { label: 'Personal Info', icon: User },
  { label: 'Goals', icon: Target },
  { label: 'Gym Photos', icon: Camera },
  { label: 'Your Plan', icon: FileText }
];

const fitnessLevels = [
  { value: 'beginner', label: 'Beginner (< 6 months)' },
  { value: 'intermediate', label: 'Intermediate (6 months - 2 years)' },
  { value: 'advanced', label: 'Advanced (2+ years)' }
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const primaryGoals = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'strength', label: 'Build Strength' },
  { value: 'endurance', label: 'Improve Endurance' },
  { value: 'general_fitness', label: 'General Fitness' },
  { value: 'body_recomposition', label: 'Body Recomposition' }
];

const workoutFrequencies = [
  { value: '1-2', label: '1-2 times per week' },
  { value: '3-4', label: '3-4 times per week' },
  { value: '5-6', label: '5-6 times per week' },
  { value: 'daily', label: 'Daily' }
];

const sessionDurations = [
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2+ hours' }
];

const muscleFocus = [
  { value: 'full_body', label: 'Full Body' },
  { value: 'upper_body', label: 'Upper Body Focus' },
  { value: 'lower_body', label: 'Lower Body Focus' },
  { value: 'core', label: 'Core Focus' },
  { value: 'specific_muscles', label: 'Specific Muscle Groups' }
];

// AGGIUNTO: Funzioni per localStorage e limite giornaliero
const saveToLocalStorage = (step, data) => {
  try {
    localStorage.setItem(`fitnessApp_step${step}`, JSON.stringify(data));
  } catch (error) {
    console.warn('Impossibile salvare in localStorage:', error);
  }
};

const loadFromLocalStorage = (step) => {
  try {
    const saved = localStorage.getItem(`fitnessApp_step${step}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Impossibile caricare da localStorage:', error);
    return null;
  }
};

const checkDailyLimit = () => {
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

const incrementDailyCount = () => {
  const currentCount = parseInt(localStorage.getItem('generationCount') || '0');
  localStorage.setItem('generationCount', (currentCount + 1).toString());
};


// AGGIUNTO: Componente limite giornaliero
const DailyLimitNotice = ({ remaining, onUpgrade }) => (
  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-6 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <AlertTriangle className="text-orange-400" size={24} />
      <h3 className="text-xl font-bold text-white">Piano giornaliero utilizzato</h3>
    </div>
    <p className="text-white/80 mb-4">
      Hai già generato il tuo piano gratuito di oggi. Torna domani per un nuovo piano gratuito!
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onUpgrade}
        className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-all"
      >
        🚀 Upgrade to Premium - Unlimited Plans
      </button>
      <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all">
        📅 Remember tomorrow
      </button>
    </div>
  </div>
);
function AIFitnessCoach() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(checkDailyLimit());
  const { isLoaded } = useAdSense();

  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState(() => {
    const saved = loadFromLocalStorage(0);
    return saved || {
      fullName: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      fitnessExperience: ''
    };
  });

  const [goals, setGoals] = useState(() => {
    const saved = loadFromLocalStorage(1);
    return saved || {
      primaryGoal: '',
      workoutFrequency: '',
      sessionDuration: '',
      muscleGroupFocus: '',
      healthIssues: ''
    };
  });

  const [gymPhotos, setGymPhotos] = useState(() => {
    // Non salviamo le foto in localStorage per motivi di spazio
    return {
      uploadedFiles: [],
      isDragOver: false
    };
  });
  useEffect(() => {
    setDailyLimit(checkDailyLimit());
  }, []);

  // AI Workout Plan State
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const [errors, setErrors] = useState({});


  const handlePersonalInfoChange = (field, value) => {
    const newData = { ...personalInfo, [field]: value };
    setPersonalInfo(newData);
    saveToLocalStorage(0, newData);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGoalsChange = (field, value) => {
    const newData = { ...goals, [field]: value };
    setGoals(newData);
    saveToLocalStorage(1, newData);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });

    setGymPhotos(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...validFiles]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setGymPhotos(prev => ({ ...prev, isDragOver: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setGymPhotos(prev => ({ ...prev, isDragOver: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setGymPhotos(prev => ({ ...prev, isDragOver: false }));
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setGymPhotos(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  // AI Service functions
  // SOSTITUISCI questa funzione nel frontend:
  // SOSTITUISCI questa funzione nel frontend:
  const generateWorkoutPlan = async (userData, gymPhotos) => {
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

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };


  const validatePersonalInfo = () => {
    const newErrors = {};

    if (!personalInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!personalInfo.age || personalInfo.age < 1 || personalInfo.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }

    if (!personalInfo.gender) {
      newErrors.gender = 'Please select your gender';
    }

    if (!personalInfo.height || personalInfo.height < 50 || personalInfo.height > 300) {
      newErrors.height = 'Please enter a valid height (50-300 cm)';
    }

    if (!personalInfo.weight || personalInfo.weight < 20 || personalInfo.weight > 500) {
      newErrors.weight = 'Please enter a valid weight (20-500 kg)';
    }

    if (!personalInfo.fitnessExperience) {
      newErrors.fitnessExperience = 'Please select your fitness experience';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateGoals = () => {
    const newErrors = {};

    if (!goals.primaryGoal) {
      newErrors.primaryGoal = 'Please select your primary goal';
    }

    if (!goals.workoutFrequency) {
      newErrors.workoutFrequency = 'Please select workout frequency';
    }

    if (!goals.sessionDuration) {
      newErrors.sessionDuration = 'Please select session duration';
    }

    if (!goals.muscleGroupFocus) {
      newErrors.muscleGroupFocus = 'Please select muscle group focus';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (validatePersonalInfo()) {
        setCurrentStep(1);
      }
    } else if (currentStep === 1) {
      if (validateGoals()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      alert('Incoming with AI!');
      //handleGeneratePlan();
    }
  };

  // MODIFICATO: Controlla limite prima di generare
  const handleGeneratePlan = async () => {
    const limitCheck = checkDailyLimit();

    if (!limitCheck.canGenerate) {
      setDailyLimit(limitCheck);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const userData = { ...personalInfo, ...goals };
      console.log('Generating workout plan with data:', userData);

      const plan = await generateWorkoutPlan(userData, gymPhotos.uploadedFiles);
      setWorkoutPlan(plan);
      setCurrentStep(3);

      // AGGIUNTO: Incrementa contatore giornaliero
      incrementDailyCount();
      setDailyLimit(checkDailyLimit());

    } catch (error) {
      console.error('Error generating plan:', error);
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // AGGIUNTO: Funzione per upgrade premium
  const handleUpgradeClick = () => {
    // Qui integrerai Stripe/PayPal in futuro
    alert('Premium incoming!');
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const downloadPlanAsPDF = () => {
    let content = `AI FITNESS COACH - WORKOUT PLAN\n`;
    content += `=====================================\n\n`;
    content += `${workoutPlan.title}\n`;
    content += `${workoutPlan.description}\n\n`;
    content += `Frequency: ${workoutPlan.frequency}\n`;
    content += `Session Duration: ${workoutPlan.sessionDuration}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `AI Generated: ${workoutPlan.isAiGenerated ? 'Yes' : 'No (Demo Plan)'}\n\n`;

    workoutPlan.workouts.forEach((workout, index) => {
      content += `\n${workout.day}\n`;
      content += `${'='.repeat(workout.day.length)}\n`;
      content += `Focus: ${workout.focus}\n\n`;
      content += `WARM-UP:\n${workout.warmup}\n\n`;
      content += `EXERCISES:\n`;

      workout.exercises.forEach((exercise, exerciseIndex) => {
        content += `${exerciseIndex + 1}. ${exercise.name}\n`;
        content += `   Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.rest}\n`;
        content += `   Muscles: ${exercise.muscles} | Intensity: ${exercise.intensity}\n`;
        if (exercise.notes) {
          content += `   Notes: ${exercise.notes}\n`;
        }
        content += `\n`;
      });

      content += `COOL-DOWN:\n${workout.cooldown}\n\n`;
    });

    content += `PROGRESSION:\n${workoutPlan.progression}\n\n`;
    content += `IMPORTANT NOTES:\n${workoutPlan.importantNotes}\n\n`;
    content += `\n---\nGenerated by AI Fitness Coach\nMade with ❤️ for your fitness journey`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-fitness-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const Footer = () => (
    <div className="text-center py-6 mt-8">
      <p className="text-white/80 text-sm">
        Made with <Heart className="inline w-4 h-4 text-red-400 mx-1" /> for your fitness journey • Multi-platform responsive design
      </p>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500 rounded-full p-3">
            <span className="text-2xl">🏆</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Fitness Coach</h1>
        <p className="text-white/80">Get your personalized workout plan powered by AI</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Personal Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Full Name</label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.fullName ? 'border-red-400' : ''
                }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && <p className="text-red-300 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">Age</label>
              <input
                type="number"
                value={personalInfo.age}
                onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
                min="1"
                max="120"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.age ? 'border-red-400' : ''
                  }`}
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-300 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Gender</label>
              <select
                value={personalInfo.gender}
                onChange={(e) => handlePersonalInfoChange('gender', e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.gender ? 'border-red-400' : ''
                  }`}
              >
                <option value="" className="text-gray-800">Select your gender</option>
                {genders.map((gender) => (
                  <option key={gender.value} value={gender.value} className="text-gray-800">
                    {gender.label}
                  </option>
                ))}
              </select>
              {errors.gender && <p className="text-red-300 text-sm mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-3">Height (cm)</label>
              <input
                type="number"
                value={personalInfo.height}
                onChange={(e) => handlePersonalInfoChange('height', e.target.value)}
                min="50"
                max="300"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.height ? 'border-red-400' : ''
                  }`}
                placeholder="Enter your height in cm"
              />
              {errors.height && <p className="text-red-300 text-sm mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Weight (kg)</label>
              <input
                type="number"
                value={personalInfo.weight}
                onChange={(e) => handlePersonalInfoChange('weight', e.target.value)}
                min="20"
                max="500"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.weight ? 'border-red-400' : ''
                  }`}
                placeholder="Enter your weight in kg"
              />
              {errors.weight && <p className="text-red-300 text-sm mt-1">{errors.weight}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Fitness Experience</label>
            <select
              value={personalInfo.fitnessExperience}
              onChange={(e) => handlePersonalInfoChange('fitnessExperience', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.fitnessExperience ? 'border-red-400' : ''
                }`}
            >
              <option value="" className="text-gray-800">Select your fitness experience</option>
              {fitnessLevels.map((level) => (
                <option key={level.value} value={level.value} className="text-gray-800">
                  {level.label}
                </option>
              ))}
            </select>
            {errors.fitnessExperience && <p className="text-red-300 text-sm mt-1">{errors.fitnessExperience}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Next Step
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );

  const renderGoals = () => (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500 rounded-full p-3">
            <span className="text-2xl">🏆</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Fitness Coach</h1>
        <p className="text-white/80">Get your personalized workout plan powered by AI</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold mb-8 text-center">What are your fitness goals?</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Primary Goal</label>
            <select
              value={goals.primaryGoal}
              onChange={(e) => handleGoalsChange('primaryGoal', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.primaryGoal ? 'border-red-400' : ''
                }`}
            >
              <option value="" className="text-gray-800">Select your goal</option>
              {primaryGoals.map((goal) => (
                <option key={goal.value} value={goal.value} className="text-gray-800">
                  {goal.label}
                </option>
              ))}
            </select>
            {errors.primaryGoal && <p className="text-red-300 text-sm mt-1">{errors.primaryGoal}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Workout Frequency</label>
            <select
              value={goals.workoutFrequency}
              onChange={(e) => handleGoalsChange('workoutFrequency', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.workoutFrequency ? 'border-red-400' : ''
                }`}
            >
              <option value="" className="text-gray-800">Select</option>
              {workoutFrequencies.map((freq) => (
                <option key={freq.value} value={freq.value} className="text-gray-800">
                  {freq.label}
                </option>
              ))}
            </select>
            {errors.workoutFrequency && <p className="text-red-300 text-sm mt-1">{errors.workoutFrequency}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Session Duration</label>
            <select
              value={goals.sessionDuration}
              onChange={(e) => handleGoalsChange('sessionDuration', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.sessionDuration ? 'border-red-400' : ''
                }`}
            >
              <option value="" className="text-gray-800">Select</option>
              {sessionDurations.map((duration) => (
                <option key={duration.value} value={duration.value} className="text-gray-800">
                  {duration.label}
                </option>
              ))}
            </select>
            {errors.sessionDuration && <p className="text-red-300 text-sm mt-1">{errors.sessionDuration}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Muscle Group Focus</label>
            <select
              value={goals.muscleGroupFocus}
              onChange={(e) => handleGoalsChange('muscleGroupFocus', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${errors.muscleGroupFocus ? 'border-red-400' : ''
                }`}
            >
              <option value="" className="text-gray-800">Select focus</option>
              {muscleFocus.map((focus) => (
                <option key={focus.value} value={focus.value} className="text-gray-800">
                  {focus.label}
                </option>
              ))}
            </select>
            {errors.muscleGroupFocus && <p className="text-red-300 text-sm mt-1">{errors.muscleGroupFocus}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Health Issues or Limitations</label>
            <textarea
              value={goals.healthIssues}
              onChange={(e) => handleGoalsChange('healthIssues', e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 h-24 resize-none"
              placeholder="Any injuries, medical conditions, or physical limitations we should know about? (Optional)"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Next Step
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );

  const renderGymPhotos = () => (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">
      {/* Header esistente */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-500 rounded-full p-3">
            <span className="text-2xl">🏆</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Fitness Coach</h1>
        <p className="text-white/80">Get your personalized workout plan powered by AI</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        {/* 🚨 CONTROLLO LIMITE GIORNALIERO */}
        { /**mettere il ! davanti a dailylimit */}
        {!dailyLimit.canGenerate ? (
          <>
          <RealAdBanner type="banner" position="gym_photos" />
          <DailyLimitNotice
            remaining={dailyLimit.remaining}
            onUpgrade={handleUpgradeClick}
          />
          </>
          
        ) : (
          <>
            <RealAdBanner type="banner" position="gym_photos" />
            <h2 className="text-2xl font-bold mb-4 text-center">Show us your gym equipment</h2>
            <p className="text-center text-white/80 mb-2">
              Upload photos of your gym equipment so our AI can create a personalized workout plan based on what's available to you.
            </p>

            {/* ⚡ CONTATORE PIANI RIMASTI */}
            <p className="text-center text-sm text-yellow-300 mb-8">
              ⚡ Piano gratuito giornaliero: {dailyLimit.remaining} rimasto oggi
            </p>

            {/* DRAG & DROP AREA (codice esistente) */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${gymPhotos.isDragOver
                ? 'border-yellow-400 bg-yellow-400/10'
                : 'border-white/40 bg-white/5'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="bg-white/20 rounded-full p-6 mb-4">
                  <Camera size={48} className="text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2">Drop your gym photos here</h3>
                <p className="text-white/70 mb-4">or click to browse files</p>

                <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-all duration-200 border border-white/30">
                  <span className="font-medium">Browse Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </label>

                <div className="flex items-center gap-2 mt-4 text-sm text-white/60">
                  <Upload size={16} />
                  <span>Support for JPG, PNG, WEBP files</span>
                </div>
              </div>
            </div>

            {/* LISTA FILE CARICATI (codice esistente) */}
            {gymPhotos.uploadedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Uploaded Photos ({gymPhotos.uploadedFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gymPhotos.uploadedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-500 rounded p-2">
                            <Camera size={20} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-white/60">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 rounded-full p-1 transition-all duration-200"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* BOTTONI NAVIGAZIONE */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={isGenerating || !dailyLimit.canGenerate}
            className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {!dailyLimit.canGenerate ? (
              'Limit reached today, upgrade to premium for more plans!'
            ) : isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                Generate My Plan
                <Sparkles size={20} />
              </>
            )}
          </button>
        </div>

        {/* ERRORE GENERAZIONE */}
        {generationError && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{generationError}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );

  // ===== RENDER WORKOUT PLAN (Step 4 - Risultato finale) =====
  const renderWorkoutPlan = () => (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER SUCCESSO */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-2xl p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle size={64} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Personalized Workout Plan is Ready!</h1>
          <p className="text-white/80">
            {workoutPlan?.isAiGenerated
              ? 'AI-powered training designed specifically for you'
              : 'Fallback demo plan - AI temporarily unavailable'
            }
          </p>
        </div>

        {/* 📺 PUBBLICITÀ DOPO IL SUCCESSO */}
        {process.env.NODE_ENV === 'development' && <AdSenseDebugger />}
        <RealAdBanner type="rectangle" position="workout_success" />

        {/* INFO PIANO */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 text-white">
          <h2 className="text-2xl font-bold mb-4">{workoutPlan?.title}</h2>
          <p className="text-white/80 mb-6">{workoutPlan?.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-3">
              <Calendar className="text-blue-300" size={24} />
              <div>
                <p className="font-semibold">Frequency</p>
                <p className="text-sm text-white/70">{workoutPlan?.frequency}</p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-3">
              <Clock className="text-green-300" size={24} />
              <div>
                <p className="font-semibold">Duration</p>
                <p className="text-sm text-white/70">{workoutPlan?.sessionDuration}</p>
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-3">
              <Dumbbell className="text-purple-300" size={24} />
              <div>
                <p className="font-semibold">Experience</p>
                <p className="text-sm text-white/70">{personalInfo.fitnessExperience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* WORKOUTS INDIVIDUALI */}
        {workoutPlan?.workouts?.map((workout, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 text-white">
            <h3 className="text-xl font-bold mb-2">{workout.day}</h3>
            <p className="text-blue-300 font-medium mb-4">Focus: {workout.focus}</p>

            {/* WARM-UP */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">🔥 Warm-up</h4>
              <p className="text-white/80 text-sm bg-yellow-500/20 p-3 rounded-lg">{workout.warmup}</p>
            </div>

            {/* ESERCIZI */}
            <div className="mb-4">
              <h4 className="font-semibold mb-3">💪 Exercises</h4>
              <div className="space-y-3">
                {workout.exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border border-white/20 rounded-lg p-4 bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold">{exercise.name}</h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${exercise.intensity === 'high' ? 'bg-red-500/30 text-red-200' :
                        exercise.intensity === 'medium' ? 'bg-yellow-500/30 text-yellow-200' :
                          'bg-green-500/30 text-green-200'
                        }`}>
                        {exercise.intensity}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <span className="font-medium text-white/70">Sets:</span>
                        <span className="ml-1">{exercise.sets}</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/70">Reps:</span>
                        <span className="ml-1">{exercise.reps}</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/70">Rest:</span>
                        <span className="ml-1">{exercise.rest}</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/70">Muscles:</span>
                        <span className="ml-1">{exercise.muscles}</span>
                      </div>
                    </div>

                    {exercise.notes && (
                      <p className="text-sm text-blue-200 bg-blue-500/20 p-2 rounded">
                        💡 {exercise.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* COOL-DOWN */}
            <div>
              <h4 className="font-semibold mb-2">🧘 Cool-down</h4>
              <p className="text-white/80 text-sm bg-blue-500/20 p-3 rounded-lg">{workout.cooldown}</p>
            </div>
          </div>
        ))}
        {/* GOOGLE ADS TRA I WORKOUTS (opzionale) */}
        {workoutPlan?.workouts?.length > 1 && (
          <RealAdBanner type="banner" position="between_workouts" />
        )}

        {/* PROGRESSIONE E NOTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 text-white">
            <h3 className="text-xl font-bold mb-4">📈 Progression</h3>
            <p className="text-white/80">{workoutPlan?.progression}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 text-white">
            <h3 className="text-xl font-bold mb-4">⚠️ Important Notes</h3>
            <p className="text-white/80">{workoutPlan?.importantNotes}</p>
          </div>
        </div>

        {/* BOTTONI FINALI */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadPlanAsPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Download size={20} />
            Download Plan
          </button>

          {/* 💎 PULSANTE PREMIUM */}
          <button
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Upgrade Premium
          </button>

          <button
            onClick={() => {
              setCurrentStep(0);
              // Clear saved data per nuovo piano
              localStorage.removeItem('fitnessApp_step0');
              localStorage.removeItem('fitnessApp_step1');
              setPersonalInfo({
                fullName: '', age: '', gender: '', height: '', weight: '', fitnessExperience: ''
              });
              setGoals({
                primaryGoal: '', workoutFrequency: '', sessionDuration: '', muscleGroupFocus: '', healthIssues: ''
              });
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Create New Plan
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {currentStep < 3 && (
          <>
            {currentStep < 2 && (
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">AI Fitness Coach</h1>
                <p className="text-white/80 text-lg">Your personalized fitness journey starts here</p>
              </div>
            )}

            {currentStep < 2 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
                <div className="flex justify-between items-center">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <div key={step.label} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isActive
                          ? 'bg-pink-500 text-white shadow-lg'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-white/20 text-white/60'
                          }`}>
                          <IconComponent size={24} />
                        </div>
                        <span className={`text-sm font-medium ${isActive ? 'text-pink-300' : isCompleted ? 'text-green-300' : 'text-white/60'
                          }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="mb-8">
                <div className="flex justify-center items-center">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                      <div key={step.label} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                            ? 'bg-pink-500 text-white shadow-lg'
                            : isCompleted
                              ? 'bg-purple-600 text-white'
                              : 'bg-white/20 text-white/60'
                            }`}>
                            {isCompleted ? (
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                <span className="text-purple-600 text-sm">✓</span>
                              </div>
                            ) : (
                              <IconComponent size={20} />
                            )}
                          </div>
                          <span className={`text-xs font-medium mt-1 ${isActive ? 'text-pink-300' : isCompleted ? 'text-purple-300' : 'text-white/60'
                            }`}>
                            {step.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${isCompleted ? 'bg-purple-400' : 'bg-white/20'
                            }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {currentStep === 0 && renderPersonalInfo()}
        {currentStep === 1 && renderGoals()}
        {currentStep === 2 && renderGymPhotos()}
      </div>

      {currentStep === 3 && renderWorkoutPlan()}
    </div>
  );
}



export default function App() {
  return <AIFitnessCoach />;
}

