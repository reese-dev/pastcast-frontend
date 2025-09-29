import React from 'react';
import { LocationInput } from '../types/weather';
import LocationMap from './LocationMap';

interface WeatherFormProps {
  onSubmit: (location: LocationInput, startDate: string, endDate?: string, datasetMode?: 'IMD' | 'Global' | 'Combined') => Promise<void>;
  isLoading: boolean;
}

const WeatherForm: React.FC<WeatherFormProps> = ({ onSubmit, isLoading }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [datasetMode, setDatasetMode] = React.useState<'IMD' | 'Global' | 'Combined'>('Combined');

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLocation) {
      alert('Please select a location on the map');
      return;
    }
    
    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    onSubmit({ 
      latitude: selectedLocation.lat, 
      longitude: selectedLocation.lng, 
      city_name: selectedLocation.address 
    }, startDate, endDate || undefined, datasetMode);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Weather Probability Analysis</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Selection with Map */}
        <div>
          <h3 className="text-white font-medium mb-4">Select Location</h3>
          <LocationMap 
            onLocationSelect={handleLocationSelect}
            height="300px"
          />
        </div>

        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Dataset Source */}
        <div>
          <label className="block text-white font-medium mb-2">Dataset Source</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(['IMD', 'Global', 'Combined'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setDatasetMode(mode)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  datasetMode === mode
                    ? 'bg-white text-nasa-blue border-white'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <p className="text-white/60 text-xs mt-2">IMD focuses on India; Global uses NASA/NOAA; Combined merges when available.</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !selectedLocation}
          className="w-full bg-gradient-to-r from-nasa-blue to-weather-blue text-white font-bold py-4 px-6 rounded-lg hover:from-weather-blue hover:to-nasa-blue transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing Weather Data...</span>
            </div>
          ) : (
            'Get Weather Probabilities'
          )}
        </button>
      </form>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-medium mb-2">What PastCast Analyzes:</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Rain probability (precipitation {'>'} 1mm/day)</li>
          <li>• Extreme heat probability (temperature {'>'} 40°C for India, 35°C elsewhere)</li>
          <li>• High wind probability (wind speed {'>'} 20 km/h)</li>
          <li>• Cloudy conditions (cloud cover {'>'} 70%)</li>
          <li>• Overall good weather probability</li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherForm;
