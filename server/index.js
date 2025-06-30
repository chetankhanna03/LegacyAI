import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import profileRoutes from './routes/profiles.js';
import { initializeDatabase, database } from './database/init.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..'); // For accessing project root

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Init DB
console.log('🚀 Starting Legacy.AI API server...');
initializeDatabase();

// API routes
app.use('/api/profiles', profileRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Legacy.AI API is running',
    timestamp: new Date().toISOString(),
    profiles: database.profiles ? database.profiles.length : 0
  });
});

// ✅ Serve frontend from dist
// Serve static files first
app.use(express.static(join(root, 'dist')));

// Only fallback to index.html for non-static routes
app.get('*', (req, res, next) => {
  const url = req.originalUrl;
  if (url.startsWith('/api/') || url.includes('.')) {
    return next(); // Let API routes or static files pass through
  }

  res.sendFile(join(root, 'dist', 'index.html'));
});


// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    details: err.message,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Legacy.AI API server running on port ${PORT}`);
});
