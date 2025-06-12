// Language and version types
export interface Language {
  code: string;
  name: string;
  versions: string[];
}

// Bible verse data
export interface VerseData {
  text: string;
  reference: string;
  index: string;
}

// Background media data
export interface BackgroundData {
  type: 'image';
  url: string;
}

// Name submission data
export interface NameSubmission {
  user_name: string;
  user_id: string;
}

// Declare global AdSense type
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}