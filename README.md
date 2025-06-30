# Legacy.AI 🚀

A memory-based conversational AI that allows users to create digital profiles of loved ones, upload memories, and chat with these profiles as if talking to that person.

## ✨ Features

- **Profile Creation**: Create detailed profiles for loved ones with personality traits and relationship context
- **Memory Management**: Add text memories and audio transcriptions to build rich memory vaults
- **AI-Powered Chat**: Engage in conversations powered by vector similarity search and OpenAI's GPT models
- **Vector Embeddings**: Memories are embedded using OpenAI's embedding models for semantic search
- **Beautiful UI**: Modern, gradient-based interface with smooth animations and intuitive design
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **OpenAI API** for embeddings and chat completions
- **Vector similarity search** with cosine similarity
- **In-memory database** (easily replaceable with PostgreSQL/MongoDB)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key (optional for development - mock responses are provided)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Add your OpenAI API key** to `.env` (optional for development):
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Start the development servers**:

In one terminal (frontend):
```bash
npm run dev
```

In another terminal (backend):
```bash
npm run server
```

5. **Open your browser** to `http://localhost:5173`

## 🏗️ Architecture

### Vector Embedding Flow
1. **Memory Input**: Users add text or audio transcription memories
2. **Embedding Generation**: OpenAI's `text-embedding-3-small` creates vector embeddings
3. **Storage**: Embeddings stored alongside memory content
4. **Search**: User messages are embedded and compared using cosine similarity
5. **Context Building**: Most relevant memories are injected into the chat prompt
6. **Response Generation**: GPT generates personalized responses based on context

### Database Schema
```typescript
Profile {
  id: string
  name: string
  description: string
  relationship: string
  personality?: string
  memories: Memory[]
  createdAt: Date
}

Memory {
  id: string
  content: string
  type: 'text' | 'audio'
  tags?: string[]
  embedding: number[]
  createdAt: Date
}
```

## 🎨 UI/UX Features

- **Modern Gradients**: Beautiful gradient backgrounds and buttons
- **Smooth Animations**: Hover effects and micro-interactions
- **Modal Interfaces**: Clean modal popups for profile and memory creation
- **ChatGPT-style Interface**: Familiar chat experience with message bubbles
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Customization

### Adding Vector Databases
Replace the in-memory storage with proper vector databases:

- **Pinecone**: Cloud-native vector database
- **Chroma**: Open-source embedding database
- **Weaviate**: Open-source vector search engine

### Audio Transcription
Integrate OpenAI's Whisper API or other speech-to-text services for audio memory processing.

### Model Fine-tuning
For better personalization:
1. Collect conversation data over time
2. Fine-tune GPT models on specific personality patterns
3. Implement retrieval-augmented generation (RAG) improvements

## 📦 Production Deployment

### Backend Deployment
- Deploy to Vercel, Railway, or AWS
- Set up proper database (PostgreSQL + pgvector or MongoDB + Atlas Search)
- Configure environment variables
- Set up proper error handling and logging

### Frontend Deployment
- Build with `npm run build`
- Deploy to Netlify, Vercel, or similar
- Configure API endpoints for production

### Security Considerations
- Implement proper authentication
- Encrypt sensitive memory data
- Rate limiting for API endpoints
- CORS configuration for production domains

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🌟 Roadmap

- [ ] Audio file upload and transcription
- [ ] Multi-language support
- [ ] Memory import/export functionality
- [ ] Advanced search and filtering
- [ ] Conversation history persistence
- [ ] Mobile app version
- [ ] Voice chat capabilities
- [ ] Memory timeline visualization

---

Built with ❤️ for preserving and celebrating precious memories.