import { useState, useEffect } from 'react';
import { getGlobalStats, subscribeToStatsUpdates } from '../services/apiService';
import { Globe, Heart } from 'lucide-react';

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
      <div className="py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-48"></div>
            <div className="h-12 bg-slate-200 rounded w-32"></div>
            <div className="h-4 bg-slate-200 rounded w-60"></div>
          </div>
        </div>
      </div>
    );
  }

  // Format total with commas (e.g., 1,234,567)
  const formattedTotal = stats.total.toLocaleString();
  
  // Count number of countries
  const countryCount = Object.keys(stats.countries).length;

  return (
    <div className="py-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Heart className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-slate-800">Gospel Reach Times</h3>
        </div>
        
        <div className="space-y-4">
          {/* Total reach count */}
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {formattedTotal}
            </div>
            <p className="text-base text-slate-600">
              Total gospel reaches
            </p>
          </div>
          
          {/* Country coverage */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold text-blue-600">{countryCount}</span>
            </div>
            <p className="text-base text-slate-600">
              Gospel activations across {countryCount} countries
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}