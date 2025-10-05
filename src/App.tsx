import React, { useState } from 'react';
import Header from './components/Header';
import WeatherForm from './components/WeatherForm';
import WeatherResults from './components/WeatherResults';
import ComparisonView from './components/ComparisonView';
import AIChat from './components/AIChat';
import { WeatherData, LocationInput } from './types/weather';

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [comparisonData, setComparisonData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'single' | 'compare' | 'chat'>('single');

  const handleWeatherQuery = async (location: LocationInput, startDate: string, endDate?: string, datasetMode?: 'IMD' | 'Global' | 'Combined') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/weather/probability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          date_range: { start_date: startDate, end_date: endDate || startDate },
          include_ai_insights: true,
          dataset_mode: datasetMode || 'Combined'
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err) {
      console.error('Weather probability fetch error', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComparisonQuery = async (locations: LocationInput[], startDate: string, endDate?: string, datasetMode?: 'IMD' | 'Global' | 'Combined') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/weather/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations,
          date_range: { start_date: startDate, end_date: endDate || startDate },
          dataset_mode: datasetMode || 'Combined'
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch comparison data');

      const data = await response.json();
      setComparisonData(data.comparison_results);
    } catch (err) {
      console.error('Weather compare fetch error', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nasa-blue to-weather-blue">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {['single', 'compare', 'chat'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'single' | 'compare' | 'chat')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-nasa-blue'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {tab === 'single' ? 'Single Location' : tab === 'compare' ? 'Compare Locations' : 'AI Chat'}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'single' && (
          <div className="space-y-8">
            <WeatherForm onSubmit={handleWeatherQuery} isLoading={isLoading} />
            {weatherData && <WeatherResults data={weatherData} />}
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-8">
            <ComparisonView onSubmit={handleComparisonQuery} isLoading={isLoading} />
            {comparisonData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonData.map((data, index) => (
                  <WeatherResults key={index} data={data} isComparison />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && <AIChat />}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
