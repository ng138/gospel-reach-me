import { RefreshCw } from 'lucide-react';
import { VerseData } from '../types';

interface BibleVerseProps {
  verse: VerseData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BibleVerse({ verse, isLoading, onRefresh }: BibleVerseProps) {
  if (isLoading) {
    return (
      <div className="verse-container loading">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="verse-container error">
        <p>Could not load verse. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="verse-container">
      <blockquote className="verse-text">
        "{verse.text}"
      </blockquote>
      <cite className="verse-reference">
        — {verse.reference}
      </cite>
      
      <div className="flex justify-center mt-6">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
          title="Get a new verse"
        >
          <RefreshCw 
            size={20} 
            className={isLoading ? 'animate-spin' : ''} 
          />
          <span>New Verse</span>
        </button>
      </div>
    </div>
  );
}