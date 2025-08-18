import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLIENT_ORIGIN, MONGODB_URI, PORT, UPLOAD_DIR } from './src/config.js';

import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/user.js';
import videoRoutes from './src/routes/video.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS
app.use(cors({
  origin: CLIENT_ORIGIN?.split(',').map(s => s.trim()) || '*',
  credentials: true
}));

// Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Logs
app.use(morgan('dev'));

// Static (optional thumbnail exposure)
app.use('/uploads', express.static(path.resolve(__dirname, UPLOAD_DIR)));

// API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Start
(async () => {
  try {
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI missing in .env');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected');

    // ✅ Use Azure's dynamic port if available
    const port = process.env.PORT || PORT || 8080;
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();
