import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { database } from '../database/init.js';
import { embeddingService } from '../services/embeddingService.js';
import { chatService } from '../services/chatService.js';

const router = express.Router();

// Get all profiles
router.get('/', (req, res) => {
  try {
    console.log('GET /profiles - Current database state:', database);
    const profiles = database.profiles.map(profile => ({
      ...profile,
      memories: profile.memories || []
    }));
    console.log('Returning profiles:', profiles);
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles', details: error.message });
  }
});

// Create new profile
router.post('/', (req, res) => {
  try {
    console.log('POST /profiles - Request body:', req.body);
    const { name, description, relationship, personality } = req.body;
    
    if (!name || !relationship) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({ error: 'Name and relationship are required' });
    }

    const newProfile = {
      id: uuidv4(),
      name: name.trim(),
      description: description ? description.trim() : '',
      relationship: relationship.trim(),
      personality: personality ? personality.trim() : '',
      memories: [],
      createdAt: new Date()
    };

    console.log('Creating new profile:', newProfile);
    
    // Ensure database.profiles exists
    if (!database.profiles) {
      database.profiles = [];
    }
    
    database.profiles.push(newProfile);
    console.log('Profile added to database. Total profiles:', database.profiles.length);
    console.log('Updated database state:', database);
    
    res.status(201).json(newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile', details: error.message });
  }
});

// Add memory to profile
router.post('/:profileId/memories', async (req, res) => {
  try {
    console.log('POST /profiles/:profileId/memories - Request params:', req.params);
    console.log('Request body:', req.body);
    
    const { profileId } = req.params;
    const { content, type, tags } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Memory content is required' });
    }

    const profile = database.profiles.find(p => p.id === profileId);
    if (!profile) {
      console.log('Profile not found:', profileId);
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('Found profile for memory:', profile.name);

    // Generate embedding for the memory
    const embedding = await embeddingService.generateEmbedding(content);

    const newMemory = {
      id: uuidv4(),
      content: content.trim(),
      type: type || 'text',
      tags: tags || [],
      embedding,
      createdAt: new Date()
    };

    if (!profile.memories) {
      profile.memories = [];
    }
    
    profile.memories.push(newMemory);
    console.log('Memory added successfully. Total memories for profile:', profile.memories.length);
    
    res.status(201).json(newMemory);
  } catch (error) {
    console.error('Error adding memory:', error);
    res.status(500).json({ error: 'Failed to add memory', details: error.message });
  }
});

// Chat with profile
router.post('/:profileId/chat', async (req, res) => {
  try {
    console.log('POST /profiles/:profileId/chat - Request params:', req.params);
    console.log('Request body:', req.body);
    
    const { profileId } = req.params;
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const profile = database.profiles.find(p => p.id === profileId);
    if (!profile) {
      console.log('Profile not found for chat:', profileId);
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('Found profile for chat:', profile.name);
    console.log('Conversation history length:', conversationHistory.length);

    // Search for relevant memories
    const relevantMemories = await embeddingService.searchSimilarMemories(
      profile.memories || [],
      message,
      5
    );

    // Generate chat response with conversation history
    const response = await chatService.generateResponse(profile, message, relevantMemories, conversationHistory);
    
    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
});

// Search memories
router.post('/:profileId/search', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { query, limit } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const profile = database.profiles.find(p => p.id === profileId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const results = await embeddingService.searchSimilarMemories(
      profile.memories || [],
      query,
      limit || 5
    );

    res.json(results);
  } catch (error) {
    console.error('Error searching memories:', error);
    res.status(500).json({ error: 'Failed to search memories', details: error.message });
  }
});

export default router;