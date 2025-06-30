import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle, User, Settings, Brain, Heart } from 'lucide-react';
import ProfileManager from './components/ProfileManager';
import ChatInterface from './components/ChatInterface';
import MemoryVault from './components/MemoryVault';
import CreateProfileModal from './components/modals/CreateProfileModal';
import AddMemoryModal from './components/modals/AddMemoryModal';
import ProfileDetailModal from './components/modals/ProfileDetailModal';
import { Profile, Memory, ChatMessage } from './types';
import { profileService } from './services/profileService';

function App() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [currentView, setCurrentView] = useState<'chat' | 'memories' | 'profiles'>('chat');
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [showProfileDetail, setShowProfileDetail] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  // Clear chat when switching profiles
  useEffect(() => {
    if (activeProfile) {
      setChatMessages([]);
      setConversationHistory([]);
    }
  }, [activeProfile?.id]);

  const loadProfiles = async () => {
    try {
      console.log('Loading profiles...');
      const loadedProfiles = await profileService.getProfiles();
      console.log('Loaded profiles:', loadedProfiles);
      setProfiles(loadedProfiles);
      if (loadedProfiles.length > 0 && !activeProfile) {
        setActiveProfile(loadedProfiles[0]);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const handleCreateProfile = async (profileData: Omit<Profile, 'id' | 'createdAt' | 'memories'>) => {
    try {
      console.log('Creating profile with data:', profileData);
      const newProfile = await profileService.createProfile(profileData);
      console.log('Profile created successfully:', newProfile);
      setProfiles(prev => {
        const updated = [...prev, newProfile];
        console.log('Updated profiles list:', updated);
        return updated;
      });
      setActiveProfile(newProfile);
      setShowCreateProfile(false);
    } catch (error) {
      console.error('Failed to create profile:', error);
      alert('Failed to create profile. Please check the console for details.');
    }
  };

  const handleUpdateProfile = async (profileId: string, updates: Partial<Profile>) => {
    try {
      // For now, we'll update locally since we don't have an update endpoint
      setProfiles(prev => prev.map(p => 
        p.id === profileId ? { ...p, ...updates } : p
      ));
      
      if (activeProfile?.id === profileId) {
        setActiveProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      
      if (selectedProfile?.id === profileId) {
        setSelectedProfile(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleViewProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setShowProfileDetail(true);
  };

  const handleAddMemory = async (memory: Omit<Memory, 'id' | 'createdAt' | 'embedding'>) => {
    if (!activeProfile) return;
    
    try {
      setIsLoading(true);
      const newMemory = await profileService.addMemory(activeProfile.id, memory);
      setProfiles(prev => prev.map(p => 
        p.id === activeProfile.id 
          ? { ...p, memories: [...p.memories, newMemory] }
          : p
      ));
      setActiveProfile(prev => prev ? { ...prev, memories: [...prev.memories, newMemory] } : null);
      setShowAddMemory(false);
    } catch (error) {
      console.error('Failed to add memory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!activeProfile) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history
    const newConversationHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ];
    setConversationHistory(newConversationHistory);
    
    setIsLoading(true);

    try {
      const response = await profileService.chat(activeProfile.id, message, newConversationHistory);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
      // Update conversation history with AI response
      setConversationHistory([
        ...newConversationHistory,
        { role: 'assistant' as const, content: response }
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Legacy.AI
                </h1>
                {activeProfile && (
                  <p className="text-sm text-gray-600">Chatting with {activeProfile.name}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView('profiles')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'profiles' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('memories')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'memories' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentView('chat')}
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'chat' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'profiles' && (
          <ProfileManager
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={setActiveProfile}
            onCreateProfile={() => setShowCreateProfile(true)}
            onViewProfile={handleViewProfile}
          />
        )}

        {currentView === 'memories' && activeProfile && (
          <MemoryVault
            profile={activeProfile}
            onAddMemory={() => setShowAddMemory(true)}
          />
        )}

        {currentView === 'chat' && (
          <ChatInterface
            profile={activeProfile}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onAddMemory={() => setShowAddMemory(true)}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        {activeProfile && currentView === 'chat' && (
          <button
            onClick={() => setShowAddMemory(true)}
            className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          >
            <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
        
        <button
          onClick={() => setShowCreateProfile(true)}
          className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
        >
          <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Modals */}
      {showCreateProfile && (
        <CreateProfileModal
          onClose={() => setShowCreateProfile(false)}
          onSubmit={handleCreateProfile}
        />
      )}

      {showAddMemory && activeProfile && (
        <AddMemoryModal
          profileName={activeProfile.name}
          onClose={() => setShowAddMemory(false)}
          onSubmit={handleAddMemory}
          isLoading={isLoading}
        />
      )}

      {showProfileDetail && selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          onClose={() => {
            setShowProfileDetail(false);
            setSelectedProfile(null);
          }}
          onUpdate={handleUpdateProfile}
        />
      )}
      <footer style={{
  textAlign: 'center',
  padding: '1rem',
  fontSize: '0.9rem',
  color: '#888',
  borderTop: '1px solid #eee',
  marginTop: '2rem'
}}>
  Built with ❤️ by <strong>Bolt.new</strong>
</footer>
    </div>
  );
}

export default App;
