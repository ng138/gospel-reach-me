import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const USER_ID_KEY = 'gospel_user_id';

export function useAnonymousId(): string {
  const [anonymousId, setAnonymousId] = useState('');
  
  useEffect(() => {
    // Try to get existing ID from localStorage
    const existingId = localStorage.getItem(USER_ID_KEY);
    
    if (existingId) {
      setAnonymousId(existingId);
    } else {
      // Generate a new UUID if none exists
      const newId = uuidv4();
      localStorage.setItem(USER_ID_KEY, newId);
      setAnonymousId(newId);
    }
  }, []);
  
  return anonymousId;
}