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

  useEffect(() => {
    if (verse && verse !== displayVerse) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayVerse(verse);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [verse, displayVerse]);

  const currentVerse = displayVerse || verse;

  return (
    <div className="text-center space-y-6 pb-24">
      {/* 经文内容 */}
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {currentVerse ? (
          <div className="space-y-4">
            {/* 经文文本 */}
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-white/90 max-w-4xl mx-auto">
              "{currentVerse.verse_content || currentVerse.text}"
            </blockquote>
            
            {/* 经文出处 */}
            <cite className="block text-lg md:text-xl text-white/70 font-medium">
              — {currentVerse.reference}
            </cite>
          </div>
        ) : (
          <div className="text-white/50">
            <p className="text-xl">Loading verse...</p>
          </div>
        )}
      </div>

      {/* 刷新按钮 */}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="group inline-flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 backdrop-blur-sm border border-white/20 rounded-full 
                 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <RefreshCw 
          className={`w-5 h-5 text-white transition-transform duration-200 
                     ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
        />
        <span className="text-white font-medium">
          {isLoading ? 'Loading...' : 'New Verse'}
        </span>
      </button>
    </div>
  );
}