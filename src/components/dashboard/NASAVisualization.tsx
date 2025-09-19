import React, { useState } from 'react';
import { SatelliteData } from '../../types/user';
import { cleanMarkdownArtifacts } from '../../utils/textUtils';

interface NASAVisualizationProps {
  satelliteData: SatelliteData;
}

const NASAVisualization: React.FC<NASAVisualizationProps> = ({ satelliteData }) => {
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
    console.error('Failed to load NASA satellite image');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getAnnotationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'storm': return '⛈️';
      case 'pollution': return '☁️';
      case 'deforestation': return '🌳';
      case 'urban': return '🏙️';
      case 'water': return '💧';
      default: return '📍';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">NASA Satellite Analysis</h3>
          <p className="text-sm text-gray-600">Real-time Earth observation data</p>
        </div>
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            showAnnotations
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {showAnnotations ? 'Hide' : 'Show'} AI Annotations
        </button>
      </div>

      {/* Satellite Image */}
      <div className="relative mb-4">
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
              <div className="text-4xl mb-2">🛰️</div>
              <p className="text-sm text-center">Satellite imagery temporarily unavailable</p>
              <p className="text-xs text-center mt-1">Data analysis still available below</p>
            </div>
          ) : (
            <img
              src={satelliteData.imageUrl}
              alt="NASA Satellite Imagery"
              className="w-full h-full object-cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
          
          {/* AI Annotations Overlay */}
          {showAnnotations && satelliteData.aiAnnotations.length > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {satelliteData.aiAnnotations.map((annotation, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-2xl mb-1">
                      {getAnnotationIcon(annotation.type)}
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(annotation.severity)}`}>
                      {annotation.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Image Info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Source: NASA GIBS</span>
          <span>Resolution: High</span>
          <span>Last Updated: {new Date(satelliteData.analysisDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full mt-1 ${
              satelliteData.changeDetected ? 'bg-orange-400' : 'bg-green-400'
            }`}></div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900">Environmental Status</h4>
            <p className="text-sm text-gray-600 mt-1">
              {satelliteData.changeDetected 
                ? 'Significant environmental changes detected in the region'
                : 'Normal environmental conditions observed'
              }
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">AI Analysis Summary</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {cleanMarkdownArtifacts(satelliteData.summary)}
          </p>
        </div>

        {/* Annotations List */}
        {satelliteData.aiAnnotations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Detected Features</h4>
            <div className="grid grid-cols-1 gap-2">
              {satelliteData.aiAnnotations.map((annotation, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-lg">{getAnnotationIcon(annotation.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {annotation.type}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getSeverityColor(annotation.severity)}`}>
                        {annotation.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {cleanMarkdownArtifacts(annotation.description)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Quality Indicators */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Data Quality: High</span>
            </span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Coverage: {satelliteData.aiAnnotations.length} features</span>
            </span>
          </div>
          {!imageError && (
            <button
              onClick={() => window.open(satelliteData.imageUrl, '_blank')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View Full Resolution
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NASAVisualization;
