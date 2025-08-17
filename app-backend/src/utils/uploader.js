import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR } from '../config.js';

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, Date.now() + '_' + Math.random().toString(36).slice(2) + ext);
  }
});

export const uploadVideo = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 2 } // 2GB
});
