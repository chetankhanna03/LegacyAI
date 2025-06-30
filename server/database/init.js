// Simple in-memory database for development
// In production, this would be replaced with a proper database like PostgreSQL or MongoDB

export const database = {
  profiles: [],
  initialized: false
};

export function initializeDatabase() {
  if (database.initialized) {
    console.log('📦 Database already initialized');
    return;
  }

  console.log('📦 Initializing database...');
  
  // Ensure profiles array exists
  if (!database.profiles) {
    database.profiles = [];
  }

  // Add sample profile for development
  const sampleProfile = {
    id: 'sample-profile-1',
    name: 'Sample Grandma',
    description: 'A loving grandmother who always had the best stories and advice.',
    relationship: 'Grandparent',
    personality: 'Warm, wise, always had a cookie ready, spoke with a gentle voice and often shared stories from her childhood.',
    memories: [
      {
        id: 'memory-1',
        content: 'She used to bake chocolate chip cookies every Sunday and tell us stories about growing up on the farm.',
        type: 'text',
        tags: ['cooking', 'childhood', 'farm'],
        embedding: null, // Would be generated in real implementation
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'memory-2',
        content: 'Always said "Life is like a garden - you get out what you put in, and patience makes everything grow better."',
        type: 'text',
        tags: ['advice', 'wisdom', 'gardening'],
        embedding: null,
        createdAt: new Date('2024-01-02')
      }
    ],
    createdAt: new Date('2024-01-01')
  };

  database.profiles.push(sampleProfile);
  database.initialized = true;
  
  console.log('📦 Database initialized successfully');
  console.log('📦 Sample profiles added:', database.profiles.length);
  console.log('📦 Database state:', database);
}