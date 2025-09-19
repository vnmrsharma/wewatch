import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Eye } from 'lucide-react';
import { WeatherData } from '../../types/user';
import { cleanMarkdownArtifacts } from '../../utils/textUtils';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const getWeatherIcon = (condition: string) => {
  const iconMap: { [key: string]: any } = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    default: Cloud,
  };
  return iconMap[condition.toLowerCase()] || iconMap.default;
};

const getAQIColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    good: 'bg-green-100 text-green-800 border-green-200',
    moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    unhealthy: 'bg-orange-100 text-orange-800 border-orange-200',
    hazardous: 'bg-red-100 text-red-800 border-red-200',
  };
  return colorMap[status] || colorMap.moderate;
};

export const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const WeatherIcon = getWeatherIcon(weatherData.current.condition);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-full">
          <WeatherIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Weather & Air Quality</h2>
          <p className="text-gray-600">Current conditions and forecasts</p>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <WeatherIcon className="h-12 w-12 text-blue-600" />
            <div>
              <p className="text-3xl font-bold text-gray-900">{weatherData.current.temperature}°C</p>
              <p className="text-blue-700 capitalize">{weatherData.current.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <Droplets className="h-4 w-4" />
              <span>{weatherData.current.humidity}% humidity</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Wind className="h-4 w-4" />
              <span>{weatherData.current.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Air Quality */}
        <div className={`p-4 rounded-lg border-2 ${getAQIColor(weatherData.airQuality.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">Air Quality Index</span>
            </div>
            <span className="text-2xl font-bold">{weatherData.airQuality.aqi}</span>
          </div>
          <p className="mt-1 text-sm capitalize">{weatherData.airQuality.status} air quality</p>
          <div className="flex space-x-4 mt-2 text-sm">
            <span>PM2.5: {weatherData.airQuality.pm25}</span>
            <span>PM10: {weatherData.airQuality.pm10}</span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100">
        <h3 className="font-semibold text-purple-900 mb-2 flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>AI Weather Analysis</span>
        </h3>
        <p className="text-purple-800 text-sm leading-relaxed">{cleanMarkdownArtifacts(weatherData.aiSummary)}</p>
        
        {weatherData.unusualPatterns.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-purple-900 mb-1 text-sm">Unusual Patterns Detected:</p>
            <ul className="space-y-1">
              {weatherData.unusualPatterns.map((pattern, index) => (
                <li key={index} className="text-sm text-purple-800 flex items-center space-x-2">
                  <div className="w-1 h-1 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Forecast */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-2">
          {weatherData.forecast.slice(0, 5).map((day, index) => {
            const DayIcon = getWeatherIcon(day.condition);
            return (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">
                  {new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </p>
                <DayIcon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">{day.high}°</p>
                  <p className="text-xs text-gray-600">{day.low}°</p>
                  <div className="flex items-center justify-center space-x-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-600">{day.precipitationChance}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};