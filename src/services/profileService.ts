import { Profile, Memory, VectorSearchResult } from '../types';

const API_BASE_URL = '/api';

class ProfileService {
  async getProfiles(): Promise<Profile[]> {
    try {
      console.log('🔄 Fetching profiles from:', `${API_BASE_URL}/profiles`);
      const response = await fetch(`${API_BASE_URL}/profiles`);
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to fetch profiles: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Profiles data received:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching profiles:', error);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  async createProfile(profileData: Omit<Profile, 'id' | 'createdAt' | 'memories'>): Promise<Profile> {
    try {
      console.log('🔄 Creating profile with data:', profileData);
      console.log('📡 Sending request to:', `${API_BASE_URL}/profiles`);
      
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      console.log('📡 Create profile response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create profile error response:', errorText);
        throw new Error(`Failed to create profile: ${response.status} ${errorText}`);
      }
      
      const newProfile = await response.json();
      console.log('✅ Profile created successfully:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 3001.');
      }
      throw error;
    }
  }

  async addMemory(profileId: string, memoryData: Omit<Memory, 'id' | 'createdAt' | 'embedding'>): Promise<Memory> {
    try {
      console.log('🔄 Adding memory to profile:', profileId);
      console.log('📝 Memory data:', memoryData);
      
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/memories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoryData),
      });
      
      console.log('📡 Add memory response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Add memory error:', errorText);
        throw new Error(`Failed to add memory: ${response.status} ${errorText}`);
      }
      
      const newMemory = await response.json();
      console.log('✅ Memory added successfully:', newMemory);
      return newMemory;
    } catch (error) {
      console.error('❌ Error adding memory:', error);
      throw error;
    }
  }

  async chat(profileId: string, message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []): Promise<string> {
    try {
      console.log('🔄 Sending chat message to profile:', profileId);
      console.log('💬 Message:', message);
      console.log('📚 Conversation history length:', conversationHistory.length);
      
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          conversationHistory 
        }),
      });
      
      console.log('📡 Chat response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Chat error:', errorText);
        throw new Error(`Failed to send message: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Chat response received:', data);
      return data.response;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  async searchMemories(profileId: string, query: string, limit: number = 5): Promise<VectorSearchResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, limit }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Search error:', errorText);
        throw new Error(`Failed to search memories: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('❌ Error searching memories:', error);
      return [];
    }
  }
}

export const profileService = new ProfileService();
