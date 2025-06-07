import React from 'react';
import { ChevronRight } from 'lucide-react';
import { fitnessLevels, genders } from '../../utils/constants';
import Footer from '../common/Footer';

const PersonalInfoForm = ({ 
  personalInfo, 
  onPersonalInfoChange, 
  errors, 
  onNext 
}) => {
  
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

    return newErrors;
  };

  const handleNext = () => {
    const validationErrors = validatePersonalInfo();
    if (Object.keys(validationErrors).length === 0) {
      onNext();
    } else {
      // Pass errors back to parent
      onNext(validationErrors);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-2xl p-8 text-white">

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-center">Personal Information</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Full Name</label>
            <input
              type="text"
              value={personalInfo.fullName}
              onChange={(e) => onPersonalInfoChange('fullName', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.fullName ? 'border-red-400' : ''
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
                onChange={(e) => onPersonalInfoChange('age', e.target.value)}
                min="1"
                max="120"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                  errors.age ? 'border-red-400' : ''
                }`}
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-300 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Gender</label>
              <select
                value={personalInfo.gender}
                onChange={(e) => onPersonalInfoChange('gender', e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                  errors.gender ? 'border-red-400' : ''
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
                onChange={(e) => onPersonalInfoChange('height', e.target.value)}
                min="50"
                max="300"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                  errors.height ? 'border-red-400' : ''
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
                onChange={(e) => onPersonalInfoChange('weight', e.target.value)}
                min="20"
                max="500"
                className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                  errors.weight ? 'border-red-400' : ''
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
              onChange={(e) => onPersonalInfoChange('fitnessExperience', e.target.value)}
              className={`w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 ${
                errors.fitnessExperience ? 'border-red-400' : ''
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
};

export default PersonalInfoForm; 