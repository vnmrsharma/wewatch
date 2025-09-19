// Geocoding service to convert location names to coordinates
interface GeocodeResult {
  lat: number;
  lng: number;
  city: string;
  country: string;
  formatted_address: string;
}

class GeocodingService {
  private readonly OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  async geocodeLocation(locationName: string): Promise<GeocodeResult | null> {
    try {
      // Check if API key is available
      if (!this.OPENWEATHER_API_KEY) {
        console.warn('OpenWeatherMap API key not configured, using fallback geocoding');
        return this.estimateCoordinates(locationName);
      }
      
      // Use OpenWeatherMap's Geocoding API (free with weather API key)
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=1&appid=${this.OPENWEATHER_API_KEY}`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          lat: result.lat,
          lng: result.lon,
          city: result.name,
          country: result.country,
          formatted_address: `${result.name}, ${result.state || ''} ${result.country}`.trim()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to estimation if API fails
      return this.estimateCoordinates(locationName);
    }
  }

  // Fallback method using a simple coordinate estimation
  async estimateCoordinates(locationName: string): Promise<GeocodeResult | null> {
    // This is a very basic fallback - in production you'd want a more robust solution
    const cityCoordinates: { [key: string]: { lat: number; lng: number; country: string } } = {
      'new york': { lat: 40.7128, lng: -74.0060, country: 'US' },
      'london': { lat: 51.5074, lng: -0.1278, country: 'GB' },
      'tokyo': { lat: 35.6762, lng: 139.6503, country: 'JP' },
      'paris': { lat: 48.8566, lng: 2.3522, country: 'FR' },
      'sydney': { lat: -33.8688, lng: 151.2093, country: 'AU' },
      'mumbai': { lat: 19.0760, lng: 72.8777, country: 'IN' },
      'lagos': { lat: 6.5244, lng: 3.3792, country: 'NG' },
      'mexico city': { lat: 19.4326, lng: -99.1332, country: 'MX' },
      'berlin': { lat: 52.5200, lng: 13.4050, country: 'DE' },
      'cairo': { lat: 30.0444, lng: 31.2357, country: 'EG' }
    };

    const normalizedName = locationName.toLowerCase().trim();
    const coords = cityCoordinates[normalizedName];
    
    if (coords) {
      return {
        lat: coords.lat,
        lng: coords.lng,
        city: locationName,
        country: coords.country,
        formatted_address: `${locationName}, ${coords.country}`
      };
    }

    // If no match found, return a random location for demo purposes
    return {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
      city: locationName,
      country: 'Unknown',
      formatted_address: locationName
    };
  }
}

export const geocodingService = new GeocodingService();