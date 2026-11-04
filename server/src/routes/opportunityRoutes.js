import express from 'express';
import { Opportunity } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/opportunities
router.get('/', async (req, res) => {
  try {
    const { sector, location, search, status, includeDrafts } = req.query;
    const filter = {};

    if (includeDrafts !== 'true') {
      filter.status = 'Published';
    } else if (status) {
      filter.status = new RegExp(`^${status}$`, 'i');
    }

    if (sector && sector !== 'All') {
      filter.sector = { $regex: sector, $options: 'i' };
    }

    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const list = await Opportunity.find(filter).sort({ createdAt: -1 }).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Opportunities] list error:', err.message);
    res.status(500).json({ error: 'Unable to load opportunities.' });
  }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
  try {
    const opp = await Opportunity.findOne({ id: req.params.id }).lean();
    if (!opp) {
      return res.status(404).json({ error: 'Investment opportunity not found.' });
    }
    const { _id, ...data } = opp;
    res.json({ data });
  } catch (err) {
    console.error('[Opportunities] get error:', err.message);
    res.status(500).json({ error: 'Unable to load opportunity.' });
  }
});

// POST /api/opportunities (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
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

    const newOpp = await Opportunity.create({
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
    });

    res.status(201).json({ message: 'Opportunity created successfully', data: newOpp.toJSON() });
  } catch (err) {
    console.error('[Opportunities] create error:', err.message);
    res.status(500).json({ error: 'Unable to create opportunity.' });
  }
});

// PUT /api/opportunities/:id (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await Opportunity.findOne({ id: req.params.id });
    if (!existing) {
      return res.status(404).json({ error: 'Investment opportunity not found.' });
    }

    const { id: _ignore, ...updates } = req.body;
    Object.assign(existing, updates, { updatedAt: new Date().toISOString() });
    await existing.save();

    res.json({ message: 'Opportunity updated successfully', data: existing.toJSON() });
  } catch (err) {
    console.error('[Opportunities] update error:', err.message);
    res.status(500).json({ error: 'Unable to update opportunity.' });
  }
});

// DELETE /api/opportunities/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Opportunity.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Investment opportunity not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'Opportunity deleted successfully', data });
  } catch (err) {
    console.error('[Opportunities] delete error:', err.message);
    res.status(500).json({ error: 'Unable to delete opportunity.' });
  }
});

export default router;
