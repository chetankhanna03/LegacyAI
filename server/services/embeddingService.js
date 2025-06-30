import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

class EmbeddingService {
  async generateEmbedding(text) {
    try {
      if (!openai) {
        console.warn('⚠️ OpenAI API key not configured, using enhanced mock embedding');
        // Return a more sophisticated mock embedding based on text content
        return this.generateSmartMockEmbedding(text);
      }

      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      // Fallback to smart mock embedding if API fails
      return this.generateSmartMockEmbedding(text);
    }
  }

  generateSmartMockEmbedding(text) {
    // Create a more intelligent mock embedding based on text content
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(1536).fill(0);
    
    // Create patterns based on common themes
    const themes = {
      family: ['family', 'mother', 'father', 'parent', 'child', 'sibling', 'brother', 'sister'],
      cooking: ['cook', 'bake', 'recipe', 'kitchen', 'food', 'meal', 'dinner', 'breakfast'],
      childhood: ['childhood', 'young', 'kid', 'school', 'play', 'toy', 'game'],
      wisdom: ['advice', 'wisdom', 'learn', 'teach', 'experience', 'life', 'important'],
      emotions: ['love', 'happy', 'sad', 'joy', 'proud', 'care', 'miss', 'remember'],
      activities: ['work', 'job', 'hobby', 'travel', 'visit', 'go', 'do', 'make']
    };

    // Assign higher values to dimensions based on theme presence
    Object.entries(themes).forEach(([theme, keywords], themeIndex) => {
      const themeScore = keywords.reduce((score, keyword) => {
        return score + (words.includes(keyword) ? 1 : 0);
      }, 0);
      
      // Distribute theme score across multiple dimensions
      for (let i = 0; i < 50; i++) {
        const dimIndex = (themeIndex * 50 + i) % 1536;
        embedding[dimIndex] = (themeScore / keywords.length) * (Math.random() * 0.4 + 0.8);
      }
    });

    // Add some random noise to make embeddings more realistic
    for (let i = 0; i < 1536; i++) {
      if (embedding[i] === 0) {
        embedding[i] = (Math.random() - 0.5) * 0.1;
      }
    }

    return embedding;
  }

  // Enhanced cosine similarity calculation
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
  }

  async searchSimilarMemories(memories, query, limit = 5) {
    try {
      if (!memories || memories.length === 0) return [];

      console.log(`🔍 Searching ${memories.length} memories for: "${query}"`);

      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      // Calculate similarities with enhanced scoring
      const results = memories
        .map(memory => {
          let similarity = 0;
          
          if (memory.embedding) {
            similarity = this.cosineSimilarity(queryEmbedding, memory.embedding);
          }
          
          // Boost similarity for exact keyword matches
          const queryWords = query.toLowerCase().split(/\s+/);
          const memoryWords = memory.content.toLowerCase().split(/\s+/);
          const keywordMatches = queryWords.filter(word => 
            memoryWords.some(memWord => memWord.includes(word) || word.includes(memWord))
          ).length;
          
          const keywordBoost = (keywordMatches / queryWords.length) * 0.3;
          similarity += keywordBoost;
          
          // Boost for tag matches
          if (memory.tags && memory.tags.length > 0) {
            const tagMatches = memory.tags.filter(tag => 
              query.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(query.toLowerCase())
            ).length;
            const tagBoost = (tagMatches / memory.tags.length) * 0.2;
            similarity += tagBoost;
          }
          
          // Ensure similarity doesn't exceed 1.0
          similarity = Math.min(similarity, 1.0);
          
          return {
            memory: {
              id: memory.id,
              content: memory.content,
              type: memory.type,
              tags: memory.tags,
              createdAt: memory.createdAt
            },
            similarity
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      console.log(`✅ Found ${results.length} relevant memories with similarities:`, 
        results.map(r => `${r.similarity.toFixed(3)}`).join(', '));

      return results;
    } catch (error) {
      console.error('❌ Error searching similar memories:', error);
      // Enhanced fallback text search
      return this.enhancedTextSearch(memories, query, limit);
    }
  }

  enhancedTextSearch(memories, query, limit) {
    const queryWords = query.toLowerCase().split(/\s+/);
    
    const results = memories
      .map(memory => {
        const memoryText = memory.content.toLowerCase();
        const memoryWords = memoryText.split(/\s+/);
        
        // Calculate multiple similarity metrics
        let exactMatches = 0;
        let partialMatches = 0;
        let tagMatches = 0;
        
        queryWords.forEach(queryWord => {
          if (memoryText.includes(queryWord)) {
            exactMatches++;
          } else {
            // Check for partial matches
            memoryWords.forEach(memoryWord => {
              if (memoryWord.includes(queryWord) || queryWord.includes(memoryWord)) {
                partialMatches += 0.5;
              }
            });
          }
        });
        
        // Check tag matches
        if (memory.tags) {
          memory.tags.forEach(tag => {
            if (query.toLowerCase().includes(tag.toLowerCase())) {
              tagMatches++;
            }
          });
        }
        
        const similarity = (exactMatches + partialMatches + tagMatches) / queryWords.length;
        
        return {
          memory: {
            id: memory.id,
            content: memory.content,
            type: memory.type,
            tags: memory.tags,
            createdAt: memory.createdAt
          },
          similarity: Math.min(similarity, 1.0)
        };
      })
      .filter(result => result.similarity > 0.1) // Only include somewhat relevant results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    console.log(`📝 Text search found ${results.length} relevant memories`);
    return results;
  }
}

export const embeddingService = new EmbeddingService();