import { useState, useEffect } from 'react';
import { getGlobalStats } from '../services/apiService';

export function WorldMap() {
  const [stats, setStats] = useState({
    total: 0,
    countries: {} as Record<string, number>
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load global stats:', error);
      }
    };
    
    // Initial fetch
    fetchStats();
    
    // Set up polling every 10 seconds
    const intervalId = setInterval(fetchStats, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format total with commas (e.g., 1,234,567)
  const formattedTotal = stats.total.toLocaleString();
  
  // Count number of countries
  const countryCount = Object.keys(stats.countries).length;

  return (
    <div className="map-container">
      <div className="text-center text-white p-8">
        <div className="text-4xl font-bold mb-2">
          {formattedTotal}
        </div>
        <div className="text-lg opacity-80">
          Gospel activations across {countryCount} countries
        </div>
      </div>
    </div>
  );
}