import express from 'express';
import fs from 'fs';
import path from 'path';
import { Application } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';
import {
  applicationUpload,
  APPLICATIONS_DIR,
  formatFileSize
} from '../config/uploads.js';

const router = express.Router();

const isStrictTextOnly = (val) => {
  if (!val || typeof val !== 'string') return true;
  if (/\d/.test(val)) return false;
  const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(val)) return false;
  if (/[#$%\^&*+=<>~`|\\{}\[\]_@]/g.test(val)) return false;
  return true;
};

function parseMaybeJson(value, fallback = {}) {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function cleanupFiles(files = []) {
  for (const file of files) {
    if (file?.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {
        /* ignore */
      }
    }
  }
}

function validateApplicationPayload({
  serviceId,
  applicantName,
  applicantEmail,
  applicantPhone,
  companyName,
  formData
}) {
  if (!serviceId || !applicantName || !applicantEmail) {
    return 'Service ID, applicant name, and email are required.';
  }

  if (!isStrictTextOnly(applicantName)) {
    return 'Full Legal Name must contain text only, no numbers, symbols, or icons are allowed.';
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(String(applicantEmail).trim())) {
    return 'Email address must be a valid @gmail.com address.';
  }

  if (applicantPhone && !/^\+2519\d{8}$/.test(String(applicantPhone).trim())) {
    return 'Phone number must start with +2519 followed by exactly 8 digits.';
  }

  if (formData?.address && !isStrictTextOnly(formData.address)) {
    return 'Current Residential Address must contain text only, no numbers, symbols, or icons are allowed.';
  }

  if (companyName && !isStrictTextOnly(companyName)) {
    return 'Company / Organization Name must contain text only, no numbers, symbols, or icons are allowed.';
  }
  if (formData?.companyName && !isStrictTextOnly(formData.companyName)) {
    return 'Company / Organization Name must contain text only, no numbers, symbols, or icons are allowed.';
  }

  if (formData?.tinNumber && String(formData.tinNumber).trim()) {
    if (!/^\d{10}$/.test(String(formData.tinNumber).trim())) {
      return `Tax Identification Number (TIN) must be exactly 10 digits (${String(formData.tinNumber).trim().length}/10 provided).`;
    }
  }

  if (formData?.projectTitle && !isStrictTextOnly(formData.projectTitle)) {
    return 'Project Title must contain text only, no numbers, symbols, or icons are allowed.';
  }

  if (formData?.estimatedCapital) {
    const rawDigits = String(formData.estimatedCapital).replace(/\D/g, '');
    const num = Number(rawDigits);
    if (!rawDigits || isNaN(num) || num < 100000) {
      return 'Estimated Investment Capital must be a number of at least 100,000 ETB.';
    }
  }

  if (formData?.employmentProjection) {
    const rawDigits = String(formData.employmentProjection).replace(/\D/g, '');
    const num = Number(rawDigits);
    if (!rawDigits || isNaN(num) || num <= 0) {
      return 'Projected Employment must be a valid positive number.';
    }
  }

  if (formData?.projectDescription && !isStrictTextOnly(formData.projectDescription)) {
    return 'Detailed Project Description must contain text only, no numbers, symbols, or icons are allowed.';
  }

  if (formData?.additionalNotes && !isStrictTextOnly(formData.additionalNotes)) {
    return 'Additional Notes or Special Requests must contain text only, no numbers, symbols, or icons are allowed.';
  }

  if (formData?.landRequirement && String(formData.landRequirement).trim()) {
    if (!/^\d+$/.test(String(formData.landRequirement).trim())) {
      return 'Land Requirement must contain numbers only.';
    }
  }

  if (formData?.passportId) {
    const passportVal = String(formData.passportId).trim().toUpperCase();
    if (passportVal.startsWith('FIN')) {
      const digits = passportVal.slice(3);
      if (digits.length !== 12 || !/^\d{12}$/.test(digits)) {
        return `National ID must start with FIN followed by exactly 12 digits (${digits.length}/12 provided).`;
      }
    } else if (passportVal.startsWith('A')) {
      const digits = passportVal.slice(1);
      if (digits.length !== 8 || !/^\d{8}$/.test(digits)) {
        return `US Passport must start with A followed by exactly 8 digits (${digits.length}/8 provided).`;
      }
    } else {
      return 'Passport / National ID Number must start with FIN (followed by 12 digits) or A (followed by 8 digits).';
    }
  }

  return null;
}

// POST /api/applications — accepts JSON or multipart with real files
router.post('/', (req, res) => {
  applicationUpload.any()(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'File upload failed.' });
    }

    const files = req.files || [];

    try {
      const serviceId = req.body.serviceId;
      const serviceTitle = req.body.serviceTitle;
      const applicantName = req.body.applicantName;
      const applicantEmail = req.body.applicantEmail;
      const applicantPhone = req.body.applicantPhone;
      const companyName = req.body.companyName;
      const formData = parseMaybeJson(req.body.formData, {});

      const validationError = validateApplicationPayload({
        serviceId,
        applicantName,
        applicantEmail,
        applicantPhone,
        companyName,
        formData
      });

      if (validationError) {
        cleanupFiles(files);
        return res.status(400).json({ error: validationError });
      }

      const uploadedDocuments = files.map((file) => ({
        fieldName: file.fieldname,
        fileName: file.originalname,
        storedFileName: file.filename,
        mimeType: file.mimetype,
        fileSize: formatFileSize(file.size),
        label: req.body[`label_${file.fieldname}`] || file.fieldname,
        downloadUrl: `/api/applications/files/${file.filename}`
      }));

      // Also accept metadata-only docs from JSON clients (no binary)
      const metaDocs = parseMaybeJson(req.body.uploadedDocuments, []);
      if (Array.isArray(metaDocs) && metaDocs.length && uploadedDocuments.length === 0) {
        // Legacy JSON submissions without files — keep metadata but mark unavailable
        for (const meta of metaDocs) {
          uploadedDocuments.push({
            fieldName: meta.fieldName || 'attachment',
            fileName: meta.fileName || 'uploaded',
            label: meta.label || meta.fieldName || 'Attachment',
            storedFileName: '',
            downloadUrl: null
          });
        }
      }

      const appCount = await Application.countDocuments();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const seq = String(appCount + 1).padStart(4, '0');
      const referenceNumber = `OTIB-${String(serviceId).toUpperCase()}-${dateStr}-${seq}`;

      const newApplication = await Application.create({
        id: `app-${Date.now()}`,
        referenceNumber,
        serviceId,
        serviceTitle: serviceTitle || 'Service Application',
        applicantName,
        applicantEmail,
        applicantPhone: applicantPhone || '',
        companyName: companyName || '',
        formData,
        uploadedDocuments,
        status: 'Pending Review',
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        reviewNotes: ''
      });

      res.status(201).json({
        message: `Application submitted successfully. Reference: ${referenceNumber}`,
        referenceNumber,
        id: newApplication.id
      });
    } catch (createErr) {
      console.error('[Applications] create error:', createErr.message);
      cleanupFiles(files);
      res.status(500).json({ error: 'Unable to submit application.' });
    }
  });
});

