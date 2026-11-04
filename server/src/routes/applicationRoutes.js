import express from 'express';
import { Application } from '../models/index.js';
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
router.post('/', async (req, res) => {
  try {
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

    if (!serviceId || !applicantName || !applicantEmail) {
      return res.status(400).json({
        error: 'Service ID, applicant name, and email are required.'
      });
    }

    if (!isStrictTextOnly(applicantName)) {
      return res.status(400).json({
        error: 'Full Legal Name must contain text only, no numbers, symbols, or icons are allowed.'
      });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(applicantEmail.trim())) {
      return res.status(400).json({
        error: 'Email address must be a valid @gmail.com address.'
      });
    }

    if (applicantPhone && !/^\+2519\d{8}$/.test(applicantPhone.trim())) {
      return res.status(400).json({
        error: 'Phone number must start with +2519 followed by exactly 8 digits.'
      });
    }

    if (formData && formData.address && !isStrictTextOnly(formData.address)) {
      return res.status(400).json({
        error: 'Current Residential Address must contain text only, no numbers, symbols, or icons are allowed.'
      });
    }

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

    if (formData && formData.tinNumber && formData.tinNumber.trim()) {
      if (!/^\d{10}$/.test(formData.tinNumber.trim())) {
        return res.status(400).json({
          error: `Tax Identification Number (TIN) must be exactly 10 digits (${formData.tinNumber.trim().length}/10 provided).`
        });
      }
    }

    if (formData && formData.projectTitle && !isStrictTextOnly(formData.projectTitle)) {
      return res.status(400).json({
        error: 'Project Title must contain text only, no numbers, symbols, or icons are allowed.'
      });
    }

    if (formData && formData.estimatedCapital) {
      const rawDigits = String(formData.estimatedCapital).replace(/\D/g, '');
      const num = Number(rawDigits);
      if (!rawDigits || isNaN(num) || num < 100000) {
        return res.status(400).json({
          error: 'Estimated Investment Capital must be a number of at least 100,000 ETB.'
        });
      }
    }

    if (formData && formData.employmentProjection) {
      const rawDigits = String(formData.employmentProjection).replace(/\D/g, '');
      const num = Number(rawDigits);
      if (!rawDigits || isNaN(num) || num <= 0) {
        return res.status(400).json({
          error: 'Projected Employment must be a valid positive number.'
        });
      }
    }

    if (formData && formData.projectDescription && !isStrictTextOnly(formData.projectDescription)) {
      return res.status(400).json({
        error: 'Detailed Project Description must contain text only, no numbers, symbols, or icons are allowed.'
      });
    }

    if (formData && formData.additionalNotes && !isStrictTextOnly(formData.additionalNotes)) {
      return res.status(400).json({
        error: 'Additional Notes or Special Requests must contain text only, no numbers, symbols, or icons are allowed.'
      });
    }

    if (formData && formData.landRequirement && String(formData.landRequirement).trim()) {
      if (!/^\d+$/.test(String(formData.landRequirement).trim())) {
        return res.status(400).json({
          error: 'Land Requirement must contain numbers only.'
        });
      }
    }

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

    const appCount = await Application.countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(appCount + 1).padStart(4, '0');
    const referenceNumber = `OTIB-${serviceId.toUpperCase()}-${dateStr}-${seq}`;

    const newApplication = await Application.create({
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
    });

    res.status(201).json({
      message: `Application submitted successfully. Reference: ${referenceNumber}`,
      referenceNumber,
      id: newApplication.id
    });
  } catch (err) {
    console.error('[Applications] create error:', err.message);
    res.status(500).json({ error: 'Unable to submit application.' });
  }
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

// GET /api/applications/:id (Protected - Admin view single application)
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

// PATCH /api/applications/:id/status (Protected - Update application status)
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
    const { _id, ...data } = removed;
    res.json({ message: 'Application deleted successfully', data });
  } catch (err) {
    console.error('[Applications] delete error:', err.message);
    res.status(500).json({ error: 'Unable to delete application.' });
  }
});

export default router;
