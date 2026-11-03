import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/trade
router.get('/', (req, res) => {
  const { category, search } = req.query;
  const store = getStore();
  let list = [...store.tradeProducts];

  if (category && category !== 'All') {
    list = list.filter(item => item.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.originZones.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }

  res.json({ count: list.length, data: list });
});

// GET /api/trade/:id
router.get('/:id', (req, res) => {
  const store = getStore();
  const product = store.tradeProducts.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Trade product not found.' });
  }
  res.json({ data: product });
});

// POST /api/trade (Protected)
router.post('/', requireAuth, (req, res) => {
  const { name, category, originZones, exportSpecs, description, seasonality, imageUrl } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Product name and category are required.' });
  }

  const store = getStore();
  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category,
    originZones: originZones || 'Regional Oromia',
    exportSpecs: exportSpecs || 'Standard Ethiopian Export Quality',
    description: description || name,
    seasonality: seasonality || 'Year-round',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  };

  store.tradeProducts.unshift(newProduct);
  saveStore();

  res.status(201).json({ message: 'Trade product registered successfully', data: newProduct });
});

// PUT /api/trade/:id (Protected)
router.put('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const product = store.tradeProducts.find(p => p.id === req.params.id);

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

  saveStore();
  res.json({ message: 'Trade product updated successfully', data: product });
});

// DELETE /api/trade/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.tradeProducts.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Trade product not found.' });
  }

  const removed = store.tradeProducts.splice(index, 1)[0];
  saveStore();
  res.json({ message: 'Trade product removed successfully', data: removed });
});

export default router;
