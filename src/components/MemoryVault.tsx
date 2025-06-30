import React from 'react';
import { Heart, Calendar, Tag, Plus, FileText, Mic } from 'lucide-react';
import { Profile } from '../types';

interface MemoryVaultProps {
  profile: Profile;
  onAddMemory: () => void;
}

const MemoryVault: React.FC<MemoryVaultProps> = ({ profile, onAddMemory }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Memory Vault</h2>
          <p className="text-gray-600">Memories of {profile.name}</p>
        </div>
        <button
          onClick={onAddMemory}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Memory
        </button>
      </div>

      {profile.memories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
          <p className="text-gray-600 mb-6">Start building {profile.name}'s memory vault</p>
          <button
            onClick={onAddMemory}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add First Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.memories.map((memory) => (
            <div
              key={memory.id}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {memory.type === 'text' ? (
                    <FileText className="w-5 h-5 text-purple-600" />
                  ) : (
                    <Mic className="w-5 h-5 text-pink-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {memory.type}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(memory.createdAt).toLocaleDateString()}
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">
                {memory.content}
              </p>

              {memory.tags && memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {memory.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
                    >
                      <Tag className="w-2 h-2 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryVault;