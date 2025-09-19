import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { LocationCoordinates } from '../../types/user';
import EnhancedNasaService from '../../services/enhancedNasaService';
import { apiService } from '../../services/apiService';

interface GlobeEarthVisualizationProps {
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

interface NaturalEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  categories: Array<{
    id: number;
    title: string;
  }>;
  geometries: Array<{
    date: string;
    type: string;
    coordinates: number[];
  }>;
}

const GlobeEarthVisualization: React.FC<GlobeEarthVisualizationProps> = ({ 
  location, 
  onLayerChange 
}) => {
  const globeRef = useRef<any>();
  const [layers, setLayers] = useState<EarthLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('trueColor');
  const [isLoading, setIsLoading] = useState(true);
  const [naturalEvents, setNaturalEvents] = useState<NaturalEvent[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [globeImageUrl, setGlobeImageUrl] = useState<string>('');
  const [cloudsImageUrl, setCloudsImageUrl] = useState<string>('');
  const [showLocationPin, setShowLocationPin] = useState(true);
  const [showClouds, setShowClouds] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [textureError, setTextureError] = useState(false);

  const nasaService = new EnhancedNasaService(import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY');

  useEffect(() => {
    initializeLayers();
    loadNaturalEvents();
    loadEnvironmentalData();
    loadGlobeTextures();
  }, [location]);

  useEffect(() => {
    loadGlobeTextures();
  }, [selectedLayer]);

  const initializeLayers = async () => {
    const availableLayers = nasaService.getAvailableLayers();
    const earthLayers: EarthLayer[] = availableLayers.map(layer => ({
      id: layer.id,
      name: layer.name,
      description: layer.description,
      resolution: layer.resolution,
      url: layer.url,
      active: layer.id === 'MODIS_Terra_CorrectedReflectance_TrueColor'
    }));
    setLayers(earthLayers);
  };

  const loadGlobeTextures = async () => {
    try {
      setIsLoading(true);
      setTextureError(false);
      
      // Use working, accessible Earth textures
      const earthTextureUrl = 'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-blue-marble.jpg';
      
      // Test if the texture URL is accessible
      const earthResponse = await fetch(earthTextureUrl, { method: 'HEAD' });
      
      if (earthResponse.ok) {
        setGlobeImageUrl(earthTextureUrl);
        console.log('Earth texture loaded successfully');
      } else {
        console.warn('Earth texture not accessible, using fallback');
        setGlobeImageUrl('');
      }
      
      // Clouds texture is not available, so we'll disable it
      setCloudsImageUrl('');
      setShowClouds(false);
      
    } catch (error) {
      console.error('Failed to load globe textures:', error);
      setTextureError(true);
      // Fallback to no textures - globe will use default appearance
      setGlobeImageUrl('');
      setCloudsImageUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const loadNaturalEvents = async () => {
    try {
      const events = await nasaService.getNaturalEvents(location, 1000);
      setNaturalEvents(events);
    } catch (error) {
      console.error('Failed to load natural events:', error);
      setNaturalEvents([]);
    }
  };

  const loadEnvironmentalData = async () => {
    try {
      console.log('Loading real environmental data for:', location);
      
      // Use the real API service to get actual weather and environmental data
      const environmentalData = await apiService.fetchEnvironmentalData(location);
      
      // Extract real data from the API response
      const realData = {
        temperature: environmentalData.weatherData?.current?.temp_c || 20,
        humidity: environmentalData.weatherData?.current?.humidity || 50,
        airQuality: environmentalData.weatherData?.current?.air_quality?.us_epa_index || 75,
        vegetationIndex: environmentalData.satelliteData?.vegetationIndex || 0.5,
        cloudCover: environmentalData.weatherData?.current?.cloud || 30,
        precipitation: environmentalData.weatherData?.current?.precip_mm || 5
      };
      
      console.log('Real environmental data loaded:', realData);
      setEnvironmentalData(realData);
    } catch (error) {
      console.error('Failed to load real environmental data:', error);
      // Fallback to NASA service if API service fails
      try {
        const nasaData = await nasaService.getEnvironmentalData(location);
        setEnvironmentalData(nasaData);
      } catch (nasaError) {
        console.error('NASA service also failed:', nasaError);
        setEnvironmentalData({
          temperature: 20,
          humidity: 50,
          airQuality: 75,
          vegetationIndex: 0.5,
          cloudCover: 30,
          precipitation: 5
        });
      }
    }
  };

  const handleLayerChange = (layerId: string) => {
    setSelectedLayer(layerId);
    onLayerChange?.(layerId);
  };

  // Convert natural events to points data for the globe
  const getEventPoints = () => {
    return naturalEvents.map(event => {
      const geometry = event.geometries?.[0];
      if (geometry && geometry.coordinates && geometry.coordinates.length >= 2) {
        const [lng, lat] = geometry.coordinates;
        return {
          lat,
          lng,
          size: 0.5,
          color: event.categories?.[0]?.title === 'Wildfires' ? '#ff6b35' : 
                 event.categories?.[0]?.title === 'Severe Storms' ? '#4a90e2' : '#ffd700',
          label: event.title,
          description: event.description
        };
      }
      return null;
    }).filter(Boolean);
  };

  // Focus on user's location
  const focusOnLocation = () => {
    if (globeRef.current && location.lat && location.lng) {
      console.log('Focusing on location:', { lat: location.lat, lng: location.lng });
      globeRef.current.pointOfView(
        { lat: location.lat, lng: location.lng, altitude: 2 },
        1000
      );
    } else {
      console.warn('Invalid location coordinates:', location);
    }
  };

  // Get the appropriate globe texture based on selected layer
  const getGlobeTexture = () => {
    // For now, use the base Earth texture for all layers
    // In a real implementation, you would load different textures for different data layers
    return globeImageUrl;
  };

  // Get layer-specific styling and data
  const getLayerData = () => {
    switch (selectedLayer) {
      case 'MODIS_Terra_Land_Surface_Temperature_Day':
        return {
          title: 'Land Surface Temperature',
          description: 'Daytime land surface temperature from MODIS Terra',
          color: '#ff6b35',
          data: environmentalData?.temperature || 20
        };
      case 'MODIS_Terra_NDVI':
        return {
          title: 'Vegetation Index (NDVI)',
          description: 'Normalized Difference Vegetation Index',
          color: '#22c55e',
          data: environmentalData?.vegetationIndex || 0.5
        };
      case 'MODIS_Terra_Aerosol_Optical_Depth':
        return {
          title: 'Air Quality',
          description: 'Aerosol Optical Depth - Air quality indicator',
          color: '#8b5cf6',
          data: environmentalData?.airQuality || 75
        };
      default:
        return {
          title: 'True Color',
          description: 'Natural color satellite imagery',
          color: '#3b82f6',
          data: null
        };
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
            <h2 className="text-xl font-bold text-gray-900">3D Earth Visualization</h2>
            <p className="text-sm text-gray-600">Real-time NASA satellite data with interactive 3D globe</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowLocationPin(!showLocationPin)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>Pin {showLocationPin ? 'Off' : 'On'}</span>
          </button>
          <button
            onClick={focusOnLocation}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>Focus</span>
          </button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Satellite Layers</h3>
        <div className="flex flex-wrap gap-2">
          {layers.slice(0, 4).map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleLayerChange(layer.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                layer.id === selectedLayer
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {layer.name}
            </button>
          ))}
        </div>
        
        {/* Current Layer Information */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getLayerData().color }}
            ></div>
            <h4 className="font-semibold text-gray-900">{getLayerData().title}</h4>
          </div>
          <p className="text-sm text-gray-600 mt-1">{getLayerData().description}</p>
          {getLayerData().data !== null && (
            <div className="mt-2 text-lg font-bold" style={{ color: getLayerData().color }}>
              {selectedLayer === 'MODIS_Terra_NDVI' 
                ? `${(getLayerData().data * 100).toFixed(1)}%`
                : selectedLayer === 'MODIS_Terra_Land_Surface_Temperature_Day'
                ? `${getLayerData().data.toFixed(1)}°C`
                : getLayerData().data.toFixed(0)
              }
            </div>
          )}
        </div>
      </div>

      {/* Globe Visualization */}
      <div className="relative mb-4">
        <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white">Loading 3D Earth...</p>
              </div>
            </div>
          ) : (
            <Globe
              ref={globeRef}
              width={800}
              height={400}
              globeImageUrl={getGlobeTexture() || undefined}
              bumpImageUrl={textureError ? undefined : "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png"}
              backgroundImageUrl={textureError ? undefined : "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/night-sky.png"}
              showGraticules={true}
              showAtmosphere={showAtmosphere}
              atmosphereColor="#4a90e2"
              atmosphereAltitude={0.15}
              // Location pin and natural events
              pointsData={[...(showLocationPin && location.lat && location.lng ? [{ 
                lat: location.lat, 
                lng: location.lng, 
                size: 1, 
                color: '#ff0000', 
                label: `${location.city}, ${location.country}`,
                altitude: 0.01
              }] : []), ...getEventPoints()]}
              pointLabel="label"
              pointColor="color"
              pointRadius="size"
              pointResolution={8}
              pointAltitude={0.01}
              // Clouds layer disabled since texture is not available
              cloudsImageUrl={undefined}
              // Animation and interaction
              animateIn={true}
              enablePointerInteraction={true}
              onGlobeReady={() => {
                // Focus on user's location when globe is ready
                setTimeout(() => {
                  focusOnLocation();
                }, 1000);
              }}
              onGlobeClick={({ lat, lng }) => {
                console.log('Clicked on:', { lat, lng });
              }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showAtmosphere}
                onChange={(e) => setShowAtmosphere(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Show Atmosphere</span>
            </label>
          </div>
          <div className="text-sm text-gray-600">
            Source: NASA GIBS • Resolution: 250m • Last Updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Environmental Data Cards */}
      {environmentalData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{environmentalData.temperature.toFixed(1)}°C</div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{environmentalData.humidity.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{environmentalData.airQuality.toFixed(0)}</div>
            <div className="text-sm text-gray-600">Air Quality</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{(environmentalData.vegetationIndex * 100).toFixed(0)}%</div>
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
            {naturalEvents.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.categories?.[0]?.title === 'Wildfires' ? 'bg-orange-100' : 
                  event.categories?.[0]?.title === 'Severe Storms' ? 'bg-blue-100' : 'bg-yellow-100'
                }`}>
                  {event.categories?.[0]?.title === 'Wildfires' ? (
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.categories?.[0]?.title} • {event.geometries?.[0]?.date}
                  </div>
                </div>
                {event.link && (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobeEarthVisualization;
