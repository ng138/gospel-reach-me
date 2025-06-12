import { useState, useEffect } from 'react';
import { getGlobalStats } from '../services/apiService';

export function GlobalStats() {
  const [stats, setStats] = useState({
    total: 0,
    countries: {} as Record<string, number>
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load global stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchStats();
    
    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchStats, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-40"></div>
        <div className="h-4 bg-slate-200 rounded w-60"></div>
      </div>
    );
  }

  // Format total with commas (e.g., 1,234,567)
  const formattedTotal = stats.total.toLocaleString();
  
  // Count number of countries
  const countryCount = Object.keys(stats.countries).length;

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
        {formattedTotal}
      </div>
      <p className="text-slate-600">
        Gospel activations across {countryCount} countries
      </p>
    </div>
  );
}