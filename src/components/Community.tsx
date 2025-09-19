import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users as UsersIcon, MapPin, Tag } from 'lucide-react';
import { UserProfile, CommunityActivity } from '../types/user';
import { ActivityCard } from './community/ActivityCard';
import { CreateActivityModal } from './community/CreateActivityModal';
import { mockCommunityActivities } from '../data/mockData';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface CommunityProps {
  user: UserProfile;
}

export const Community: React.FC<CommunityProps> = ({ user }) => {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'my-activities'>('all');

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities(mockCommunityActivities);
      setIsLoading(false);
    };

    loadActivities();
  }, []);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'upcoming') {
      return activity.status === 'upcoming';
    }
    if (filter === 'my-activities') {
      return activity.organizer.id === user.id;
    }
    return true;
  });

  const handleCreateActivity = (newActivity: Omit<CommunityActivity, 'id' | 'currentParticipants' | 'status'>) => {
    const activity: CommunityActivity = {
      ...newActivity,
      id: `activity_${Date.now()}`,
      currentParticipants: 1,
      status: 'upcoming'
    };
    setActivities(prev => [activity, ...prev]);
    setShowCreateModal(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <LoadingSpinner size="lg" />
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Loading community activities...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Action Drives
          </h1>
          <p className="text-lg text-gray-600">
            Join local environmental activities and make a difference
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create Activity</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activities.filter(a => a.status === 'upcoming').length}</p>
              <p className="text-gray-600">Upcoming Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activities.reduce((sum, a) => sum + a.currentParticipants, 0)}
              </p>
              <p className="text-gray-600">Active Participants</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activities.filter(a => a.organizer.id === user.id).length}</p>
              <p className="text-gray-600">Your Activities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center space-x-2 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filter === 'all' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Activities
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filter === 'upcoming' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('my-activities')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            filter === 'my-activities' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          My Activities
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-6">
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} currentUser={user} />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-50 rounded-2xl p-8">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'my-activities' 
                  ? "You haven't created any activities yet."
                  : "No activities match your current filter."
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                Create First Activity
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Activity Modal */}
      {showCreateModal && (
        <CreateActivityModal
          user={user}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateActivity}
        />
      )}
    </div>
  );
};