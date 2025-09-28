import React from 'react';
import { WeatherData } from '../types/weather';

export interface WeatherResultsProps {
  data: WeatherData;
  isComparison?: boolean;
}

const WeatherResults: React.FC<WeatherResultsProps> = ({ data, isComparison = false }) => {
  const { location, probabilities, ai_insights, data_sources, analysis_period } = data;

  // Prepare data for display
  const conditions = Object.entries(probabilities).filter(([key, value]) => 
    key !== 'summary' && 'label' in value
  );

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 ${isComparison ? 'h-fit' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">
            {location.city_name || `${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`}
          </h3>
          <p className="text-white/70 text-sm">{analysis_period}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-white">
            {probabilities.summary.risk_level}
          </div>
          <div className="text-sm text-white/70">
            {probabilities.summary.data_quality} Quality
          </div>
        </div>
      </div>

      {/* Probability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {conditions.map(([key, condition]) => {
          if ('label' in condition) {
            return (
              <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{condition.label}</h4>
                  <span className="text-white/60 text-sm">{condition.threshold}</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {condition.probability.toFixed(1)}%
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${condition.probability}%` }}
                  ></div>
                </div>
                <p className="text-white/70 text-xs mt-2">{condition.description}</p>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* AI Insights */}
      {ai_insights && !isComparison && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            AI Weather Insights
          </h4>
          <p className="text-white/90 text-sm leading-relaxed">{ai_insights}</p>
        </div>
      )}

      {/* Data Sources */}
      {!isComparison && (
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Data Sources</h4>
          <div className="flex flex-wrap gap-2">
            {data_sources.map((source, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
              >
                {source}
              </span>
            ))}
          </div>
          <div className="mt-3 text-white/60 text-xs">
            Analysis based on {probabilities.summary.data_points} data points from {probabilities.summary.date_range}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherResults;
