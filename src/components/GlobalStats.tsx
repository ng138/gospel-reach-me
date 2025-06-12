import { useState, useEffect } from 'react';
import { getGlobalStats, subscribeToStatsUpdates } from '../services/apiService';
import { Globe } from 'lucide-react';

export function GlobalStats() {
  const [stats, setStats] = useState({
    total: 0,
    countries: {} as Record<string, number>,
    isReal: false
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const globalData = await getGlobalStats();
        setStats(globalData);
      } catch (error) {
        console.error('Failed to load global stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchGlobalStats();
    
    // Subscribe to real-time updates to trigger global stats refresh
    const unsubscribe = subscribeToStatsUpdates(() => {
      // When local stats change, refresh global stats to get updated totals
      fetchGlobalStats();
    });
    
    // Set up polling every 30 seconds for global stats
    const globalInterval = setInterval(fetchGlobalStats, 30000);
    
    return () => {
      clearInterval(globalInterval);
      unsubscribe();
    };
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
    <div className="text-center py-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Globe className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold text-slate-800">Global Statistics</h3>
      </div>
      
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {formattedTotal}
      </div>
      <p className="text-lg text-slate-600 mb-3">
        Gospel activations across {countryCount} countries
      </p>
      
      {/* Data source indicator */}
      <div className="flex items-center justify-center gap-1">
        <div className={`w-2 h-2 rounded-full ${stats.isReal ? 'bg-green-500' : 'bg-orange-400'}`} />
        <span className="text-sm text-slate-500">
          {stats.isReal ? 'Real-time data' : 'Live simulation'}
        </span>
      </div>
    </div>
  );
}