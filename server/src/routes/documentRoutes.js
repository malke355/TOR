import express from 'express';
import { Document } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/documents
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { refNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const list = await Document.find(filter).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Documents] list error:', err.message);
    res.status(500).json({ error: 'Unable to load documents.' });
  }
});

// POST /api/documents (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, category, fileType = 'PDF', fileSize = '1.5 MB', refNumber, downloadUrl } = req.body;
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required.' });
    }

    const newDoc = await Document.create({
      id: `doc-${Date.now()}`,
      title,
      category,
      fileType,
      fileSize,
      refNumber: refNumber || `OTIB/DOC/${Date.now().toString().slice(-4)}`,
      publishedDate: new Date().toISOString().split('T')[0],
      downloadUrl: downloadUrl || '#'
    });

    res.status(201).json({ message: 'Document added to repository', data: newDoc.toJSON() });
  } catch (err) {
    console.error('[Documents] create error:', err.message);
    res.status(500).json({ error: 'Unable to add document.' });
  }
});

// PUT /api/documents/:id (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const doc = await Document.findOne({ id: req.params.id });
    if (!doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    const { title, category, fileType, fileSize, refNumber, downloadUrl } = req.body;

    if (title) doc.title = title;
    if (category) doc.category = category;
    if (fileType) doc.fileType = fileType;
    if (fileSize) doc.fileSize = fileSize;
    if (refNumber) doc.refNumber = refNumber;
    if (downloadUrl) doc.downloadUrl = downloadUrl;

    await doc.save();
    res.json({ message: 'Document updated successfully', data: doc.toJSON() });
  } catch (err) {
    console.error('[Documents] update error:', err.message);
    res.status(500).json({ error: 'Unable to update document.' });
  }
});

// DELETE /api/documents/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Document.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Document not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'Document removed successfully', data });
  } catch (err) {
    console.error('[Documents] delete error:', err.message);
    res.status(500).json({ error: 'Unable to remove document.' });
  }
});

export default router;
