import React from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Download, 
  Heart 
} from 'lucide-react';
import RealAdBanner from '../ads/RealAdBanner';
import AdSenseDebugger from '../ads/AdSenseDebugger';

const WorkoutPlanResult = ({ 
  workoutPlan, 
  personalInfo,
  onUpgradeClick,
  onDownloadPDF,
  onCreateNewPlan
}) => {

  if (!workoutPlan) {
    return <div>Loading...</div>;
  }

  return (
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exercise.intensity === 'high' ? 'bg-red-500/30 text-red-200' :
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
            onClick={onDownloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105"
          >
            <Download size={20} />
            Download Plan
          </button>

          {/* 💎 PULSANTE PREMIUM */}
          <button
            onClick={onUpgradeClick}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Upgrade Premium
          </button>

          <button
            onClick={onCreateNewPlan}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Create New Plan
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center py-6 mt-8">
          <p className="text-white/80 text-sm">
            Made with <Heart className="inline w-4 h-4 text-red-400 mx-1" /> for your fitness journey
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanResult; 