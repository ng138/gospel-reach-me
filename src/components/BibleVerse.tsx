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
      <div className="verse-container min-h-[280px] flex items-center justify-center mb-24">
        <p className="text-slate-600">Could not load verse. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="verse-container min-h-[280px] flex flex-col justify-between mb-24">
      {/* Verse content area with fixed height */}
      <div className="flex-1 flex flex-col justify-center">
        <div 
          className={`transition-opacity duration-300 ease-in-out ${
            isTransitioning ? 'opacity-30' : 'opacity-100'
          }`}
        >
          {displayVerse ? (
            <>
              <blockquote className="verse-text mb-4">
                "{displayVerse.verse_content || displayVerse.text}"
              </blockquote>
              <cite className="verse-reference">
                — {displayVerse.reference}
              </cite>
            </>
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
      
      {/* Button area */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center justify-center w-12 h-12 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg shadow-sm transition-colors duration-200"
          title="Get a new verse"
        >
          <RefreshCw 
            size={20} 
            className={isLoading ? 'animate-spin' : ''} 
          />
        </button>
      </div>
    </div>
  );
}