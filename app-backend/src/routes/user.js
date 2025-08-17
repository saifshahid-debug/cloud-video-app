import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Video } from '../models/Video.js';

const router = Router();

/**
 * GET /api/users/me
 * Returns logged-in user's profile (no passwordHash)
 */
router.get('/me', authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -__v');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    console.error('❌ Error in /me:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * GET /api/users/:id/videos
 * Fetch videos uploaded by specific user
 */
router.get('/:id/videos', async (req, res) => {
  try {
    const list = await Video.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('author', 'name avatar role'); // expose only safe fields

    res.json(list);
  } catch (err) {
    console.error('❌ Error in /:id/videos:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
