import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, Users, Tag, FileText } from 'lucide-react';
import { UserProfile, CommunityActivity } from '../../types/user';

interface CreateActivityModalProps {
  user: UserProfile;
  onClose: () => void;
  onCreate: (activity: Omit<CommunityActivity, 'id' | 'currentParticipants' | 'status'>) => void;
}

export const CreateActivityModal: React.FC<CreateActivityModalProps> = ({ user, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'cleanup' as CommunityActivity['category'],
    dateTime: '',
    duration: 2,
    locationName: '',
    maxParticipants: '',
    tags: '',
    requirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.dateTime || !formData.locationName) {
      return;
    }

    setIsSubmitting(true);

    const activity = {
      title: formData.title,
      description: formData.description,
      organizer: {
        name: user.name,
        id: user.id,
      },
      location: {
        name: formData.locationName,
        coordinates: {
          lat: user.location.coordinates?.lat || 0,
          lng: user.location.coordinates?.lng || 0,
        },
      },
      dateTime: formData.dateTime,
      duration: formData.duration,
      category: formData.category,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      requirements: formData.requirements.split('\n').map(req => req.trim()).filter(req => req),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onCreate(activity);
    setIsSubmitting(false);
  };

  const categoryOptions = [
    { value: 'cleanup', label: '🧹 Cleanup', description: 'Environmental cleanup activities' },
    { value: 'planting', label: '🌱 Tree Planting', description: 'Planting trees and gardens' },
    { value: 'awareness', label: '📢 Awareness', description: 'Educational and awareness campaigns' },
    { value: 'research', label: '🔬 Research', description: 'Citizen science and data collection' },
    { value: 'advocacy', label: '📢 Advocacy', description: 'Policy and community advocacy' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Activity</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Community Beach Cleanup"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoryOptions.map((option) => (
                <label
                  key={option.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.category === option.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.value}
                    checked={formData.category === option.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CommunityActivity['category'] }))}
                    className="sr-only"
                  />
                  <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Describe your activity, its purpose, and what participants can expect..."
              required
            />
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Location & Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Meeting point or activity location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Max Participants
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Leave empty for unlimited"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline h-4 w-4 mr-1" />
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="beach, plastic-free, family-friendly (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Requirements
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Bring gloves&#10;Wear comfortable shoes&#10;Bring water bottle"
            />
            <p className="text-sm text-gray-500 mt-1">One requirement per line</p>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.description || !formData.dateTime || !formData.locationName}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>Create Activity</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};