import { useState, useEffect } from 'react';
import { getGlobalStats, getLocalStats, subscribeToStatsUpdates } from '../services/apiService';
import { BarChart3, Users, Globe } from 'lucide-react';

export function GlobalStats() {
  const [stats, setStats] = useState({
    total: 0,
    countries: {} as Record<string, number>,
    isReal: false
  });
  
  const [localStats, setLocalStats] = useState({
    verseViews: 0,
    refreshClicks: 0,
    languageSwitches: {} as Record<string, number>,
    versionSwitches: {} as Record<string, number>,
    nameSubmissions: 0,
    lastUpdated: Date.now(),
    sessionId: ''
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
    setLocalStats(getLocalStats());
    
    // Subscribe to real-time local stats updates
    const unsubscribe = subscribeToStatsUpdates((newStats) => {
      setLocalStats(newStats);
    });
    
    // Set up polling every 30 seconds for global stats only
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
  
  // Get top languages from local stats
  const topLanguages = Object.entries(localStats.languageSwitches)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
    
  // Calculate total local interactions
  const totalInteractions = localStats.verseViews + localStats.refreshClicks + localStats.nameSubmissions;

  return (
    <div className="space-y-6">
      {/* Global Stats */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-slate-800">Global Statistics</h3>
        </div>
        
        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
          {formattedTotal}
        </div>
        <p className="text-slate-600 mb-2">
          Gospel activations across {countryCount} countries
        </p>
        
        {/* Simple data source indicator */}
        <div className="flex items-center justify-center gap-1">
          <div className={`w-2 h-2 rounded-full ${stats.isReal ? 'bg-green-500' : 'bg-orange-400'}`} />
          <span className="text-sm text-slate-500">
            {stats.isReal ? 'Real-time data' : 'Simulated data'}
          </span>
        </div>
      </div>
      
      {/* Local Session Stats - Only show if user has interactions */}
      {totalInteractions > 0 && (
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="text-lg font-semibold text-slate-800 mb-3 text-center">
            Your Session
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BarChart3 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-lg font-bold text-slate-800">{localStats.verseViews}</div>
              <div className="text-xs text-slate-600">Verses</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-lg font-bold text-slate-800">{localStats.refreshClicks}</div>
              <div className="text-xs text-slate-600">Refreshes</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">{localStats.nameSubmissions}</div>
              <div className="text-xs text-slate-600">Names</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-slate-800">{totalInteractions}</div>
              <div className="text-xs text-slate-600">Total</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Top Languages - Only show if user has language switches */}
      {topLanguages.length > 0 && (
        <div className="text-center">
          <h4 className="text-sm font-medium text-slate-700 mb-2">Languages Used</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {topLanguages.map(([lang, count]) => (
              <span key={lang} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {lang}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}