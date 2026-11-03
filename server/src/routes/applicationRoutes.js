import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/applications (Public - Submit service application)
router.post('/', (req, res) => {
  const {
    serviceId,
    serviceTitle,
    applicantName,
    applicantEmail,
    applicantPhone,
    companyName,
    formData,
    uploadedDocuments
  } = req.body;

  // Required field validation
  if (!serviceId || !applicantName || !applicantEmail) {
    return res.status(400).json({
      error: 'Service ID, applicant name, and email are required.'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(applicantEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // Phone validation (if provided)
  if (applicantPhone && !/^\+2519\d{8}$/.test(applicantPhone.trim())) {
    return res.status(400).json({
      error: 'Phone number must start with +2519 followed by exactly 8 digits.'
    });
  }

  const store = getStore();

  // Initialize applications array if not present
  if (!store.applications) {
    store.applications = [];
  }

  // Generate a reference number
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(store.applications.length + 1).padStart(4, '0');
  const referenceNumber = `OTIB-${serviceId.toUpperCase()}-${dateStr}-${seq}`;

  const newApplication = {
    id: `app-${Date.now()}`,
    referenceNumber,
    serviceId,
    serviceTitle: serviceTitle || 'Service Application',
    applicantName,
    applicantEmail,
    applicantPhone: applicantPhone || '',
    companyName: companyName || '',
    formData: formData || {},
    uploadedDocuments: uploadedDocuments || [],
    status: 'Pending Review',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewNotes: ''
  };

  store.applications.unshift(newApplication);
  saveStore();

  res.status(201).json({
    message: `Application submitted successfully. Reference: ${referenceNumber}`,
    referenceNumber,
    id: newApplication.id
  });
});

// GET /api/applications (Protected - Admin view)
router.get('/', requireAuth, (req, res) => {
  const store = getStore();
  const applications = store.applications || [];

  // Optional filtering by serviceId or status
  const { serviceId, status } = req.query;
  let filtered = [...applications];

  if (serviceId) {
    filtered = filtered.filter(a => a.serviceId === serviceId);
  }
  if (status) {
    filtered = filtered.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  res.json({ count: filtered.length, data: filtered });
});

// GET /api/applications/:id (Protected - Admin view single application)
router.get('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const applications = store.applications || [];
  const app = applications.find(a => a.id === req.params.id);

  if (!app) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  res.json({ data: app });
});

// PATCH /api/applications/:id/status (Protected - Update application status)
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status, reviewNotes } = req.body;
  const store = getStore();

  if (!store.applications) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const app = store.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  app.status = status || 'Under Review';
  app.reviewNotes = reviewNotes || app.reviewNotes;
  app.reviewedAt = new Date().toISOString();
  saveStore();

  res.json({ message: 'Application status updated', data: app });
});

// DELETE /api/applications/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  if (!store.applications) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const index = store.applications.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const removed = store.applications.splice(index, 1)[0];
  saveStore();

  res.json({ message: 'Application deleted successfully', data: removed });
});

export default router;
