import { RefreshCw } from 'lucide-react';
import { VerseData } from '../types';
import { useState, useEffect } from 'react';

interface BibleVerseProps {
  verse: VerseData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BibleVerse({ verse, isLoading, onRefresh }: BibleVerseProps) {
  const [displayVerse, setDisplayVerse] = useState<VerseData | null>(verse);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle verse transitions with fade effect
  useEffect(() => {
    if (isLoading) {
      // Start fade out
      setIsTransitioning(true);
    } else if (verse && verse !== displayVerse) {
      // New verse loaded, fade in after a short delay
      const timer = setTimeout(() => {
        setDisplayVerse(verse);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    } else if (verse) {
      // Initial load
      setDisplayVerse(verse);
      setIsTransitioning(false);
    }
  }, [verse, isLoading, displayVerse]);

  if (!displayVerse && !isLoading) {
    return (
      <div className="glass-card mb-6 h-60 flex items-center justify-center">
        <p className="text-slate-600 text-center">Could not load verse. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="glass-card mb-6 h-60 relative">
      {/* Verse content area with padding bottom to avoid button overlap */}
      <div className="h-full flex flex-col justify-center text-center pb-12">
        <div 
          className={`transition-opacity duration-300 ease-in-out ${
            isTransitioning ? 'opacity-30' : 'opacity-100'
          }`}
        >
          {displayVerse ? (
            <div className="flex flex-col items-center justify-center">
              <blockquote className="verse-text mb-4 text-center">
                "{displayVerse.verse_content || displayVerse.text}"
              </blockquote>
              <cite className="verse-reference text-center">
                — {displayVerse.reference}
              </cite>
            </div>
          ) : (
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4 mx-auto max-w-md"></div>
              <div className="h-4 bg-slate-200 rounded mb-2 mx-auto max-w-lg"></div>
              <div className="h-4 bg-slate-200 rounded mb-2 mx-auto max-w-xl"></div>
              <div className="h-4 bg-slate-200 rounded mb-4 mx-auto max-w-sm"></div>
              <div className="h-4 bg-slate-200 rounded mx-auto max-w-xs"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* 完全固定的底部刷新按钮 - 不受内容变化影响 */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        title="Get a new verse"
        className="absolute bottom-3 left-1/2 transform -translate-x-1/2 scale-[0.625] w-9 h-9 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center z-10"
      >
        <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}