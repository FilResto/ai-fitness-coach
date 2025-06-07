import React from 'react';
import { ChevronLeft, Camera, Upload, X, Sparkles } from 'lucide-react';
import RealAdBanner from '../ads/RealAdBanner';
import DailyLimitNotice from '../common/DailyLimitNotice';
import Footer from '../common/Footer';

const GymPhotosForm = ({ 
  gymPhotos, 
  onGymPhotosChange,
  onPrevious,
  onGeneratePlan,
  dailyLimit,
  isGenerating,
  generationError,
  onUpgradeClick
}) => {

  const handleFileUpload = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });

    onGymPhotosChange({
      ...gymPhotos,
      uploadedFiles: [...gymPhotos.uploadedFiles, ...validFiles]
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    onGymPhotosChange({ ...gymPhotos, isDragOver: true });
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    onGymPhotosChange({ ...gymPhotos, isDragOver: false });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onGymPhotosChange({ ...gymPhotos, isDragOver: false });
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    onGymPhotosChange({
      ...gymPhotos,
      uploadedFiles: gymPhotos.uploadedFiles.filter((_, i) => i !== index)
    });
  };

  return (
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
        {!dailyLimit.canGenerate ? (
          <>
            <RealAdBanner type="banner" position="gym_photos" />
            <DailyLimitNotice
              remaining={dailyLimit.remaining}
              onUpgrade={onUpgradeClick}
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

            {/* DRAG & DROP AREA */}
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                gymPhotos.isDragOver
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

            {/* LISTA FILE CARICATI */}
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
            onClick={onPrevious}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 border border-white/30"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <button
            onClick={onGeneratePlan}
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
};

export default GymPhotosForm; 