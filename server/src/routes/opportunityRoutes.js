import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/opportunities
router.get('/', (req, res) => {
  const { sector, location, search, status, includeDrafts } = req.query;
  const store = getStore();

  let list = [...store.opportunities];

  // Default: hide unpublished drafts unless explicitly requested by admin
  if (includeDrafts !== 'true') {
    list = list.filter(item => item.status === 'Published');
  } else if (status) {
    list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
  }

  if (sector && sector !== 'All') {
    list = list.filter(item => item.sector.toLowerCase().includes(sector.toLowerCase()));
  }

  if (location && location !== 'All') {
    list = list.filter(item => item.location.toLowerCase().includes(location.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  }

  res.json({ count: list.length, data: list });
});

// GET /api/opportunities/:id
router.get('/:id', (req, res) => {
  const store = getStore();
  const opp = store.opportunities.find(o => o.id === req.params.id);
  if (!opp) {
    return res.status(404).json({ error: 'Investment opportunity not found.' });
  }
  res.json({ data: opp });
});

// POST /api/opportunities (Protected)
router.post('/', requireAuth, (req, res) => {
  const {
    title,
    sector,
    location,
    investmentType,
    requiredCapital,
    landAvailable,
    status = 'Published',
    imageUrl,
    summary,
    description,
    incentives = [],
    contactPerson,
    featured = false
  } = req.body;

  if (!title || !sector || !location) {
    return res.status(400).json({ error: 'Title, sector, and location are required fields.' });
  }

  const store = getStore();
  const newOpp = {
    id: `opp-${Date.now()}`,
    title,
    sector,
    location,
    investmentType: investmentType || 'Direct Commercial / Joint Venture',
    requiredCapital: requiredCapital || 'Negotiable based on project scale',
    landAvailable: landAvailable || 'Available in designated zone',
    status,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80',
    summary: summary || title,
    description: description || summary || title,
    incentives: Array.isArray(incentives) ? incentives : [incentives],
    contactPerson: contactPerson || 'Oromia Investment Facilitation Desk',
    featured: Boolean(featured),
    createdAt: new Date().toISOString()
  };

  store.opportunities.unshift(newOpp);
  saveStore();

  res.status(201).json({ message: 'Opportunity created successfully', data: newOpp });
});

// PUT /api/opportunities/:id (Protected)
router.put('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.opportunities.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Investment opportunity not found.' });
  }

  const existing = store.opportunities[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id, // Immutable ID
    updatedAt: new Date().toISOString()
  };

  store.opportunities[index] = updated;
  saveStore();

  res.json({ message: 'Opportunity updated successfully', data: updated });
});

// DELETE /api/opportunities/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.opportunities.findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Investment opportunity not found.' });
  }

  const removed = store.opportunities.splice(index, 1)[0];
  saveStore();

  res.json({ message: 'Opportunity deleted successfully', data: removed });
});

export default router;