// GET /api/applications/files/:storedName — staff download of uploaded evidence
router.get('/files/:storedName', requireAuth, (req, res) => {
  const storedName = path.basename(req.params.storedName);
  const filePath = path.join(APPLICATIONS_DIR, storedName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Uploaded file not found.' });
  }

  res.download(filePath);
});

// GET /api/applications (Protected - Admin view)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { serviceId, status } = req.query;
    const filter = {};

    if (serviceId) filter.serviceId = serviceId;
    if (status) filter.status = new RegExp(`^${status}$`, 'i');

    const list = await Application.find(filter).sort({ submittedAt: -1 }).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Applications] list error:', err.message);
    res.status(500).json({ error: 'Unable to load applications.' });
  }
});

// GET /api/applications/:id (Protected)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const app = await Application.findOne({ id: req.params.id }).lean();
    if (!app) {
      return res.status(404).json({ error: 'Application not found.' });
    }
    const { _id, ...data } = app;
    res.json({ data });
  } catch (err) {
    console.error('[Applications] get error:', err.message);
    res.status(500).json({ error: 'Unable to load application.' });
  }
});

// PATCH /api/applications/:id/status (Protected)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const app = await Application.findOne({ id: req.params.id });
    if (!app) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    app.status = status || 'Under Review';
    app.reviewNotes = reviewNotes || app.reviewNotes;
    app.reviewedAt = new Date().toISOString();
    await app.save();

    res.json({ message: 'Application status updated', data: app.toJSON() });
  } catch (err) {
    console.error('[Applications] status error:', err.message);
    res.status(500).json({ error: 'Unable to update application status.' });
  }
});

// DELETE /api/applications/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Application.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    for (const doc of removed.uploadedDocuments || []) {
      if (doc.storedFileName) {
        const filePath = path.join(APPLICATIONS_DIR, doc.storedFileName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }

    const { _id, ...data } = removed;
    res.json({ message: 'Application deleted successfully', data });
  } catch (err) {
    console.error('[Applications] delete error:', err.message);
    res.status(500).json({ error: 'Unable to delete application.' });
  }
});

export default router;
