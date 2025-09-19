import React from 'react';
import { Globe, Users, MessageCircle, BookOpen, LogOut } from 'lucide-react';
import { UserProfile } from '../types/user';

interface HeaderProps {
  user: UserProfile;
  currentView: 'dashboard' | 'community' | 'assistant' | 'learning';
  onViewChange: (view: 'dashboard' | 'community' | 'assistant' | 'learning') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentView,
  onViewChange,
  onLogout
}) => {
  return (
    <header 
      className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-green-100"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-lg">
              <Globe className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WeWatch</h1>
              <p className="text-sm text-gray-600">
                <span className="sr-only">Location: </span>
                {user.location.city}, {user.location.country}
              </p>
            </div>
          </div>

          <nav 
            id="navigation"
            className="hidden md:flex items-center space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            <button
              onClick={() => onViewChange('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                currentView === 'dashboard'
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={currentView === 'dashboard' ? 'page' : undefined}
              aria-label="Navigate to Dashboard"
            >
              Dashboard
            </button>
            <button
              onClick={() => onViewChange('community')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                currentView === 'community'
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={currentView === 'community' ? 'page' : undefined}
              aria-label="Navigate to Action Drives"
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Action Drives</span>
            </button>
            <button
              onClick={() => onViewChange('assistant')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                currentView === 'assistant'
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={currentView === 'assistant' ? 'page' : undefined}
              aria-label="Navigate to EcoPal Assistant"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>EcoPal</span>
            </button>
            <button
              onClick={() => onViewChange('learning')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                currentView === 'learning'
                  ? 'bg-green-100 text-green-700 shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={currentView === 'learning' ? 'page' : undefined}
              aria-label="Navigate to Learning Wall"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Learning Wall</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                <span className="sr-only">Welcome, </span>Hello, {user.name}
              </p>
              <p className="text-xs text-gray-600">Climate Guardian</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              title="Logout"
              aria-label="Logout from WeWatch"
            >
              <LogOut className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav 
          className="md:hidden flex items-center justify-center space-x-1 pb-3"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              currentView === 'dashboard'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600'
            }`}
            aria-current={currentView === 'dashboard' ? 'page' : undefined}
            aria-label="Navigate to Dashboard"
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('community')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              currentView === 'community'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600'
            }`}
            aria-current={currentView === 'community' ? 'page' : undefined}
            aria-label="Navigate to Action Drives"
          >
            Community
          </button>
          <button
            onClick={() => onViewChange('assistant')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              currentView === 'assistant'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600'
            }`}
            aria-current={currentView === 'assistant' ? 'page' : undefined}
            aria-label="Navigate to EcoPal Assistant"
          >
            Assistant
          </button>
          <button
            onClick={() => onViewChange('learning')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              currentView === 'learning'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600'
            }`}
            aria-current={currentView === 'learning' ? 'page' : undefined}
            aria-label="Navigate to Learning Wall"
          >
            Learning
          </button>
        </nav>
      </div>
    </header>
  );
};