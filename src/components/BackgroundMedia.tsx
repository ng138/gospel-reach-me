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

  // Default fallback gradient
  const defaultGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  
  return (
    <div
      className="background-container"
      style={{
        background: currentBackground?.type === 'gradient'
          ? currentBackground.background
          : defaultGradient
      }}
    >
      {/* Color overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-[-1]"></div>
      
      {/* Only render image overlays for image backgrounds */}
      {currentBackground?.type === 'image' && (
        <img
          src={currentBackground.url}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}