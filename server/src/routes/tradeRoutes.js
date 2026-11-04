import express from 'express';
import { TradeProduct } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/trade
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { originZones: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const list = await TradeProduct.find(filter).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Trade] list error:', err.message);
    res.status(500).json({ error: 'Unable to load trade products.' });
  }
});

// GET /api/trade/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await TradeProduct.findOne({ id: req.params.id }).lean();
    if (!product) {
      return res.status(404).json({ error: 'Trade product not found.' });
    }
    const { _id, ...data } = product;
    res.json({ data });
  } catch (err) {
    console.error('[Trade] get error:', err.message);
    res.status(500).json({ error: 'Unable to load trade product.' });
  }
});

// POST /api/trade (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, category, originZones, exportSpecs, description, seasonality, imageUrl } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Product name and category are required.' });
    }

    const newProduct = await TradeProduct.create({
      id: `prod-${Date.now()}`,
      name,
      category,
      originZones: originZones || 'Regional Oromia',
      exportSpecs: exportSpecs || 'Standard Ethiopian Export Quality',
      description: description || name,
      seasonality: seasonality || 'Year-round',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    });

    res.status(201).json({ message: 'Trade product registered successfully', data: newProduct.toJSON() });
  } catch (err) {
    console.error('[Trade] create error:', err.message);
    res.status(500).json({ error: 'Unable to register trade product.' });
  }
});

// PUT /api/trade/:id (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const product = await TradeProduct.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ error: 'Trade product not found.' });
    }

    const { name, category, originZones, exportSpecs, description, seasonality, imageUrl } = req.body;

    if (name) product.name = name;
    if (category) product.category = category;
    if (originZones) product.originZones = originZones;
    if (exportSpecs) product.exportSpecs = exportSpecs;
    if (description) product.description = description;
    if (seasonality) product.seasonality = seasonality;
    if (imageUrl) product.imageUrl = imageUrl;

    await product.save();
    res.json({ message: 'Trade product updated successfully', data: product.toJSON() });
  } catch (err) {
    console.error('[Trade] update error:', err.message);
    res.status(500).json({ error: 'Unable to update trade product.' });
  }
});

// DELETE /api/trade/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await TradeProduct.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Trade product not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'Trade product removed successfully', data });
  } catch (err) {
    console.error('[Trade] delete error:', err.message);
    res.status(500).json({ error: 'Unable to remove trade product.' });
  }
});

export default router;
