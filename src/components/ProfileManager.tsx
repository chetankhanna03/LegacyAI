import React from 'react';
import { User, Plus, Calendar, Heart, Eye } from 'lucide-react';
import { Profile } from '../types';

interface ProfileManagerProps {
  profiles: Profile[];
  activeProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: () => void;
  onViewProfile: (profile: Profile) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onViewProfile
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Memory Profiles</h2>
        <button
          onClick={onCreateProfile}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Profile
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles yet</h3>
          <p className="text-gray-600 mb-6">Create your first memory profile to get started</p>
          <button
            onClick={onCreateProfile}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`relative p-6 rounded-xl border-2 transition-all duration-200 group ${
                activeProfile?.id === profile.id
                  ? 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {profile.avatar || profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-indigo-600 mb-2">{profile.relationship}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {profile.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{profile.memories.length} memories</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProfile(profile);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200"
                >
                  Chat
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewProfile(profile);
                  }}
                  className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </button>
              </div>

              {/* Click overlay for mobile */}
              <div 
                className="absolute inset-0 cursor-pointer md:hidden"
                onClick={() => onViewProfile(profile)}
              />

              {activeProfile?.id === profile.id && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileManager;