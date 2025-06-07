import React, { useState, useEffect, useRef } from 'react';

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

export default GoogleAdBanner; 