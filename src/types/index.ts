export interface Profile {
  id: string;
  name: string;
  description: string;
  relationship: string;
  avatar?: string;
  personality?: string;
  memories: Memory[];
  createdAt: Date;
}

export interface Memory {
  id: string;
  content: string;
  type: 'text' | 'audio';
  tags?: string[];
  createdAt: Date;
  embedding?: number[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface VectorSearchResult {
  memory: Memory;
  similarity: number;
}