import React, { useState, useEffect } from 'react';
import { UserProfile, EnvironmentalData } from '../types/user';
import { CriticalIssuesCard } from './dashboard/CriticalIssuesCard';
import { WeatherCard } from './dashboard/WeatherCard';
import { NewsCard } from './dashboard/NewsCard';
import EnhancedGlobeVisualization from './dashboard/EnhancedGlobeVisualization';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { apiService } from '../services/apiService';

interface DashboardProps {
  user: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (user.location.coordinates) {
          const locationData = {
            lat: user.location.coordinates.lat,
            lng: user.location.coordinates.lng,
            city: user.location.city,
            country: user.location.country
          };
          
          const environmentalData = await apiService.fetchEnvironmentalData(locationData);
          setData(environmentalData);
        } else {
          // Load mock data when coordinates are not available
          const { mockEnvironmentalData } = await import('../data/mockData');
          setData(mockEnvironmentalData);
        }
      } catch (err) {
        setError(`Failed to load environmental data: ${err instanceof Error ? err.message : 'Unknown error'}`);
        console.error('Error fetching data:', err);
        
        // Fall back to mock data on error
        try {
          const { mockEnvironmentalData } = await import('../data/mockData');
          setData(mockEnvironmentalData);
        } catch (mockError) {
          console.error('Error loading mock data:', mockError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.location]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <LoadingSpinner size="lg" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Loading environmental data for {user.location.city}
          </h2>
          <p className="mt-2 text-gray-600">
            Analyzing satellite imagery, weather patterns, and local news...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="bg-red-50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-red-900 mb-4">
              Unable to Load Data
            </h2>
            <p className="text-red-700 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          WeWatch Environmental Overview
        </h1>
        <p className="text-lg text-gray-600">
          Real-time climate and environmental monitoring for {user.location.city}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CriticalIssuesCard issues={data.criticalIssues} />
        <WeatherCard weatherData={data.weatherData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <EnhancedGlobeVisualization 
            location={{
              lat: user.location.coordinates?.lat || 0,
              lng: user.location.coordinates?.lng || 0,
              city: user.location.city,
              country: user.location.country
            }}
            onLayerChange={(layer) => console.log('Layer changed to:', layer)}
          />
        </div>
        <div>
          <NewsCard news={data.newsData} />
        </div>
      </div>
    </div>
  );
};