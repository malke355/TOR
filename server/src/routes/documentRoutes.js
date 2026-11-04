import express from 'express';
import fs from 'fs';
import path from 'path';
import { Document } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import {
  documentUpload,
  DOCUMENTS_DIR,
  formatFileSize,
  fileTypeFromName,
  writeSimplePdf
} from '../config/uploads.js';

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

    const list = await Document.find(filter).sort({ publishedDate: -1 }).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Documents] list error:', err.message);
    res.status(500).json({ error: 'Unable to load documents.' });
  }
});

// GET /api/documents/:id/download — stream the stored file
router.get('/:id/download', async (req, res) => {
  try {
    const doc = await Document.findOne({ id: req.params.id });
    if (!doc || !doc.storedFileName) {
      return res.status(404).json({ error: 'Document file not found.' });
    }

    const filePath = path.join(DOCUMENTS_DIR, doc.storedFileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document file missing on server.' });
    }

    const downloadName = doc.originalFileName || `${doc.title.replace(/[^\w.-]+/g, '_')}.${(doc.fileType || 'pdf').toLowerCase()}`;
    res.download(filePath, downloadName);
  } catch (err) {
    console.error('[Documents] download error:', err.message);
    res.status(500).json({ error: 'Unable to download document.' });
  }
});

// POST /api/documents (Protected) — multipart with optional file
router.post('/', requireAuth, (req, res) => {
  documentUpload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }

    try {
      const { title, category, refNumber } = req.body;
      if (!title || !category) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Title and category are required.' });
      }

      const id = `doc-${Date.now()}`;
      let storedFileName = '';
      let originalFileName = '';
      let mimeType = 'application/pdf';
      let fileType = 'PDF';
      let fileSize = '0 B';
      let downloadUrl = '#';

      if (req.file) {
        storedFileName = req.file.filename;
        originalFileName = req.file.originalname;
        mimeType = req.file.mimetype;
        fileType = fileTypeFromName(req.file.originalname);
        fileSize = formatFileSize(req.file.size);
        downloadUrl = `/api/documents/${id}/download`;
      } else {
        // Create a real PDF placeholder if staff did not attach a file
        storedFileName = `${id}.pdf`;
        originalFileName = `${title.replace(/[^\w.-]+/g, '_')}.pdf`;
        const filePath = path.join(DOCUMENTS_DIR, storedFileName);
        const bytes = writeSimplePdf(filePath, title);
        fileSize = formatFileSize(bytes);
        downloadUrl = `/api/documents/${id}/download`;
      }

      const newDoc = await Document.create({
        id,
        title,
        category,
        fileType,
        fileSize,
        refNumber: refNumber || `OTIB/DOC/${Date.now().toString().slice(-4)}`,
        publishedDate: new Date().toISOString().split('T')[0],
        downloadUrl,
        originalFileName,
        storedFileName,
        mimeType
      });

      res.status(201).json({ message: 'Document added to repository', data: newDoc.toJSON() });
    } catch (createErr) {
      console.error('[Documents] create error:', createErr.message);
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Unable to add document.' });
    }
  });
});

// PUT /api/documents/:id (Protected) — can replace file
router.put('/:id', requireAuth, (req, res) => {
  documentUpload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }

    try {
      const doc = await Document.findOne({ id: req.params.id });
      if (!doc) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Document not found.' });
      }

      const { title, category, refNumber } = req.body;
      if (title) doc.title = title;
      if (category) doc.category = category;
      if (refNumber) doc.refNumber = refNumber;

      if (req.file) {
        if (doc.storedFileName) {
          const oldPath = path.join(DOCUMENTS_DIR, doc.storedFileName);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        doc.storedFileName = req.file.filename;
        doc.originalFileName = req.file.originalname;
        doc.mimeType = req.file.mimetype;
        doc.fileType = fileTypeFromName(req.file.originalname);
        doc.fileSize = formatFileSize(req.file.size);
        doc.downloadUrl = `/api/documents/${doc.id}/download`;
      }

      await doc.save();
      res.json({ message: 'Document updated successfully', data: doc.toJSON() });
    } catch (updateErr) {
      console.error('[Documents] update error:', updateErr.message);
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      res.status(500).json({ error: 'Unable to update document.' });
    }
  });
});

// DELETE /api/documents/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Document.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    if (removed.storedFileName) {
      const filePath = path.join(DOCUMENTS_DIR, removed.storedFileName);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    const { _id, ...data } = removed;
    res.json({ message: 'Document removed successfully', data });
  } catch (err) {
    console.error('[Documents] delete error:', err.message);
    res.status(500).json({ error: 'Unable to remove document.' });
  }
});

export default router;
