import React, { useState, useEffect } from 'react';
import { LocationCoordinates } from '../../types/user';
import GoogleEarthEngineService from '../../services/googleEarthEngineService';

interface EnhancedSatelliteAnalysisProps {
  location: LocationCoordinates;
}

interface EmbeddingAnalysis {
  year: number;
  environmentalHealth: {
    landUseClassification: {
      urban: number;
      agricultural: number;
      forest: number;
      water: number;
    };
    environmentalScore: number;
    healthIndicators: {
      vegetationHealth: number;
      waterQuality: number;
      airQuality: number;
      soilHealth: number;
    };
  };
  changeDetection?: {
    similarity: number;
    changes: {
      deforestation: number;
      urbanization: number;
      waterBodyChanges: number;
      agriculturalShifts: number;
    };
  };
}

const EnhancedSatelliteAnalysis: React.FC<EnhancedSatelliteAnalysisProps> = ({ location }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<EmbeddingAnalysis | null>(null);
  const [changeAnalysis, setChangeAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2024);

  useEffect(() => {
    loadEmbeddingAnalysis();
  }, [location, selectedYear]);

  const loadEmbeddingAnalysis = async () => {
    setLoading(true);
    try {
      // Initialize Google Earth Engine service
      const geeService = new GoogleEarthEngineService('your-api-key');
      
      // Get current year analysis
      const currentData = await geeService.getSatelliteEmbeddings(location, selectedYear);
      const environmentalHealth = geeService.analyzeEnvironmentalHealth(currentData.embeddings);
      
      setCurrentAnalysis({
        year: selectedYear,
        environmentalHealth
      });

      // Get change detection if we have previous year data
      if (selectedYear > 2017) {
        const changeData = await geeService.detectChanges(location, selectedYear - 1, selectedYear);
        setChangeAnalysis(changeData);
      }
    } catch (error) {
      console.error('Failed to load embedding analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50';
    if (score >= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0.05) return '📈'; // Significant increase
    if (change < -0.05) return '📉'; // Significant decrease
    return '➡️'; // Stable
  };

  const getChangeColor = (change: number) => {
    if (change > 0.05) return 'text-red-600';
    if (change < -0.05) return 'text-green-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <span className="text-2xl">🛰️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI-Powered Satellite Analysis</h2>
            <p className="text-gray-600">64-dimensional embedding analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {currentAnalysis && (
        <>
          {/* Environmental Health Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Environmental Health Score</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(currentAnalysis.environmentalHealth.environmentalScore)}`}>
                {currentAnalysis.environmentalHealth.environmentalScore.toFixed(1)}/10
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentAnalysis.environmentalHealth.environmentalScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Land Use Classification */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Land Use Classification</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentAnalysis.environmentalHealth.landUseClassification).map(([type, percentage]) => (
                <div key={type} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(percentage * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 capitalize">{type}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Indicators */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Environmental Health Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(currentAnalysis.environmentalHealth.healthIndicators).map(([indicator, score]) => (
                <div key={indicator} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 capitalize mb-1">
                    {indicator.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${score * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {(score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Detection */}
          {changeAnalysis && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Change Detection ({changeAnalysis.year1} → {changeAnalysis.year2})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Overall Similarity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {(changeAnalysis.similarity * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(changeAnalysis.changes).map(([change, value]) => (
                    <div key={change} className="text-center">
                      <div className="text-lg">
                        {getChangeIcon(value)}
                      </div>
                      <div className={`text-sm font-medium ${getChangeColor(value)}`}>
                        {(value * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 capitalize">
                        {change.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">AI Analysis Summary</h4>
            <p className="text-sm text-blue-800">
              Advanced satellite embedding analysis for {location.city}, {location.country} reveals 
              {currentAnalysis.environmentalHealth.environmentalScore >= 8 ? ' excellent' : 
               currentAnalysis.environmentalHealth.environmentalScore >= 6 ? ' good' : ' moderate'} 
              environmental health with {currentAnalysis.environmentalHealth.landUseClassification.agricultural > 0.4 ? 'significant agricultural activity' : 'diverse land use patterns'}. 
              The 64-dimensional embedding analysis provides comprehensive insights into land cover, vegetation health, and environmental conditions.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedSatelliteAnalysis;
