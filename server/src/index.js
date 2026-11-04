import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { seedIfEmpty } from './config/seed.js';
import { ensureUploadDirs } from './config/uploads.js';

import authRoutes from './routes/authRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

ensureUploadDirs();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/applications', applicationRoutes);

// Health check & Institutional Registry
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    bureau: 'Oromia Trade and Investment Bureau',
    region: 'National Regional State of Oromia, Ethiopia',
    version: '1.0.0-mvp',
    currency: 'ETB',
    database: 'mongodb',
    timestamp: new Date().toISOString()
  });
});

// Interactive API Directory / Catalog
app.get(['/api', '/api/docs'], (req, res) => {
  res.json({
    institution: 'Oromia Trade and Investment Bureau (OTIB)',
    officialPortal: 'https://investoromia.gov.et',
    documentationVersion: '1.0',
    database: 'MongoDB Atlas',
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Staff authentication and JWT token issuance',
        'GET /api/auth/me': 'Current user profile verification (Bearer token required)'
      },
      opportunities: {
        'GET /api/opportunities': 'Query priority investment projects (filter by sector, location, search)',
        'GET /api/opportunities/:id': 'Fetch specific project profile and feasibility parameters',
        'POST /api/opportunities': 'Register new project (Admin/Editor role)',
        'PUT /api/opportunities/:id': 'Update existing project specifications (Protected)',
        'DELETE /api/opportunities/:id': 'Archive or delete project (Protected)'
      },
      trade: {
        'GET /api/trade': 'Browse regional export commodities catalog (coffee, sesame, honey, minerals)',
        'GET /api/trade/:id': 'Detailed export specs and harvest calendars',
        'POST /api/trade': 'Register new export commodity (Protected)',
        'PUT /api/trade/:id': 'Update commodity profile (Protected)',
        'DELETE /api/trade/:id': 'Remove commodity (Protected)'
      },
      services: {
        'GET /api/services': 'Citizen and investor service charters and turnaround timelines',
        'GET /api/services/:id': 'Individual service requirements and procedures',
        'POST /api/services': 'Register institutional public service (Protected)',
        'PUT /api/services/:id': 'Update service charter (Protected)',
        'DELETE /api/services/:id': 'Remove service (Protected)'
      },
      news: {
        'GET /api/news': 'Official press releases, pacts, and regional updates',
        'GET /api/news/:id': 'Read full news release',
        'POST /api/news': 'Publish new release (Protected)',
        'PUT /api/news/:id': 'Update article (Protected)',
        'DELETE /api/news/:id': 'Remove article (Protected)'
      },
      documents: {
        'GET /api/documents': 'Downloadable legal directives, proclamations, and forms',
        'POST /api/documents': 'Upload document metadata (Protected)',
        'PUT /api/documents/:id': 'Update document metadata (Protected)',
        'DELETE /api/documents/:id': 'Remove document (Protected)'
      },
      messages: {
        'POST /api/messages': 'Public citizen/investor inquiry submission',
        'GET /api/messages': 'Review submitted messages (Protected - Staff CMS)',
        'PATCH /api/messages/:id/status': 'Update inquiry workflow status (Protected)',
        'DELETE /api/messages/:id': 'Remove message record (Protected)'
      },
      stats: {
        'GET /api/stats': 'Real-time KPIs, active projects count, and regional metrics',
        'GET /api/stats/backup': 'Export complete Bureau database snapshot (Protected)'
      },
      applications: {
        'POST /api/applications': 'Submit service application (Investment Permit, Duty-Free, Trade License)',
        'GET /api/applications': 'View all submitted applications (Protected - Staff CMS)',
        'GET /api/applications/:id': 'View single application details (Protected)',
        'PATCH /api/applications/:id/status': 'Update application review status (Protected)',
        'DELETE /api/applications/:id': 'Remove application record (Protected)'
      }
    }
  });
});

// 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({ error: 'Internal institutional server error' });
});

async function start() {
  try {
    await connectDB();
    await seedIfEmpty();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`===================================================`);
      console.log(`🏛️ Oromia Trade & Investment Bureau API Server`);
      console.log(`   Running on http://0.0.0.0:${PORT}`);
      console.log(`   Database: MongoDB Atlas`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===================================================`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();
