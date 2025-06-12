import { useEffect, useRef } from 'react';

export function AdDisplay() {
  const adRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Only initialize if the ad container is empty
    if (window.adsbygoogle && adRef.current && !adRef.current.firstChild) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <div className="ad-container">
      <div className="text-sm text-slate-500 mb-2">Sponsored</div>
      <ins 
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-REPLACE_WITH_YOUR_PUBLISHER_ID"
        data-ad-slot="REPLACE_WITH_YOUR_AD_SLOT_ID"
        data-ad-format="auto"
        data-full-width-responsive="true">
      </ins>
    </div>
  );
}