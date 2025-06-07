import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DailyLimitNotice = ({ remaining, onUpgrade }) => (
  <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-6 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <AlertTriangle className="text-orange-400" size={24} />
      <h3 className="text-xl font-bold text-white">Daily credit reached</h3>
    </div>
    <p className="text-white/80 mb-4">
      You have already generated your free plan for today. Come back tomorrow for a new free plan!
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

export default DailyLimitNotice; 