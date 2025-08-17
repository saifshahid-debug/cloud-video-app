import mongoose from 'mongoose';
import { MONGODB_URI } from './config.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected');
}
