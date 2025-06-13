import { useEffect, useState } from 'react';
import { BackgroundData } from '../types';

interface BackgroundMediaProps {
  background: BackgroundData | null;
}

export function BackgroundMedia({ background }: BackgroundMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<BackgroundData | null>(null);
  const [fallbackImage, setFallbackImage] = useState<string>('');
  
  // 随机选择一张回退图片
  const fallbackImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];
  
  useEffect(() => {
    // 随机选择一张回退图片
    const randomFallback = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    setFallbackImage(randomFallback);
  }, []);
  
  useEffect(() => {
    if (background) {
      setIsLoaded(false);
      // Add a small delay before switching backgrounds to ensure smooth transition
      const timer = setTimeout(() => {
        setCurrentBackground(background);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [background]);

  const handleImageError = () => {
    setIsLoaded(true); // 显示回退图片
  };
  
  return (
    <div className="background-container">
      {/* 回退背景图片 */}
      <img
        src={fallbackImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Color overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-[-1]"></div>
      
      {/* 主背景图片 */}
      {currentBackground && (
        <img
          src={currentBackground.url}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={handleImageError}
        />
      )}
    </div>
  );
}