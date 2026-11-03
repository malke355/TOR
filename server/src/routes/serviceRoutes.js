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

// PUT /api/services/:id (Protected)
router.put('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const service = store.services.find(s => s.id === req.params.id);

  if (!service) {
    return res.status(404).json({ error: 'Service not found.' });
  }

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

  if (title) service.title = title;
  if (category) service.category = category;
  if (description) service.description = description;
  if (eligibility) service.eligibility = eligibility;
  if (requirements) service.requirements = requirements;
  if (procedure) service.procedure = procedure;
  if (processingTime) service.processingTime = processingTime;
  if (fees) service.fees = fees;
  if (responsibleOffice) service.responsibleOffice = responsibleOffice;
  if (isOnline !== undefined) service.isOnline = Boolean(isOnline);
  if (portalUrl !== undefined) service.portalUrl = portalUrl;

  saveStore();
  res.json({ message: 'Service updated successfully', data: service });
});

// DELETE /api/services/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.services.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Service not found.' });
  }

  const removed = store.services.splice(index, 1)[0];
  saveStore();
  res.json({ message: 'Service removed successfully', data: removed });
});

export default router;
