import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';
import { User } from '../models/User.js';

export function authOptional(req, _res, next) {
  const token = getToken(req);
  if (!token) { req.user = null; return next(); }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch {
    req.user = null;
  }
  next();
}

export async function authRequired(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}


function getToken(req) {
  const h = req.headers.authorization || '';
  const [type, token] = h.split(' ');
  return type === 'Bearer' && token ? token : null;
}
