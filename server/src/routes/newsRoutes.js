import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/news
router.get('/', (req, res) => {
  const { category, search, includeDrafts } = req.query;
  const store = getStore();

  let list = [...store.news];

  if (includeDrafts !== 'true') {
    list = list.filter(item => item.status === 'Published');
  }

  if (category && category !== 'All') {
    list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.content.toLowerCase().includes(q)
    );
  }

  res.json({ count: list.length, data: list });
});

// GET /api/news/:id
router.get('/:id', (req, res) => {
  const store = getStore();
  const item = store.news.find(n => n.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'News article not found.' });
  }
  res.json({ data: item });
});

// POST /api/news (Protected)
router.post('/', requireAuth, (req, res) => {
  const { title, category = 'General', summary, content, imageUrl, status = 'Published' } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const store = getStore();
  const newItem = {
    id: `news-${Date.now()}`,
    title,
    category,
    summary: summary || title,
    content,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    publishedAt: new Date().toISOString().split('T')[0],
    status,
    createdAt: new Date().toISOString()
  };

  store.news.unshift(newItem);
  saveStore();

  res.status(201).json({ message: 'News article published successfully', data: newItem });
});

// PUT /api/news/:id (Protected)
router.put('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.news.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'News article not found.' });
  }

  const existing = store.news[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  store.news[index] = updated;
  saveStore();

  res.json({ message: 'News article updated successfully', data: updated });
});

// DELETE /api/news/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.news.findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'News article not found.' });
  }

  const removed = store.news.splice(index, 1)[0];
  saveStore();

  res.json({ message: 'News article deleted successfully', data: removed });
});

export default router;
