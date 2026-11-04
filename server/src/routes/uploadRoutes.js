import express from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { isCloudinaryConfigured, uploadImageBuffer } from '../config/cloudinary.js';

const router = express.Router();

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed.'));
  }
});

// GET /api/uploads/status
router.get('/status', requireAuth, (_req, res) => {
  res.json({
    cloudinary: isCloudinaryConfigured(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || null
  });
});

// POST /api/uploads/image — staff upload to Cloudinary
router.post('/image', requireAuth, (req, res) => {
  memoryUpload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file.' });
    }

    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary is not configured on the server.'
      });
    }

    try {
      const folder = req.body.folder || 'otib';
      const result = await uploadImageBuffer(req.file.buffer, {
        folder,
        public_id: undefined
      });

      res.status(201).json({
        message: 'Image uploaded to Cloudinary',
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      });
    } catch (uploadErr) {
      console.error('[Upload] Cloudinary error:', uploadErr.message);
      res.status(500).json({ error: 'Cloudinary upload failed.' });
    }
  });
});

export default router;
