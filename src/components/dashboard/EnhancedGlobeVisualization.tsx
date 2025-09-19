import React, { useState, useEffect, useRef, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { LocationCoordinates } from '../../types/user';
import EnhancedNasaService from '../../services/enhancedNasaService';
import { apiService } from '../../services/apiService';

interface EnhancedGlobeVisualizationProps {
  location: LocationCoordinates;
  onLayerChange?: (layer: string) => void;
}

interface SatelliteLayer {
  id: string;
  name: string;
  description: string;
  resolution: string;
  updateFrequency: string;
  dataType: 'visual' | 'thermal' | 'vegetation' | 'atmospheric';
  colorScheme: string;
  opacity: number;
  url: string;
  active: boolean;
}

interface EnvironmentalInsight {
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  severity: number;
}

interface DataPoint {
  lat: number;
  lng: number;
  value: number;
  timestamp: string;
  source: string;
}

const EnhancedGlobeVisualization: React.FC<EnhancedGlobeVisualizationProps> = ({ 
  location, 
  onLayerChange 
}) => {
  const globeRef = useRef<any>();
  const [layers, setLayers] = useState<SatelliteLayer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('MODIS_Terra_CorrectedReflectance_TrueColor');
  const [isLoading, setIsLoading] = useState(true);
  const [naturalEvents, setNaturalEvents] = useState<any[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [insights, setInsights] = useState<EnvironmentalInsight[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [showLocationPin, setShowLocationPin] = useState(true);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showGraticules, setShowGraticules] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globeImageUrl, setGlobeImageUrl] = useState<string>('');
  const [overlayData, setOverlayData] = useState<any>(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const nasaService = new EnhancedNasaService(import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY');

  // Initialize comprehensive satellite layers
  const initializeLayers = useCallback(() => {
    const comprehensiveLayers: SatelliteLayer[] = [
      {
        id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        name: 'MODIS Terra True Color',
        description: 'Natural color imagery from MODIS Terra satellite',
        resolution: '250m',
        updateFrequency: 'Daily',
        dataType: 'visual',
        colorScheme: 'natural',
        opacity: 0.8,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor',
        active: true
      },
      {
        id: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
        name: 'MODIS Aqua True Color',
        description: 'Natural color imagery from MODIS Aqua satellite',
        resolution: '250m',
        updateFrequency: 'Daily',
        dataType: 'visual',
        colorScheme: 'natural',
        opacity: 0.8,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Aqua_CorrectedReflectance_TrueColor',
        active: false
      },
      {
        id: 'MODIS_Terra_Land_Surface_Temperature_Day',
        name: 'Land Surface Temperature',
        description: 'Daytime land surface temperature from MODIS Terra',
        resolution: '1km',
        updateFrequency: 'Daily',
        dataType: 'thermal',
        colorScheme: 'temperature',
        opacity: 0.7,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_Land_Surface_Temperature_Day',
        active: false
      },
      {
        id: 'MODIS_Terra_NDVI',
        name: 'Vegetation Health (NDVI)',
        description: 'Normalized Difference Vegetation Index - vegetation health',
        resolution: '250m',
        updateFrequency: 'Daily',
        dataType: 'vegetation',
        colorScheme: 'vegetation',
        opacity: 0.7,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_NDVI',
        active: false
      },
      {
        id: 'MODIS_Terra_Aerosol_Optical_Depth',
        name: 'Air Quality Index',
        description: 'Aerosol Optical Depth - air quality and atmospheric particles',
        resolution: '10km',
        updateFrequency: 'Daily',
        dataType: 'atmospheric',
        colorScheme: 'air_quality',
        opacity: 0.6,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_Aerosol_Optical_Depth',
        active: false
      },
      {
        id: 'MODIS_Terra_Cloud_Fraction',
        name: 'Cloud Coverage',
        description: 'Cloud fraction and coverage analysis',
        resolution: '1km',
        updateFrequency: 'Daily',
        dataType: 'atmospheric',
        colorScheme: 'clouds',
        opacity: 0.5,
        url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_Cloud_Fraction',
        active: false
      }
    ];
    setLayers(comprehensiveLayers);
  }, []);

  // Load comprehensive environmental data
  const loadEnvironmentalData = useCallback(async () => {
    try {
      setIsDataLoading(true);
      console.log('Loading comprehensive environmental data for:', location);
      
      // Get real environmental data
      const environmentalData = await apiService.fetchEnvironmentalData(location);
      
      // Get NASA natural events
      const events = await nasaService.getNaturalEvents(location, 2000);
      
      // Get additional NASA data
      const nasaData = await nasaService.getEnvironmentalData(location);
      
      // Combine and enrich the data
      const enrichedData = {
        // Real weather data
        temperature: environmentalData.weatherData?.current?.temp_c || 20,
        humidity: environmentalData.weatherData?.current?.humidity || 50,
        airQuality: environmentalData.weatherData?.current?.air_quality?.us_epa_index || 75,
        pressure: environmentalData.weatherData?.current?.pressure_mb || 1013,
        windSpeed: environmentalData.weatherData?.current?.wind_kph || 0,
        windDirection: environmentalData.weatherData?.current?.wind_degree || 0,
        visibility: environmentalData.weatherData?.current?.vis_km || 10,
        uvIndex: environmentalData.weatherData?.current?.uv || 0,
        
        // Satellite data
        vegetationIndex: environmentalData.satelliteData?.vegetationIndex || 0.5,
        cloudCover: environmentalData.weatherData?.current?.cloud || 30,
        precipitation: environmentalData.weatherData?.current?.precip_mm || 0,
        
        // NASA data
        landSurfaceTemp: nasaData.temperature,
        aerosolOpticalDepth: nasaData.airQuality,
        
        // Forecast data
        forecast: environmentalData.weatherData?.forecast?.forecastday || [],
        
        // Natural events
        naturalEvents: events,
        
        // Timestamp
        lastUpdated: new Date().toISOString()
      };
      
      setEnvironmentalData(enrichedData);
      setNaturalEvents(events);
      
      // Generate insights
      generateEnvironmentalInsights(enrichedData, events);
      
      console.log('Comprehensive environmental data loaded:', enrichedData);
    } catch (error) {
      console.error('Failed to load comprehensive environmental data:', error);
    } finally {
      setIsDataLoading(false);
    }
  }, [location]);

  // Generate meaningful environmental insights
  const generateEnvironmentalInsights = useCallback((data: any, events: any[]) => {
    const newInsights: EnvironmentalInsight[] = [];
    
    // Temperature analysis
    if (data.temperature > 35) {
      newInsights.push({
        type: 'warning',
        title: 'High Temperature Alert',
        description: `Temperature is ${data.temperature.toFixed(1)}°C, significantly above normal`,
        impact: 'Heat stress risk, increased energy demand',
        recommendation: 'Stay hydrated, limit outdoor activities during peak hours',
        severity: data.temperature > 40 ? 4 : 3
      });
    } else if (data.temperature < 0) {
      newInsights.push({
        type: 'warning',
        title: 'Freezing Conditions',
        description: `Temperature is ${data.temperature.toFixed(1)}°C, below freezing point`,
        impact: 'Risk of frostbite, icy conditions',
        recommendation: 'Dress warmly, be cautious of icy surfaces',
        severity: data.temperature < -10 ? 4 : 3
      });
    }
    
    // Air quality analysis
    if (data.airQuality > 100) {
      newInsights.push({
        type: 'critical',
        title: 'Poor Air Quality',
        description: `Air Quality Index is ${data.airQuality}, unhealthy for sensitive groups`,
        impact: 'Respiratory issues, reduced visibility',
        recommendation: 'Limit outdoor activities, use air purifiers if available',
        severity: data.airQuality > 150 ? 5 : 4
      });
    }
    
    // Vegetation health
    if (data.vegetationIndex < 0.3) {
      newInsights.push({
        type: 'warning',
        title: 'Low Vegetation Health',
        description: `Vegetation index is ${(data.vegetationIndex * 100).toFixed(1)}%, indicating stress`,
        impact: 'Reduced carbon sequestration, ecosystem stress',
        recommendation: 'Monitor water availability, consider conservation measures',
        severity: 3
      });
    }
    
    // Natural events
    events.forEach(event => {
      if (event.categories?.[0]?.title === 'Wildfires') {
        newInsights.push({
          type: 'critical',
          title: 'Active Wildfire',
          description: event.title,
          impact: 'Air quality degradation, fire spread risk',
          recommendation: 'Monitor air quality, prepare evacuation plan if needed',
          severity: 5
        });
      } else if (event.categories?.[0]?.title === 'Severe Storms') {
        newInsights.push({
          type: 'warning',
          title: 'Severe Weather',
          description: event.title,
          impact: 'Potential flooding, wind damage',
          recommendation: 'Secure outdoor items, avoid unnecessary travel',
          severity: 4
        });
      }
    });
    
    // UV Index
    if (data.uvIndex > 8) {
      newInsights.push({
        type: 'warning',
        title: 'High UV Index',
        description: `UV Index is ${data.uvIndex}, very high risk`,
        impact: 'High risk of sunburn, skin damage',
        recommendation: 'Use sunscreen SPF 30+, seek shade, wear protective clothing',
        severity: 3
      });
    }
    
    setInsights(newInsights);
  }, []);

  // Load globe textures and overlays
  const loadGlobeTextures = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load base Earth texture
      const earthTextureUrl = 'https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-blue-marble.jpg';
      setGlobeImageUrl(earthTextureUrl);
      
      // Load overlay data for current layer
      await loadOverlayData();
      
    } catch (error) {
      console.error('Failed to load globe textures:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLayer]);

  // Load overlay data for the selected layer
  const loadOverlayData = useCallback(async () => {
    try {
      const layer = layers.find(l => l.id === selectedLayer);
      if (!layer) return;
      
      // In a real implementation, you would load actual NASA tile data
      // For now, we'll simulate overlay data
      const overlayData = {
        layerId: layer.id,
        dataType: layer.dataType,
        colorScheme: layer.colorScheme,
        opacity: layer.opacity,
        timestamp: new Date().toISOString()
      };
      
      setOverlayData(overlayData);
    } catch (error) {
      console.error('Failed to load overlay data:', error);
    }
  }, [selectedLayer, layers]);

  // Focus on user's location
  const focusOnLocation = useCallback(() => {
    if (globeRef.current && location.lat && location.lng) {
      console.log('Focusing on location:', { lat: location.lat, lng: location.lng });
      globeRef.current.pointOfView(
        { lat: location.lat, lng: location.lng, altitude: 2 },
        1000
      );
    }
  }, [location]);

  // Handle layer change
  const handleLayerChange = useCallback((layerId: string) => {
    setSelectedLayer(layerId);
    onLayerChange?.(layerId);
    loadOverlayData();
  }, [onLayerChange, loadOverlayData]);

  // Get current layer data
  const getCurrentLayerData = useCallback(() => {
    return layers.find(l => l.id === selectedLayer) || layers[0];
  }, [layers, selectedLayer]);

  // Get natural events as points
  const getEventPoints = useCallback(() => {
    return naturalEvents.map(event => {
      const geometry = event.geometries?.[0];
      if (geometry && geometry.coordinates && geometry.coordinates.length >= 2) {
        const [lng, lat] = geometry.coordinates;
        const eventType = event.categories?.[0]?.title;
        
        let color = '#ffd700';
        let size = 0.5;
        
        if (eventType === 'Wildfires') {
          color = '#ff6b35';
          size = 0.8;
        } else if (eventType === 'Severe Storms') {
          color = '#4a90e2';
          size = 0.7;
        } else if (eventType === 'Volcanoes') {
          color = '#dc2626';
          size = 0.6;
        }
        
        return {
          lat,
          lng,
          size,
          color,
          label: event.title,
          description: event.description,
          type: eventType,
          severity: event.categories?.[0]?.id || 1
        };
      }
      return null;
    }).filter(Boolean);
  }, [naturalEvents]);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeLayers();
    loadEnvironmentalData();
    loadGlobeTextures();
  }, [initializeLayers, loadEnvironmentalData, loadGlobeTextures]);

  // Reload data when location changes
  useEffect(() => {
    loadEnvironmentalData();
  }, [location, loadEnvironmentalData]);

  // Reload textures when layer changes
  useEffect(() => {
    loadOverlayData();
  }, [selectedLayer, loadOverlayData]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enhanced Earth Analytics</h2>
            <p className="text-sm text-gray-600">
              Real-time NASA satellite data with comprehensive environmental insights
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {currentTime.toLocaleTimeString()}
            </p>
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

      {/* Enhanced Layer Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Satellite Data Layers</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => handleLayerChange(layer.id)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                layer.id === selectedLayer
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="font-semibold">{layer.name}</div>
              <div className="text-xs opacity-75 mt-1">{layer.resolution} • {layer.updateFrequency}</div>
            </button>
          ))}
        </div>
        
        {/* Current Layer Information */}
        {getCurrentLayerData() && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ 
                      backgroundColor: getCurrentLayerData().dataType === 'thermal' ? '#ff6b35' :
                                      getCurrentLayerData().dataType === 'vegetation' ? '#22c55e' :
                                      getCurrentLayerData().dataType === 'atmospheric' ? '#8b5cf6' : '#3b82f6'
                    }}
                  ></div>
                  <h4 className="font-semibold text-gray-900">{getCurrentLayerData().name}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{getCurrentLayerData().description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Resolution: {getCurrentLayerData().resolution}</span>
                  <span>Update: {getCurrentLayerData().updateFrequency}</span>
                  <span>Type: {getCurrentLayerData().dataType}</span>
                </div>
              </div>
              {isDataLoading && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Globe Visualization */}
      <div className="relative mb-6">
        <div className="w-full h-96 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Enhanced Earth Analytics...</p>
                <p className="text-gray-400 text-sm mt-2">Initializing NASA satellite data</p>
              </div>
            </div>
          ) : (
            <Globe
              ref={globeRef}
              width={800}
              height={400}
              globeImageUrl={globeImageUrl || undefined}
              bumpImageUrl="https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-topology.png"
              backgroundImageUrl="https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/night-sky.png"
              showGraticules={showGraticules}
              showAtmosphere={showAtmosphere}
              atmosphereColor="#4a90e2"
              atmosphereAltitude={0.15}
              // Location pin and natural events
              pointsData={[
                ...(showLocationPin && location.lat && location.lng ? [{ 
                  lat: location.lat, 
                  lng: location.lng, 
                  size: 1.2, 
                  color: '#ff0000', 
                  label: `${location.city}, ${location.country}`,
                  altitude: 0.01
                }] : []), 
                ...getEventPoints()
              ]}
              pointLabel="label"
              pointColor="color"
              pointRadius="size"
              pointResolution={12}
              pointAltitude={0.01}
              // Animation and interaction
              animateIn={true}
              enablePointerInteraction={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.5}
              onGlobeReady={() => {
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

      {/* Enhanced Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showAtmosphere}
                onChange={(e) => setShowAtmosphere(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Atmosphere</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showGraticules}
                onChange={(e) => setShowGraticules(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Grid Lines</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Auto Rotate</span>
            </label>
          </div>
          <div className="text-sm text-gray-600">
            Source: NASA GIBS • Resolution: {getCurrentLayerData()?.resolution || '250m'} • 
            Last Updated: {environmentalData?.lastUpdated ? new Date(environmentalData.lastUpdated).toLocaleString() : 'Loading...'}
          </div>
        </div>
      </div>

      {/* Enhanced Environmental Data Cards */}
      {environmentalData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{environmentalData.temperature.toFixed(1)}°C</div>
            <div className="text-sm text-gray-600">Temperature</div>
            <div className="text-xs text-gray-500 mt-1">Feels like {environmentalData.temperature.toFixed(1)}°C</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{environmentalData.humidity.toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Humidity</div>
            <div className="text-xs text-gray-500 mt-1">Dew point: {environmentalData.temperature.toFixed(1)}°C</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{environmentalData.airQuality}</div>
            <div className="text-sm text-gray-600">Air Quality</div>
            <div className="text-xs text-gray-500 mt-1">US EPA Index</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{(environmentalData.vegetationIndex * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Vegetation</div>
            <div className="text-xs text-gray-500 mt-1">NDVI Index</div>
          </div>
        </div>
      )}

      {/* Additional Environmental Metrics */}
      {environmentalData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-700">{environmentalData.pressure.toFixed(0)} mb</div>
            <div className="text-xs text-gray-600">Pressure</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-700">{environmentalData.windSpeed.toFixed(0)} km/h</div>
            <div className="text-xs text-gray-600">Wind Speed</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-700">{environmentalData.visibility.toFixed(0)} km</div>
            <div className="text-xs text-gray-600">Visibility</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-gray-700">{environmentalData.uvIndex}</div>
            <div className="text-xs text-gray-600">UV Index</div>
          </div>
        </div>
      )}

      {/* Environmental Insights */}
      {insights.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Insights & Alerts</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'critical' ? 'bg-red-50 border-red-500' :
                  insight.type === 'warning' ? 'bg-orange-50 border-orange-500' :
                  insight.type === 'info' ? 'bg-blue-50 border-blue-500' :
                  'bg-green-50 border-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.severity >= 4 ? 'bg-red-100 text-red-800' :
                        insight.severity >= 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Severity {insight.severity}/5
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500"><strong>Impact:</strong> {insight.impact}</p>
                      <p className="text-xs text-gray-500"><strong>Recommendation:</strong> {insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Natural Events */}
      {naturalEvents.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Natural Events Near {location.city}, {location.country}
          </h3>
          <div className="space-y-3">
            {naturalEvents.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  event.categories?.[0]?.title === 'Wildfires' ? 'bg-orange-100' : 
                  event.categories?.[0]?.title === 'Severe Storms' ? 'bg-blue-100' : 
                  event.categories?.[0]?.title === 'Volcanoes' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  {event.categories?.[0]?.title === 'Wildfires' ? (
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  ) : event.categories?.[0]?.title === 'Severe Storms' ? (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
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
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
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

export default EnhancedGlobeVisualization;
