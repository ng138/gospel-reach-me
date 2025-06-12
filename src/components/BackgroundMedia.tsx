import { useEffect, useState } from 'react';
import { BackgroundData } from '../types';

interface BackgroundMediaProps {
  background: BackgroundData | null;
}

export function BackgroundMedia({ background }: BackgroundMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<BackgroundData | null>(null);
  
  useEffect(() => {
    if (background) {
      setIsLoaded(false);
      // Add a small delay before switching backgrounds to ensure smooth transition
      const timer = setTimeout(() => {
        setCurrentBackground(background);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [background]);

  // Fallback background if the requested one fails to load
  const fallbackBg = "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1920";
  
  return (
    <div className="background-container">
      {/* Color overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-[-1]"></div>
      
      {currentBackground ? (
        <img 
          src={currentBackground.url}
          alt=""
          className={`${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            console.error('Image failed to load:', e);
            (e.target as HTMLImageElement).src = fallbackBg;
          }}
        />
      ) : (
        // Fallback while loading or if no background is available
        <img 
          src={fallbackBg} 
          alt="" 
          className="opacity-100"
        />
      )}
    </div>
  );
}