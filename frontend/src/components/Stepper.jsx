import React from 'react';
import { User, Target, Camera, FileText } from 'lucide-react';

const steps = [
  { label: 'Personal Info', icon: User },
  { label: 'Goals', icon: Target },
  { label: 'Gym Photos', icon: Camera },
  { label: 'Your Plan', icon: FileText }
];

export default function Stepper({ currentStep, type = 'normal' }) {
  if (type === 'gym-photos') {
    return (
      <div className="mb-8">
        <div className="flex justify-center items-center">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive 
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
                  <span className={`text-xs font-medium mt-1 ${
                    isActive ? 'text-pink-300' : isCompleted ? 'text-purple-300' : 'text-white/60'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    isCompleted ? 'bg-purple-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div key={step.label} className="flex flex-col items-center flex-1 relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isActive 
                  ? 'bg-pink-500 text-white shadow-lg' 
                  : isCompleted 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/20 text-white/60'
              }`}>
                <IconComponent size={24} />
              </div>
              <span className={`text-sm font-medium ${
                isActive ? 'text-pink-300' : isCompleted ? 'text-green-300' : 'text-white/60'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}