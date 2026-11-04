import express from 'express';
import { Message } from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/messages (Public contact submission)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, organization, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

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

    if (phone && !/^\+2519\d{8}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Phone number must start with +2519 followed by exactly 8 digits.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const newMsg = await Message.create({
      id: `msg-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      organization: organization || 'Individual / Investor',
      subject: subject || 'Public Bureau Inquiry',
      message,
      status: 'New',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      message: 'Your inquiry has been successfully submitted to the Bureau. Reference: ' + newMsg.id,
      id: newMsg.id
    });
  } catch (err) {
    console.error('[Messages] create error:', err.message);
    res.status(500).json({ error: 'Unable to submit inquiry.' });
  }
});

// GET /api/messages (Protected - Admin view)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Message.find().sort({ createdAt: -1 }).lean();
    const data = list.map(({ _id, ...rest }) => rest);
    res.json({ count: data.length, data });
  } catch (err) {
    console.error('[Messages] list error:', err.message);
    res.status(500).json({ error: 'Unable to load messages.' });
  }
});

// PATCH /api/messages/:id/status (Protected - Mark read/replied)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await Message.findOne({ id: req.params.id });

    if (!msg) {
      return res.status(404).json({ error: 'Inquiry message not found.' });
    }

    msg.status = status || 'Read';
    await msg.save();

    res.json({ message: 'Message status updated', data: msg.toJSON() });
  } catch (err) {
    console.error('[Messages] status error:', err.message);
    res.status(500).json({ error: 'Unable to update message status.' });
  }
});

// DELETE /api/messages/:id (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Message.findOneAndDelete({ id: req.params.id }).lean();
    if (!removed) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    const { _id, ...data } = removed;
    res.json({ message: 'Message deleted successfully', data });
  } catch (err) {
    console.error('[Messages] delete error:', err.message);
    res.status(500).json({ error: 'Unable to delete message.' });
  }
});

export default router;
