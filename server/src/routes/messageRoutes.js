import express from 'express';
import { getStore, saveStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/messages (Public contact submission)
router.post('/', (req, res) => {
  const { name, email, phone, organization, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Text-only validation: numbers not allowed
  if (/\d/.test(name)) {
    return res.status(400).json({ error: 'Full name must contain text only, no numbers are allowed.' });
  }

  if (organization && /\d/.test(organization)) {
    return res.status(400).json({ error: 'Company / Organization must contain text only, no numbers are allowed.' });
  }

  if (subject && /\d/.test(subject)) {
    return res.status(400).json({ error: 'Subject / Purpose of inquiry must contain text only, no numbers are allowed.' });
  }

  if (/\d/.test(message)) {
    return res.status(400).json({ error: 'Detailed message must contain text only, no numbers are allowed.' });
  }

  // Phone validation: must start with +2519 followed by exactly 8 digits
  if (phone && !/^\+2519\d{8}$/.test(phone.trim())) {
    return res.status(400).json({ error: 'Phone number must start with +2519 followed by exactly 8 digits.' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const store = getStore();
  const newMsg = {
    id: `msg-${Date.now()}`,
    name,
    email,
    phone: phone || '',
    organization: organization || 'Individual / Investor',
    subject: subject || 'Public Bureau Inquiry',
    message,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  store.messages.unshift(newMsg);
  saveStore();

  res.status(201).json({
    message: 'Your inquiry has been successfully submitted to the Bureau. Reference: ' + newMsg.id,
    id: newMsg.id
  });
});

// GET /api/messages (Protected - Admin view)
router.get('/', requireAuth, (req, res) => {
  const store = getStore();
  res.json({ count: store.messages.length, data: store.messages });
});

// PATCH /api/messages/:id/status (Protected - Mark read/replied)
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const store = getStore();
  const msg = store.messages.find(m => m.id === req.params.id);

  if (!msg) {
    return res.status(404).json({ error: 'Inquiry message not found.' });
  }

  msg.status = status || 'Read';
  saveStore();

  res.json({ message: 'Message status updated', data: msg });
});

// DELETE /api/messages/:id (Protected)
router.delete('/:id', requireAuth, (req, res) => {
  const store = getStore();
  const index = store.messages.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  const removed = store.messages.splice(index, 1)[0];
  saveStore();

  res.json({ message: 'Message deleted successfully', data: removed });
});

export default router;
