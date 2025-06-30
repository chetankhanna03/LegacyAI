import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import profileRoutes from './routes/profiles.js';
import { initializeDatabase, database } from './database/init.js'; // Added database import

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Initialize database
console.log('🚀 Starting Legacy.AI API server...');
initializeDatabase();

// API Routes
app.use('/api/profiles', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Legacy.AI API is running',
    timestamp: new Date().toISOString(),
    profiles: database.profiles ? database.profiles.length : 0
  });
});

// Serve frontend static files
app.use(express.static(join(__dirname, 'dist')));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
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
