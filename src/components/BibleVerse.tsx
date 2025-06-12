import { RefreshCcw } from 'lucide-react';
import { VerseData } from '../types';

interface BibleVerseProps {
  verse: VerseData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function BibleVerse({ verse, isLoading, onRefresh }: BibleVerseProps) {
  if (!verse) {
    return (
      <div className="verse-container">
        <p className="text-slate-600">Could not load verse. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className={`verse-container ${!isLoading ? 'verse-fade-in' : ''}`}>
      <blockquote 
        className="verse-text"
        style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out' }}
      >
        "{verse.text}"
      </blockquote>
      <div className="verse-divider"></div>
      <div className="flex flex-col items-center gap-4">
        <cite 
          className="verse-reference block"
          style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s ease-in-out' }}
        >
          {verse.reference}
        </cite>
        <button 
          onClick={onRefresh}
          className="p-2 rounded-lg bg-[#6FD08C] text-white shadow-sm hover:bg-opacity-90 transition-all"
          disabled={isLoading}
          aria-label="New verse"
        >
          <RefreshCcw 
            size={20} 
            className={isLoading ? 'animate-spin' : ''}
          />
        </button>
      </div>
    </div>
  );
}