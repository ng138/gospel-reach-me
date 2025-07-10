// Text-to-Speech Service using Web Speech API
export class TTSService {
  private static instance: TTSService;
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean;

  // Language code mapping for Web Speech API
  private static LANGUAGE_MAP: Record<string, string> = {
    'EN': 'en-US',
    'ES': 'es-ES',
    'FR': 'fr-FR',
    'DE': 'de-DE',
    'IT': 'it-IT'
  };

  private constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSupported = 'speechSynthesis' in window;
  }

  static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  async speak(text: string, language: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: 'male' | 'female';
  }): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Web Speech API is not supported in this browser');
    }

    // Stop any ongoing speech
    this.stop();

    // Create new utterance
    this.currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Set language
    const langCode = TTSService.LANGUAGE_MAP[language] || 'en-US';
    this.currentUtterance.lang = langCode;

    // Apply options
    this.currentUtterance.rate = options?.rate || 0.9;
    this.currentUtterance.pitch = options?.pitch || 1.0;
    this.currentUtterance.volume = options?.volume || 1.0;

    // Try to select appropriate voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = this.selectVoice(voices, langCode, options?.voice);
    if (preferredVoice) {
      this.currentUtterance.voice = preferredVoice;
    }

    // Return a promise that resolves when speech ends
    return new Promise((resolve, reject) => {
      if (!this.currentUtterance) {
        reject(new Error('No utterance created'));
        return;
      }

      this.currentUtterance.onend = () => resolve();
      this.currentUtterance.onerror = (event) => reject(new Error(event.error));

      // Speak
      this.synthesis.speak(this.currentUtterance);
    });
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }

  private selectVoice(voices: SpeechSynthesisVoice[], langCode: string, preferredGender?: 'male' | 'female'): SpeechSynthesisVoice | null {
    // Filter voices by language
    const langVoices = voices.filter(voice => voice.lang.startsWith(langCode.split('-')[0]));
    
    if (langVoices.length === 0) {
      return null;
    }

    // Try to find voice by gender preference
    if (preferredGender) {
      const genderKeywords = preferredGender === 'male' 
        ? ['male', 'man', 'guy', 'masculine']
        : ['female', 'woman', 'girl', 'feminine'];
      
      const genderVoice = langVoices.find(voice => 
        genderKeywords.some(keyword => 
          voice.name.toLowerCase().includes(keyword)
        )
      );
      
      if (genderVoice) return genderVoice;
    }

    // Return the first available voice for the language
    return langVoices[0];
  }

  // Get available voices for a language
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const langCode = TTSService.LANGUAGE_MAP[language] || 'en-US';
    const voices = this.synthesis.getVoices();
    return voices.filter(voice => voice.lang.startsWith(langCode.split('-')[0]));
  }

  // Preload voices (some browsers require interaction first)
  async preloadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        resolve();
      } else {
        this.synthesis.onvoiceschanged = () => resolve();
      }
    });
  }
}

// Export singleton instance
export const ttsService = TTSService.getInstance();