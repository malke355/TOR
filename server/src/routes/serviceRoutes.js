import express from 'express';
import { Service } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    const list = await Service.find(filter).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Services] list error:', err.message);
    res.status(500).json({ error: 'Unable to load services.' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id }).lean();
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    const { _id, ...data } = service;
    res.json({ data });
  } catch (err) {
    console.error('[Services] get error:', err.message);
    res.status(500).json({ error: 'Unable to load service.' });
  }
});

// POST /api/services (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
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

    const newService = await Service.create({
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
    });

    res.status(201).json({ message: 'Service added successfully', data: newService.toJSON() });
  } catch (err) {
    console.error('[Services] create error:', err.message);
    res.status(500).json({ error: 'Unable to create service.' });
  }
});

// PUT /api/services/:id (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const service = await Service.findOne({ id: req.params.id });
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

    await service.save();
    res.json({ message: 'Service updated successfully', data: service.toJSON() });
  } catch (err) {
    console.error('[Services] update error:', err.message);
    res.status(500).json({ error: 'Unable to update service.' });
  }
});

// DELETE /api/services/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Service.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'Service removed successfully', data });
  } catch (err) {
    console.error('[Services] delete error:', err.message);
    res.status(500).json({ error: 'Unable to remove service.' });
  }
});

export default router;
