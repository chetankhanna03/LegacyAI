import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const hasAPI = apiKey?.startsWith('sk-') && !apiKey.includes('proj');

const openai = hasAPI ? new OpenAI({ apiKey }) : null;

class ChatService {
  async generateResponse(profile, userMessage, relevantMemories = [], conversationHistory = []) {
    const memoryContext = this.buildMemoryContext(relevantMemories);
    const systemPrompt = this.createSystemPrompt(profile, memoryContext);

    // fallback if API is not available
    if (!hasAPI) {
      return this.mockReply(profile, userMessage, memoryContext);
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10),
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 400,
        temperature: 0.8
      });

      return response.choices[0].message.content;
    } catch (err) {
      console.warn('⚠️ API failed, using mock:', err.message);
      return this.mockReply(profile, userMessage, memoryContext);
    }
  }

  createSystemPrompt(profile, memoryContext) {
    return `You are ${profile.name}, speaking as someone's ${profile.relationship}. Use first-person tone and recall memories naturally.

MEMORIES:
${memoryContext}`;
  }

  buildMemoryContext(memories = []) {
    if (!memories.length) return "No specific memories.";
    return memories
      .slice(0, 3)
      .map((m, i) => `${i + 1}. ${m.memory.content}`)
      .join('\n');
  }

  mockReply(profile, msg, memory) {
    return `👋 Hey! I'm ${profile.name} (${profile.relationship}). I can't think clearly right now, but I remember this:\n\n${memory}\n\nYou said: "${msg}" — that's sweet!`;
  }
}

export const chatService = new ChatService();
