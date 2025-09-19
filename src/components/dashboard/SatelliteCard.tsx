import React, { useState } from 'react';
import { Satellite, ZoomIn, Info, Calendar } from 'lucide-react';
import { SatelliteData } from '../../types/user';

interface SatelliteCardProps {
  satelliteData: SatelliteData;
}

export const SatelliteCard: React.FC<SatelliteCardProps> = ({ satelliteData }) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Satellite className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Satellite Analysis</h2>
            <p className="text-gray-600">AI-powered Earth observation</p>
          </div>
        </div>
        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            showAnnotations
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {showAnnotations ? 'Hide' : 'Show'} AI Annotations
        </button>
      </div>

      {/* Satellite Image */}
      <div className="relative mb-6 rounded-xl overflow-hidden border border-gray-200">
        <img
          src={satelliteData.imageUrl}
          alt="Satellite imagery"
          className="w-full h-64 object-cover"
        />
        
        {/* AI Annotations Overlay */}
        {showAnnotations && satelliteData.aiAnnotations.map((annotation) => (
          <button
            key={annotation.id}
            onClick={() => setSelectedAnnotation(
              selectedAnnotation === annotation.id ? null : annotation.id
            )}
            className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125 ${
              annotation.type === 'warning' 
                ? 'bg-red-500' 
                : annotation.type === 'change' 
                ? 'bg-yellow-500' 
                : 'bg-green-500'
            }`}
            style={{ 
              left: `${annotation.x}%`, 
              top: `${annotation.y}%` 
            }}
          >
            <span className="sr-only">{annotation.description}</span>
          </button>
        ))}

        <div className="absolute bottom-4 right-4">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-colors duration-200">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Selected Annotation Details */}
      {selectedAnnotation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI Detection</h4>
              <p className="text-blue-800 text-sm">
                {satelliteData.aiAnnotations.find(a => a.id === selectedAnnotation)?.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-900">AI Analysis Summary</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{satelliteData.summary}</p>
        
        {satelliteData.changeDetected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Significant environmental changes detected since last analysis
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Analysis Date: {new Date(satelliteData.analysisDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Resolution: High</span>
          <span>Source: NASA GIBS</span>
        </div>
      </div>
    </div>
  );
};