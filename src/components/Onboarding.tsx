import React, { useState } from 'react';
import { MapPin, User, ArrowRight, Globe } from 'lucide-react';
import { UserProfile } from '../types/user';
import { geocodingService } from '../services/geocoding';

interface OnboardingProps {
  onUserSetup: (user: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onUserSetup }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) return;

    setIsLoading(true);
    
    try {
      // Try to geocode the location
      let coordinates = null;
      let processedLocation = location.trim();
      let country = 'Global';
      
      const geocodeResult = await geocodingService.geocodeLocation(location);
      if (geocodeResult) {
        coordinates = {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng
        };
        processedLocation = geocodeResult.city;
        country = geocodeResult.country;
      } else {
        // Fallback to estimation
        const estimatedResult = await geocodingService.estimateCoordinates(location);
        if (estimatedResult) {
          coordinates = {
            lat: estimatedResult.lat,
            lng: estimatedResult.lng
          };
          processedLocation = estimatedResult.city;
          country = estimatedResult.country;
        }
      }
    
      const userProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        location: {
          city: processedLocation,
          country: country,
          coordinates: coordinates
        },
        preferences: {
          notifications: true,
          language: 'en',
        },
        joinedAt: new Date().toISOString(),
      };

      onUserSetup(userProfile);
    } catch (error) {
      console.error('Error processing location:', error);
      // Fallback to basic setup
      const userProfile: UserProfile = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        location: {
          city: location.trim(),
          country: 'Global',
          coordinates: {
            lat: 0,
            lng: 0
          }
        },
        preferences: {
          notifications: true,
          language: 'en',
        },
        joinedAt: new Date().toISOString(),
      };
      onUserSetup(userProfile);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-2xl inline-block mb-6">
            <Globe className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to WeWatch
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Monitor climate risks, understand environmental changes, and take action with your community
          </p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Let's get to know you
              </h2>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Where are you located?
              </h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  City, town, or village
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., San Francisco, Lagos, Mumbai"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  This helps us provide relevant climate and environmental data for your area
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!location.trim() || isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="text-center mt-8">
          <div className="flex justify-center space-x-2 mb-4">
            <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-blue-500' : 'bg-gray-200'
            }`}></div>
            <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-green-500' : 'bg-gray-200'
            }`}></div>
          </div>
          <p className="text-sm text-gray-500">
            Step {step} of 2
          </p>
        </div>
      </div>
    </div>
  );
};