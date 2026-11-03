import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services
router.get('/', (req, res) => {
  const { category } = req.query;
  const store = getStore();
  let list = [...store.services];

  if (category && category !== 'All') {
    list = list.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  res.json({ count: list.length, data: list });
});

// GET /api/services/:id
router.get('/:id', (req, res) => {
  const store = getStore();
  const service = store.services.find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found.' });
  }
  res.json({ data: service });
});

// POST /api/services (Protected)
router.post('/', requireAuth, (req, res) => {
  const {
    title,
    category,
    description,
    eligibility,
    requirements,
    procedure,
    processingTime,
    fees,
    responsibleOffice,
    isOnline,
    portalUrl
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required.' });
  }

  const store = getStore();
  const newService = {
    id: `srv-${Date.now()}`,
    title,
    category: category || 'General Public Service',
    description,
    eligibility: eligibility || 'Eligible citizens and enterprises',
    requirements: requirements || 'Valid identification and relevant documentation',
    procedure: procedure || 'Submit application to designated service desk',
    processingTime: processingTime || '3 - 5 Working Days',
    fees: fees || 'Standard administrative fee',
    responsibleOffice: responsibleOffice || 'Directorate of Public Services',
    isOnline: Boolean(isOnline),
    portalUrl: portalUrl || ''
  };

  store.services.push(newService);
  saveStore();

  res.status(201).json({ message: 'Service added successfully', data: newService });
});

export default router;
