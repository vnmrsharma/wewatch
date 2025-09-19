import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Tag, User } from 'lucide-react';
import { CommunityActivity, UserProfile } from '../../types/user';

interface ActivityCardProps {
  activity: CommunityActivity;
  currentUser: UserProfile;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, currentUser }) => {
  const [isJoined, setIsJoined] = useState(false);

  const getCategoryColor = (category: CommunityActivity['category']) => {
    const colorMap = {
      cleanup: 'bg-green-100 text-green-800 border-green-200',
      planting: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      awareness: 'bg-blue-100 text-blue-800 border-blue-200',
      research: 'bg-purple-100 text-purple-800 border-purple-200',
      advocacy: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colorMap[category];
  };

  const getCategoryEmoji = (category: CommunityActivity['category']) => {
    const emojiMap = {
      cleanup: '🧹',
      planting: '🌱',
      awareness: '📢',
      research: '🔬',
      advocacy: '📢',
    };
    return emojiMap[category];
  };

  const handleJoinActivity = () => {
    setIsJoined(!isJoined);
    // In a real app, this would make an API call
  };

  const isOwnActivity = activity.organizer.id === currentUser.id;
  const isFull = activity.maxParticipants && activity.currentParticipants >= activity.maxParticipants;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getCategoryEmoji(activity.category)}</span>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{activity.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>by {activity.organizer.name}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(activity.category)}`}>
            {activity.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">{activity.description}</p>

        {/* Activity Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-600">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">{new Date(activity.dateTime).toLocaleDateString()}</p>
                <p className="text-sm">{new Date(activity.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Clock className="h-5 w-5 text-green-500" />
              <span>{activity.duration} hours</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-gray-600">
              <MapPin className="h-5 w-5 text-red-500" />
              <span>{activity.location.name}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-600">
              <Users className="h-5 w-5 text-purple-500" />
              <span>
                {activity.currentParticipants}
                {activity.maxParticipants && ` / ${activity.maxParticipants}`} participants
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {activity.tags.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {activity.requirements.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
            <ul className="space-y-1">
              {activity.requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {activity.status === 'upcoming' ? 'Upcoming' : 'In Progress'}
          </div>
          
          {!isOwnActivity && activity.status === 'upcoming' && (
            <button
              onClick={handleJoinActivity}
              disabled={isFull && !isJoined}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isJoined
                  ? 'bg-green-100 text-green-700 border-2 border-green-200 hover:bg-green-200'
                  : isFull
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isJoined ? 'Joined ✓' : isFull ? 'Full' : 'Join Activity'}
            </button>
          )}

          {isOwnActivity && (
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
                Edit
              </button>
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                Your Event
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};