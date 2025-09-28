import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-nasa-red to-nasa-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PastCast</h1>
              <p className="text-white/80 text-sm">Historical Weather Probability Tool</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-white/80 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>NASA Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>20+ Years</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>AI Insights</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-white/90 text-lg">
            Predict weather probabilities using NASA Earth observation data
          </p>
          <p className="text-white/70 text-sm mt-1">
            Powered by NASA POWER, GPM, MERRA-2, and MODIS datasets
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
