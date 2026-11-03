import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initStore } from './config/store.js';

import authRoutes from './routes/authRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize data persistence store
initStore();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    bureau: 'Oromia Trade and Investment Bureau',
    version: '1.0.0-mvp',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal institutional server error' });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🏛️ Oromia Trade & Investment Bureau API Server`);
  console.log(`   Running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===================================================`);
});
