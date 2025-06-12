import { useState, useEffect } from 'react';
import { getAllLanguages } from '../services/apiService';
import { Language } from '../types';

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const langData = await getAllLanguages();
        setLanguages(langData);
      } catch (error) {
        console.error('Failed to load languages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLanguages();
  }, []);
  
  return { languages, isLoading };
}