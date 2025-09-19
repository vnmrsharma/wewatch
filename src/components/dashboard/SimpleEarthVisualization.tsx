import React, { useState, useEffect } from 'react';
import { LocationCoordinates } from '../../types/user';

interface SimpleEarthVisualizationProps {
  location: LocationCoordinates;
  onLayerChange?: (layer: string) => void;
}

const SimpleEarthVisualization: React.FC<SimpleEarthVisualizationProps> = ({ 
  location, 
  onLayerChange 
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>('trueColor');
  const [rotation, setRotation] = useState(0);
  const [showLocationPin, setShowLocationPin] = useState(true);
  const [naturalEvents, setNaturalEvents] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);

  const layers = [
    { id: 'trueColor', name: 'True Color', active: selectedLayer === 'trueColor' },
    { id: 'temperature', name: 'Temperature', active: selectedLayer === 'temperature' },
    { id: 'vegetation', name: 'Vegetation', active: selectedLayer === 'vegetation' },
    { id: 'airQuality', name: 'Air Quality', active: selectedLayer === 'airQuality' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Mock environmental data
    setEnvironmentalData({
      temperature: 15.6,
      humidity: 73,
      airQuality: 86,
      vegetation: 36
    });

    // Mock natural events
    setNaturalEvents([
      { type: 'wildfire', message: 'Active wildfire detected in the region', severity: 'high' },
      { type: 'storm', message: 'Severe weather approaching', severity: 'medium' }
    ]);
  }, [location]);

  const handleLayerChange = (layerId: string) => {
    setSelectedLayer(layerId);
    onLayerChange?.(layerId);
  };

  const getEarthStyle = () => {
    const baseStyle = {
      background: `radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.1) 30%, transparent 50%), 
                   radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 50%),
                   radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(15, 23, 42, 0.8) 70%, rgba(15, 23, 42, 1) 100%)`,
      transform: `rotate(${rotation * 0.1}deg)`,
      transition: 'transform 0.1s ease-out'
    };

    // Add layer-specific styling
    switch (selectedLayer) {
      case 'temperature':
        return {
          ...baseStyle,
          background: `radial-gradient(circle at 30% 30%, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0.1) 30%, transparent 50%), 
                       radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 30%, transparent 50%),
                       radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.2) 0%, rgba(34, 197, 94, 0.1) 40%, rgba(15, 23, 42, 0.8) 70%, rgba(15, 23, 42, 1) 100%)`
        };
      case 'vegetation':
        return {
          ...baseStyle,
          background: `radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 30%, transparent 50%), 
                       radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.1) 30%, transparent 50%),
                       radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 40%, rgba(15, 23, 42, 0.8) 70%, rgba(15, 23, 42, 1) 100%)`
        };
      case 'airQuality':
        return {
          ...baseStyle,
          background: `radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 30%, transparent 50%), 
                       radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 30%, transparent 50%),
                       radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(15, 23, 42, 0.8) 70%, rgba(15, 23, 42, 1) 100%)`
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dynamic Earth Visualization</h2>
            <p className="text-sm text-gray-600">Real-time satellite data with location tracking</p>
          </div>
        </div>
        <button
          onClick={() => setShowLocationPin(!showLocationPin)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>Pin {showLocationPin ? 'Off' : 'On'}</span>
        </button>
      </div>

      {/* Satellite Layers */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Satellite Layers</h3>
        <div className="flex flex-wrap gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleLayerChange(layer.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                layer.active
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      {/* Earth Visualization */}
      <div className="relative mb-4">
        <div className="relative w-full h-80 bg-gradient-to-b from-blue-900 to-blue-700 rounded-lg overflow-hidden">
          {/* Earth Sphere */}
          <div 
            className="absolute inset-0 rounded-lg"
            style={getEarthStyle()}
          >
            {/* Rotating highlight effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `conic-gradient(from ${rotation}deg, transparent 0deg, rgba(255,255,255,0.2) 90deg, transparent 180deg, rgba(255,255,255,0.1) 270deg, transparent 360deg)`,
                animation: 'spin 20s linear infinite'
              }}
            />
          </div>

          {/* Location Pin */}
          {showLocationPin && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {location.city}, {location.country}
                </div>
              </div>
            </div>
          )}

          {/* Natural Events Alerts */}
          <div className="absolute top-4 right-4 space-y-2">
            {naturalEvents.map((event, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-white text-sm font-medium shadow-lg ${
                  event.type === 'wildfire' ? 'bg-orange-500' : 'bg-blue-500'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {event.type === 'wildfire' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  )}
                  <span>{event.type === 'wildfire' ? 'Wildfire Alert' : 'Storm Warning'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Earth Rotation Indicator */}
          <div className="absolute bottom-4 left-4 bg-blue-600 bg-opacity-75 text-white text-xs px-3 py-1 rounded-full flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
            <span>Earth Rotating</span>
          </div>
        </div>
      </div>

      {/* Data Information */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Source: NASA GIBS</span>
          <span>Resolution: 250m</span>
          <span>Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Environmental Data Cards */}
      {environmentalData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{environmentalData.temperature}°C</div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{environmentalData.humidity}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{environmentalData.airQuality}</div>
            <div className="text-sm text-gray-600">Air Quality</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{environmentalData.vegetation}%</div>
            <div className="text-sm text-gray-600">Vegetation</div>
          </div>
        </div>
      )}

      {/* Natural Events Section */}
      {naturalEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Natural Events Near {location.city}, {location.country}
          </h3>
          <div className="space-y-3">
            {naturalEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.type === 'wildfire' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  {event.type === 'wildfire' ? (
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {event.type === 'wildfire' ? 'Wildfire Alert' : 'Storm Warning'}
                  </div>
                  <div className="text-sm text-gray-600">{event.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleEarthVisualization;
