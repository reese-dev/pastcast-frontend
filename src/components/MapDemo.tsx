import React from 'react';
import LocationMap from './LocationMap';

const MapDemo: React.FC = () => {
  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    console.log('Selected location:', { lat, lng, address });
    alert(`Selected: ${address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-nasa-blue to-weather-blue p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          PastCast - Interactive Map Demo
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Click anywhere on the map to select a location
          </h2>
          
          <LocationMap 
            onLocationSelect={handleLocationSelect}
            height="500px"
          />
          
          <div className="mt-6 text-center">
            <p className="text-white/80">
              This interactive map allows you to select any location in the world for weather analysis.
              Click anywhere on the map or use the search box to find specific places.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDemo;
