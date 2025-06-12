import { useState, useEffect } from 'react';

const USER_ID_KEY = 'gospel_user_id';

// Simple UUID v4 generator (no external dependency)
function generateSimpleId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useAnonymousId(): string {
  const [anonymousId, setAnonymousId] = useState('');
  
  useEffect(() => {
    // Try to get existing ID from localStorage
    const existingId = localStorage.getItem(USER_ID_KEY);
    
    if (existingId) {
      setAnonymousId(existingId);
    } else {
      // Generate a new ID if none exists
      const newId = generateSimpleId();
      localStorage.setItem(USER_ID_KEY, newId);
      setAnonymousId(newId);
    }
  }, []);
  
  return anonymousId;
}