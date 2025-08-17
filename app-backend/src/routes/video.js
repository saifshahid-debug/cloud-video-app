import { Router } from 'express';
import path from 'path';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { uploadVideo } from '../utils/uploader.js';
import { UPLOAD_DIR } from '../config.js';
import { Video } from '../models/Video.js';
import { Comment } from '../models/Comment.js';
import { streamFile } from '../utils/stream.js';

const router = Router();

/** GET /api/videos/feed?cursor=0&size=5 */
router.get('/feed', async (req, res) => {
  const cursor = parseInt(req.query.cursor ?? '0', 10);
  const size = Math.min(parseInt(req.query.size ?? '5', 10), 20);

  const items = await Video.find({})
    .sort({ createdAt: -1 })
    .skip(cursor * size)
    .limit(size)
    .populate('author', 'name avatar');

  res.json({ items, next: items.length < size ? null : cursor + 1 });
});

/** GET /api/videos/latest */
router.get('/latest', async (_req, res) => {
  const items = await Video.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('author', 'name avatar');
  res.json(items);
});

/** POST /api/videos/upload  (creator only) */
router.post(
  '/upload',
  authRequired,
  requireRole('creator', 'admin'),
  uploadVideo.single('video'),
  async (req, res) => {
    const { title, publisher, producer, genre, ageRating, tags } = req.body || {};
    if (!req.file) return res.status(400).json({ error: 'Video file required' });
    if (!title)   return res.status(400).json({ error: 'Title required' });

    const src = '/api/videos/file/' + req.file.filename;
    const v = await Video.create({
      author: req.user.id, src, title, publisher, producer, genre, ageRating, tags
    });
    await v.populate('author', 'name avatar');
    res.json(v);
  }
);

/** GET /api/videos/file/:name (range streaming) */
router.get('/file/:name', (req, res) => {
  const abs = path.resolve(UPLOAD_DIR, req.params.name);
  streamFile(req, res, abs);
});

/** POST /api/videos/:id/like  (toggle) */
router.post('/:id/like', authRequired, async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  const already = v.likedBy.some(u => u.toString() === req.user.id);
  if (already) {
    v.likedBy = v.likedBy.filter(u => u.toString() !== req.user.id);
    v.likes = Math.max(0, v.likes - 1);
  } else {
    v.likedBy.push(req.user.id);
    v.likes += 1;
  }
  await v.save();
  res.json({ likes: v.likes });
});

/** GET /api/videos/:id/comments */
router.get('/:id/comments', async (req, res) => {
  const list = await Comment.find({ video: req.params.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('user', 'name avatar');
  res.json(list.map(c => ({
    _id: c._id,
    text: c.text,
    user: { _id: c.user._id, name: c.user.name, avatar: c.user.avatar },
    createdAt: c.createdAt
  })));
});

/** POST /api/videos/:id/comments */
router.post('/:id/comments', authRequired, async (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) return res.status(400).json({ error: 'Empty comment' });
  const c = await Comment.create({ video: req.params.id, user: req.user.id, text: text.trim() });
  await c.populate('user', 'name avatar');
  res.json({
    _id: c._id,
    text: c.text,
    user: { _id: c.user._id, name: c.user.name, avatar: c.user.avatar },
    createdAt: c.createdAt
  });
});

/** POST /api/videos/:id/rate { value: 1..5 } */
router.post('/:id/rate', authRequired, async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  const val = Number(req.body?.value);
  if (!(val >= 1 && val <= 5)) return res.status(400).json({ error: 'Rating must be 1..5' });

  const idx = v.ratings.findIndex(r => r.user.toString() === req.user.id);
  if (idx >= 0) v.ratings[idx].value = val;
  else v.ratings.push({ user: req.user.id, value: val });

  v.recomputeAvg();
  await v.save();
  res.json({ avgRating: v.avgRating });
});

export default router;
