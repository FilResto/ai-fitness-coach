import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { primaryGoals, workoutFrequencies, sessionDurations, muscleFocus } from '../../utils/constants';
import Footer from '../common/Footer';

const GoalsForm = ({ 
  goals, 
  onGoalsChange, 
  errors, 
  onNext, 
  onPrevious 
}) => {
  
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

    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validateGoals();
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    } else {
      onNext(validationErrors);
    }
  };

  return (
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
              onChange={(e) => onGoalsChange('primaryGoal', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.primaryGoal ? 'border-red-400' : ''
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
              onChange={(e) => onGoalsChange('workoutFrequency', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.workoutFrequency ? 'border-red-400' : ''
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
              onChange={(e) => onGoalsChange('sessionDuration', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.sessionDuration ? 'border-red-400' : ''
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
              onChange={(e) => onGoalsChange('muscleGroupFocus', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.muscleGroupFocus ? 'border-red-400' : ''
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
              onChange={(e) => onGoalsChange('healthIssues', e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 h-24 resize-none"
              placeholder="Any injuries, medical conditions, or physical limitations we should know about? (Optional)"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onPrevious}
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
};

export default GoalsForm; 