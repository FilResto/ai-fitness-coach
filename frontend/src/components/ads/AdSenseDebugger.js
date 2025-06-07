import React from 'react';

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

export default AdSenseDebugger; 