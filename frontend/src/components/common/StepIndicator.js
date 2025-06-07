import React from 'react';
import { User, Target, Camera, FileText } from 'lucide-react';

const stepIcons = {
  'User': User,
  'Target': Target,
  'Camera': Camera,
  'FileText': FileText
};

const StepIndicator = ({ steps, currentStep, showHorizontal = false }) => {
  if (showHorizontal) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const IconComponent = stepIcons[step.icon];
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return ( // stage 3
              <div key={step.label} className="flex flex-col items-center flex-1 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2  duration-300 ${isActive
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
                {index < steps.length - 1 && (
                  <div className={`w-16 mx-2 transition-all duration-300 ${isCompleted ? 'bg-green-400' : 'bg-white/20'
                    }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return ( //stage 1-2
    <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-white/20">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const IconComponent = stepIcons[step.icon];
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.label} className="flex flex-col items-center flex-1 relative">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2  duration-300 ${isActive
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
  );
};

export default StepIndicator; 