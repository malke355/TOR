import express from 'express';
import { User } from '../models/index.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid institutional credentials.' });
    }

    const token = generateToken(user);
    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error('[Auth] login error:', err.message);
    res.status(500).json({ error: 'Authentication service unavailable.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (err) {
    console.error('[Auth] me error:', err.message);
    res.status(500).json({ error: 'Unable to load user profile.' });
  }
});

export default router;
