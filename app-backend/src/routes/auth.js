import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { JWT_SECRET } from '../config.js';

const router = Router();

/** POST /api/auth/signup */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const allowCreatorPublic = true;
    const finalRole = allowCreatorPublic ? (role || 'consumer') : 'consumer';

    const user = await User.create({ name, email, passwordHash, role: finalRole });

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: safeUser(user), token });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(400).json({ error: err.message || 'Signup failed' });
  }
});

/** POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: safeUser(user), token });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function safeUser(u) {
  return { _id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar };
}

export default router;
