// Language and version types
export interface Language {
  code: string;
  name: string;
  versions: string[];
}

// Bible verse data
export interface VerseData {
  text: string;
  verse_content: string; // 经文内容（与text相同，但保持兼容性）
  reference: string;
  index: string;
  language?: string; // 语言代码
  version?: string;  // 版本代码
}

// Background media data
export interface BackgroundData {
  type: 'image';
  /** Image URL */
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