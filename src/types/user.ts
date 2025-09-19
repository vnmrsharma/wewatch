export interface UserProfile {
  id: string;
  name: string;
  location: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  preferences: {
    notifications: boolean;
    language: string;
  };
  joinedAt: string;
}

export interface EnvironmentalData {
  criticalIssues: CriticalIssue[];
  satelliteData: SatelliteData;
  weatherData: WeatherData;
  newsData: NewsItem[];
}

export interface CriticalIssue {
  id: string;
  type: 'heatwave' | 'drought' | 'flooding' | 'pollution' | 'wildfire' | 'air-quality' | 'storm' | 'extreme-weather' | 'health-risk' | 'infrastructure-risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  aiInsights: string;
  actionSuggestions: string[];
  lastUpdated: string;
  timeframe?: string;
  confidence?: string;
}

export interface SatelliteData {
  imageUrl: string;
  analysisDate: string;
  aiAnnotations: SatelliteAnnotation[];
  changeDetected: boolean;
  summary: string;
}

export interface SatelliteAnnotation {
  id: string;
  x: number;
  y: number;
  type: 'warning' | 'change' | 'normal';
  description: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  };
  airQuality: {
    aqi: number;
    pm25: number;
    pm10: number;
    status: 'good' | 'moderate' | 'unhealthy' | 'hazardous';
  };
  forecast: WeatherForecast[];
  aiSummary: string;
  unusualPatterns: string[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitationChance: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  category: 'policy' | 'event' | 'research' | 'community';
  relevanceScore: number;
}

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  organizer: {
    name: string;
    id: string;
  };
  location: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dateTime: string;
  duration: number;
  category: 'cleanup' | 'planting' | 'awareness' | 'research' | 'advocacy';
  maxParticipants?: number;
  currentParticipants: number;
  tags: string[];
  requirements: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}