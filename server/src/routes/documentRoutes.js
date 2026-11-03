import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/documents
router.get('/', (req, res) => {
  const { category, search } = req.query;
  const store = getStore();
  let list = [...store.documents];

  if (category && category !== 'All') {
    list = list.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.refNumber.toLowerCase().includes(q)
    );
  }

  res.json({ count: list.length, data: list });
});

// POST /api/documents (Protected)
router.post('/', requireAuth, (req, res) => {
  const { title, category, fileType = 'PDF', fileSize = '1.5 MB', refNumber, downloadUrl } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required.' });
  }

  const store = getStore();
  const newDoc = {
    id: `doc-${Date.now()}`,
    title,
    category,
    fileType,
    fileSize,
    refNumber: refNumber || `OTIB/DOC/${Date.now().toString().slice(-4)}`,
    publishedDate: new Date().toISOString().split('T')[0],
    downloadUrl: downloadUrl || '#'
  };

  store.documents.unshift(newDoc);
  saveStore();

  res.status(201).json({ message: 'Document added to repository', data: newDoc });
});

// PUT /api/documents/:id (Protected)
router.put('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const doc = store.documents.find(d => d.id === req.params.id);

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

  saveStore();
  res.json({ message: 'Document updated successfully', data: doc });
});

// DELETE /api/documents/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.documents.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  const removed = store.documents.splice(index, 1)[0];
  saveStore();

  res.json({ message: 'Document removed successfully', data: removed });
});

export default router;
