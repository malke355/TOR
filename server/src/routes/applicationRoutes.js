import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Strict text-only validator: only allows letters, spaces, and standard punctuation (. , - ' " : ; / ? !)
// Numbers (0-9), emojis, icons, and math/tech symbols are strictly disallowed
const isStrictTextOnly = (val) => {
  if (!val || typeof val !== 'string') return true;
  if (/\d/.test(val)) return false;
  const emojiRegex = /[\p{Extended_Pictographic}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiRegex.test(val)) return false;
  if (/[#$%\^&*+=<>~`|\\{}\[\]_@]/g.test(val)) return false;
  return true;
};

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

  // Full Legal Name validation (text only, no numbers/icons/symbols)
  if (!isStrictTextOnly(applicantName)) {
    return res.status(400).json({
      error: 'Full Legal Name must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Email validation: MUST end with @gmail.com
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(applicantEmail.trim())) {
    return res.status(400).json({
      error: 'Email address must be a valid @gmail.com address.'
    });
  }

  // Phone validation (if provided): +2519 followed by 8 digits
  if (applicantPhone && !/^\+2519\d{8}$/.test(applicantPhone.trim())) {
    return res.status(400).json({
      error: 'Phone number must start with +2519 followed by exactly 8 digits.'
    });
  }

  // Current Residential Address validation: text only (no numbers/icons/symbols)
  if (formData && formData.address && !isStrictTextOnly(formData.address)) {
    return res.status(400).json({
      error: 'Current Residential Address must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Company / Organization Name validation: text only (no numbers/icons/symbols)
  if (companyName && !isStrictTextOnly(companyName)) {
    return res.status(400).json({
      error: 'Company / Organization Name must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }
  if (formData && formData.companyName && !isStrictTextOnly(formData.companyName)) {
    return res.status(400).json({
      error: 'Company / Organization Name must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Tax Identification Number (TIN) validation: exactly 10 digits if provided
  if (formData && formData.tinNumber && formData.tinNumber.trim()) {
    if (!/^\d{10}$/.test(formData.tinNumber.trim())) {
      return res.status(400).json({
        error: `Tax Identification Number (TIN) must be exactly 10 digits (${formData.tinNumber.trim().length}/10 provided).`
      });
    }
  }

  // Project Title validation (text only, no numbers/icons/symbols)
  if (formData && formData.projectTitle && !isStrictTextOnly(formData.projectTitle)) {
    return res.status(400).json({
      error: 'Project Title must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Estimated Investment Capital validation: numbers only, minimum 100,000 ETB
  if (formData && formData.estimatedCapital) {
    const rawDigits = String(formData.estimatedCapital).replace(/\D/g, '');
    const num = Number(rawDigits);
    if (!rawDigits || isNaN(num) || num < 100000) {
      return res.status(400).json({
        error: 'Estimated Investment Capital must be a number of at least 100,000 ETB.'
      });
    }
  }

  // Projected Employment validation: numbers only
  if (formData && formData.employmentProjection) {
    const rawDigits = String(formData.employmentProjection).replace(/\D/g, '');
    const num = Number(rawDigits);
    if (!rawDigits || isNaN(num) || num <= 0) {
      return res.status(400).json({
        error: 'Projected Employment must be a valid positive number.'
      });
    }
  }

  // Detailed Project Description validation: text only, no numbers/icons/symbols
  if (formData && formData.projectDescription && !isStrictTextOnly(formData.projectDescription)) {
    return res.status(400).json({
      error: 'Detailed Project Description must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Additional Notes or Special Requests validation: text only, no numbers/icons/symbols
  if (formData && formData.additionalNotes && !isStrictTextOnly(formData.additionalNotes)) {
    return res.status(400).json({
      error: 'Additional Notes or Special Requests must contain text only, no numbers, symbols, or icons are allowed.'
    });
  }

  // Land Requirement validation: numbers only if provided
  if (formData && formData.landRequirement && String(formData.landRequirement).trim()) {
    if (!/^\d+$/.test(String(formData.landRequirement).trim())) {
      return res.status(400).json({
        error: 'Land Requirement must contain numbers only.'
      });
    }
  }

  // Passport / National ID Number validation (if provided in formData)
  // National ID: FIN + exactly 12 digits (e.g. FIN123456789012)
  // US Passport: A + exactly 8 digits (e.g. A12345678)
  if (formData && formData.passportId) {
    const passportVal = formData.passportId.trim().toUpperCase();
    if (passportVal.startsWith('FIN')) {
      const digits = passportVal.slice(3);
      if (digits.length !== 12 || !/^\d{12}$/.test(digits)) {
        return res.status(400).json({
          error: `National ID must start with FIN followed by exactly 12 digits (${digits.length}/12 provided).`
        });
      }
    } else if (passportVal.startsWith('A')) {
      const digits = passportVal.slice(1);
      if (digits.length !== 8 || !/^\d{8}$/.test(digits)) {
        return res.status(400).json({
          error: `US Passport must start with A followed by exactly 8 digits (${digits.length}/8 provided).`
        });
      }
    } else {
      return res.status(400).json({
        error: 'Passport / National ID Number must start with FIN (followed by 12 digits) or A (followed by 8 digits).'
      });
    }
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
