import React, { useState } from 'react';
import { LocationInput } from '../types/weather';
import LocationMap from './LocationMap';

interface ComparisonViewProps {
  onSubmit: (locations: LocationInput[], startDate: string, endDate?: string) => void;
  isLoading: boolean;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ onSubmit, isLoading }) => {
  const [locations, setLocations] = useState<Array<LocationInput & { id: string }>>([
    { id: '1', latitude: 0, longitude: 0, city_name: '' },
    { id: '2', latitude: 0, longitude: 0, city_name: '' }
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useDateRange, setUseDateRange] = useState(false);

  const addLocation = () => {
    const newId = (locations.length + 1).toString();
    setLocations([...locations, { id: newId, latitude: 0, longitude: 0, city_name: '' }]);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 2) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const handleLocationSelect = (index: number, lat: number, lng: number, address?: string) => {
    const updated = [...locations];
    updated[index] = { 
      ...updated[index], 
      latitude: lat, 
      longitude: lng, 
      city_name: address 
    };
    setLocations(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate locations
    const validLocations = locations.filter(loc => 
      loc.latitude !== 0 && loc.longitude !== 0
    );
    
    if (validLocations.length < 2) {
      alert('Please select at least 2 locations on the maps to compare');
      return;
    }
    
    if (!startDate) {
      alert('Please select a start date');
      return;
    }

    // Remove id field before submitting
    const locationsToSubmit = validLocations.map(({ id, ...loc }) => loc);
    onSubmit(locationsToSubmit, startDate, useDateRange ? endDate : undefined);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Compare Weather Probabilities</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Locations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-white font-medium">Select Locations to Compare</label>
            <button
              type="button"
              onClick={addLocation}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              + Add Location
            </button>
          </div>
          
          <div className="space-y-6">
            {locations.map((location, index) => (
              <div key={location.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Location {index + 1}</h4>
                  {locations.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <LocationMap 
                  onLocationSelect={(lat, lng, address) => handleLocationSelect(index, lat, lng, address)}
                  initialLat={location.latitude || undefined}
                  initialLng={location.longitude || undefined}
                  height="250px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-white font-medium mb-2">Analysis Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>

        {/* Date Range Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="useDateRange"
            checked={useDateRange}
            onChange={(e) => setUseDateRange(e.target.checked)}
            className="w-4 h-4 text-nasa-blue bg-white/20 border-white/30 rounded focus:ring-nasa-blue"
          />
          <label htmlFor="useDateRange" className="text-white">
            Use date range (optional)
          </label>
        </div>

        {/* End Date */}
        {useDateRange && (
          <div>
            <label className="block text-white font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-nasa-red to-nasa-blue text-white font-bold py-4 px-6 rounded-lg hover:from-nasa-blue hover:to-nasa-red transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Comparing Weather Data...</span>
            </div>
          ) : (
            'Compare Weather Probabilities'
          )}
        </button>
      </form>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h3 className="text-white font-medium mb-2">Comparison Features:</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Side-by-side probability analysis</li>
          <li>• Risk level comparison</li>
          <li>• Best/worst locations for each condition</li>
          <li>• Data quality assessment</li>
        </ul>
      </div>
    </div>
  );
};

export default ComparisonView;
