import { useEffect, useState, useRef } from 'react';
import { BackgroundData } from '../types';
import { getRandomBackground } from '../services/apiService';

interface BackgroundMediaProps {
  background: BackgroundData | null;
}

export function BackgroundMedia({ background }: BackgroundMediaProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<BackgroundData | null>(null);
  const [fallbackImage, setFallbackImage] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const loadTimeoutRef = useRef<number | null>(null);
  const maxRetries = 3; // 最大重试次数
  
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

  // 获取下一张随机图片的函数
  const fetchNextRandomImage = async () => {
    if (retryCount >= maxRetries) {
      console.log('达到最大重试次数，停止尝试');
      setIsLoaded(true); // 显示回退图片
      return;
    }

    try {
      const nextBackground = await getRandomBackground();
      setRetryCount(prev => prev + 1);
      setCurrentBackground(nextBackground);
    } catch (error) {
      console.error('获取下一张图片失败:', error);
      setIsLoaded(true); // 显示回退图片
    }
  };

  // 处理图片加载超时
  const handleImageTimeout = () => {
    console.log(`图片加载超时 (500ms)，尝试加载下一张图片 (重试 ${retryCount + 1}/${maxRetries})`);
    fetchNextRandomImage();
  };
  
  useEffect(() => {
    if (background) {
      setIsLoaded(false);
      setRetryCount(0); // 重置重试计数
      
      // 清除之前的超时定时器
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      // 设置500ms延迟后开始加载图片
      const timer = setTimeout(() => {
        setCurrentBackground(background);
        
        // 设置500ms超时检测
        loadTimeoutRef.current = setTimeout(() => {
          if (!isLoaded) {
            handleImageTimeout();
          }
        }, 500);
      }, 500);
      
      return () => {
        clearTimeout(timer);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    }
  }, [background, isLoaded]);

  // 当currentBackground变化时，重新设置超时检测
  useEffect(() => {
    if (currentBackground && !isLoaded) {
      // 清除之前的超时定时器
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      // 设置新的500ms超时检测
      loadTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          handleImageTimeout();
        }
      }, 500);
      
      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    }
  }, [currentBackground, isLoaded, retryCount]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setRetryCount(0); // 成功加载后重置重试计数
    
    // 清除超时定时器
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };

  const handleImageError = () => {
    console.log('图片加载错误，尝试下一张图片');
    fetchNextRandomImage();
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
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
}