import React, { useState, useEffect, useRef } from 'react';
import { LocationCoordinates } from '../../types/user';
import EnhancedNasaService from '../../services/enhancedNasaService';

interface DynamicEarthVisualizationProps {
  location: LocationCoordinates;
  onLayerChange?: (layer: string) => void;
}

interface EarthLayer {
  id: string;
  name: string;
  description: string;
  resolution: string;
  url: string;
  active: boolean;
}

const DynamicEarthVisualization: React.FC<DynamicEarthVisualizationProps> = ({ 
  location, 
  onLayerChange 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState<EarthLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('trueColor');
  const [isLoading, setIsLoading] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [showLocationPin, setShowLocationPin] = useState(true);
  const [naturalEvents, setNaturalEvents] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  const nasaService = new EnhancedNasaService(import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY');

  useEffect(() => {
    initializeLayers();
    loadNaturalEvents();
    loadEnvironmentalData();
  }, [location]);

  useEffect(() => {
    loadSatelliteImagery();
  }, [location, selectedLayer]);

  useEffect(() => {
    startEarthRotation();
  }, []);

  const initializeLayers = async () => {
    try {
      const availableLayers = nasaService.getAvailableLayers();
      const earthLayers: EarthLayer[] = [
        {
          id: 'trueColor',
          name: 'True Color',
          description: 'Natural color satellite imagery',
          resolution: '250m',
          url: '',
          active: true
        },
        {
          id: 'temperature',
          name: 'Temperature',
          description: 'Land surface temperature',
          resolution: '1km',
          url: '',
          active: false
        },
        {
          id: 'vegetation',
          name: 'Vegetation',
          description: 'Vegetation health index',
          resolution: '250m',
          url: '',
          active: false
        },
        {
          id: 'airQuality',
          name: 'Air Quality',
          description: 'Aerosol optical depth',
          resolution: '10km',
          url: '',
          active: false
        }
      ];
      setLayers(earthLayers);
    } catch (error) {
      console.error('Failed to initialize layers:', error);
    }
  };

  const loadSatelliteImagery = async () => {
    setIsLoading(true);
    setImageError(false);
    
    try {
      const multiLayerData = await nasaService.getMultiLayerSatelliteData(location);
      setCurrentImageUrl(multiLayerData[selectedLayer as keyof typeof multiLayerData]);
    } catch (error) {
      console.error('Failed to load satellite imagery:', error);
      setImageError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNaturalEvents = async () => {
    try {
      const events = await nasaService.getNaturalEvents(location, 500);
      setNaturalEvents(events);
    } catch (error) {
      console.error('Failed to load natural events:', error);
    }
  };

  const loadEnvironmentalData = async () => {
    try {
      const data = await nasaService.getEnvironmentalData(location);
      setEnvironmentalData(data);
    } catch (error) {
      console.error('Failed to load environmental data:', error);
    }
  };

  const startEarthRotation = () => {
    const rotate = () => {
      setRotation(prev => (prev + 0.5) % 360);
      requestAnimationFrame(rotate);
    };
    rotate();
  };

  const handleLayerChange = (layerId: string) => {
    setSelectedLayer(layerId);
    setLayers(prev => prev.map(layer => ({
      ...layer,
      active: layer.id === layerId
    })));
    onLayerChange?.(layerId);
  };

  const getEventIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wildfires': return '🔥';
      case 'storms': return '⛈️';
      case 'volcanoes': return '🌋';
      case 'floods': return '🌊';
      case 'drought': return '☀️';
      default: return '📍';
    }
  };

  const getEventColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'wildfires': return 'text-red-600 bg-red-50';
      case 'storms': return 'text-blue-600 bg-blue-50';
      case 'volcanoes': return 'text-orange-600 bg-orange-50';
      case 'floods': return 'text-cyan-600 bg-cyan-50';
      case 'drought': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-2xl">🌍</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dynamic Earth Visualization</h2>
            <p className="text-gray-600">Real-time satellite data with location tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowLocationPin(!showLocationPin)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              showLocationPin 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {showLocationPin ? '📍 Pin On' : '📍 Pin Off'}
          </button>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Satellite Layers</h3>
        <div className="flex flex-wrap gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleLayerChange(layer.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                layer.active
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {layer.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Earth Visualization */}
      <div className="relative mb-4">
        <div className="relative w-full h-80 bg-gradient-to-b from-blue-900 to-blue-700 rounded-lg overflow-hidden">
          {/* Earth Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-800 rounded-lg"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), 
                          radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 0%, transparent 50%),
                          linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)`
            }}
          >
            {/* Rotating Earth Effect */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `conic-gradient(from ${rotation}deg, transparent 0deg, rgba(255,255,255,0.1) 90deg, transparent 180deg, rgba(255,255,255,0.1) 270deg, transparent 360deg)`,
                animation: 'spin 20s linear infinite'
              }}
            />
          </div>

          {/* Satellite Imagery Overlay */}
          {currentImageUrl && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={currentImageUrl}
                alt="Satellite Imagery"
                className="max-w-full max-h-full object-contain rounded-lg opacity-80"
                onError={() => setImageError(true)}
                style={{
                  transform: `rotate(${rotation * 0.1}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading satellite data...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl mb-2">🛰️</div>
                <p className="text-sm">Satellite imagery temporarily unavailable</p>
              </div>
            </div>
          )}

          {/* Location Pin */}
          {showLocationPin && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                left: '50%',
                top: '50%'
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded mt-1">
                  {location.city}
                </div>
              </div>
            </div>
          )}

          {/* Natural Events Overlay */}
          {naturalEvents.length > 0 && (
            <div className="absolute top-2 right-2 space-y-1">
              {naturalEvents.slice(0, 3).map((event, index) => (
                <div
                  key={event.id}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.categories[0]?.title || '')}`}
                >
                  {getEventIcon(event.categories[0]?.title || '')} {event.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earth Info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Source: NASA GIBS</span>
          <span>Resolution: {layers.find(l => l.active)?.resolution || '250m'}</span>
          <span>Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Environmental Data */}
      {environmentalData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {environmentalData.temperature.toFixed(1)}°C
            </div>
            <div className="text-xs text-gray-600">Temperature</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {environmentalData.humidity.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Humidity</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-600">
              {environmentalData.airQuality.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Air Quality</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-600">
              {(environmentalData.vegetationIndex * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Vegetation</div>
          </div>
        </div>
      )}

      {/* Natural Events */}
      {naturalEvents.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">
            Natural Events Near {location.city}
          </h4>
          <div className="space-y-2">
            {naturalEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center space-x-2">
                <span className="text-lg">{getEventIcon(event.categories[0]?.title || '')}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-yellow-900">{event.title}</div>
                  <div className="text-xs text-yellow-700">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setRotation(0)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300"
          >
            Reset View
          </button>
          <button
            onClick={loadSatelliteImagery}
            className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600"
          >
            Refresh Data
          </button>
        </div>
        <a
          href={currentImageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-sm"
        >
          View Full Resolution
        </a>
      </div>
    </div>
  );
};

export default DynamicEarthVisualization;
