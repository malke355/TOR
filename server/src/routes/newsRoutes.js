import express from 'express';
import { News } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { category, search, includeDrafts } = req.query;
    const filter = {};

    if (includeDrafts !== 'true') {
      filter.status = 'Published';
    }

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const list = await News.find(filter).sort({ publishedAt: -1 }).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[News] list error:', err.message);
    res.status(500).json({ error: 'Unable to load news.' });
  }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await News.findOne({ id: req.params.id }).lean();
    if (!item) {
      return res.status(404).json({ error: 'News article not found.' });
    }
    const { _id, ...data } = item;
    res.json({ data });
  } catch (err) {
    console.error('[News] get error:', err.message);
    res.status(500).json({ error: 'Unable to load news article.' });
  }
});

// POST /api/news (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, category = 'General', summary, content, imageUrl, status = 'Published' } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required.' });
    }

    const newItem = await News.create({
      id: `news-${Date.now()}`,
      title,
      category,
      summary: summary || title,
      content,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date().toISOString().split('T')[0],
      status,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'News article published successfully', data: newItem.toJSON() });
  } catch (err) {
    console.error('[News] create error:', err.message);
    res.status(500).json({ error: 'Unable to publish news.' });
  }
});

// PUT /api/news/:id (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await News.findOne({ id: req.params.id });
    if (!existing) {
      return res.status(404).json({ error: 'News article not found.' });
    }

    const { id: _ignore, ...updates } = req.body;
    Object.assign(existing, updates, { updatedAt: new Date().toISOString() });
    await existing.save();

    res.json({ message: 'News article updated successfully', data: existing.toJSON() });
  } catch (err) {
    console.error('[News] update error:', err.message);
    res.status(500).json({ error: 'Unable to update news.' });
  }
});

// DELETE /api/news/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await News.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'News article not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'News article deleted successfully', data });
  } catch (err) {
    console.error('[News] delete error:', err.message);
    res.status(500).json({ error: 'Unable to delete news.' });
  }
});

export default router;
