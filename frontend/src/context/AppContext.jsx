import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  currentStep: 0,
  personalInfo: {
    fullName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessExperience: ''
  },
  goals: {
    primaryGoal: '',
    workoutFrequency: '',
    sessionDuration: '',
    muscleGroupFocus: '',
    healthIssues: ''
  },
  gymPhotos: {
    uploadedFiles: [],
    isDragOver: false
  },
  workoutPlan: null,
  isGenerating: false,
  generationError: null,
  apiConfigured: false,
  errors: {}
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    
    case 'UPDATE_GOALS':
      return {
        ...state,
        goals: { ...state.goals, ...action.payload }
      };
    
    case 'UPDATE_GYM_PHOTOS':
      return {
        ...state,
        gymPhotos: { ...state.gymPhotos, ...action.payload }
      };
    
    case 'SET_WORKOUT_PLAN':
      return { ...state, workoutPlan: action.payload };
    
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    
    case 'SET_GENERATION_ERROR':
      return { ...state, generationError: action.payload };
    
    case 'SET_API_CONFIGURED':
      return { ...state, apiConfigured: action.payload };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'CLEAR_ERROR':
      const newErrors = { ...state.errors };
      delete newErrors[action.payload];
      return { ...state, errors: newErrors };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}