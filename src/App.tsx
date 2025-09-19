import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Community } from './components/Community';
import { AIAssistant } from './components/AIAssistant';
import LearningWall from './components/LearningWall';
import { UserProfile } from './types/user';

function App() {
  console.log('App component rendering...');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'community' | 'assistant' | 'learning'>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App useEffect running...');
    try {
      // Check for existing user profile
      const savedUser = localStorage.getItem('climateActionUser');
      console.log('Saved user from localStorage:', savedUser);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('Parsed user:', parsedUser);
        setUser(parsedUser);
      }
      setIsLoading(false);
      console.log('App initialization complete');
    } catch (error) {
      console.error('Error in App useEffect:', error);
      setIsLoading(false);
    }
  }, []);

  const handleUserSetup = (userProfile: UserProfile) => {
    setUser(userProfile);
    localStorage.setItem('climateActionUser', JSON.stringify(userProfile));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('climateActionUser');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"
          role="status"
          aria-label="Loading application"
        >
          <span className="sr-only">Loading WeWatch application...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Onboarding onUserSetup={handleUserSetup} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Skip Links for Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      
      <Header 
        user={user} 
        currentView={currentView} 
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      
      <main 
        className="pt-20 flex-1"
        role="main"
        aria-label="Main content area"
        id="main-content"
      >
        {currentView === 'dashboard' && <Dashboard user={user} />}
        {currentView === 'community' && <Community user={user} />}
        {currentView === 'assistant' && <AIAssistant user={user} />}
        {currentView === 'learning' && <LearningWall user={user} />}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;