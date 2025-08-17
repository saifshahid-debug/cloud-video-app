import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['consumer', 'creator', 'admin'], default: 'consumer' },
  avatar: { type: String, default: 'https://api.dicebear.com/7.x/thumbs/svg?seed=' + Math.random().toString(36).slice(2) }
}, { timestamps: true });

UserSchema.methods.comparePassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

UserSchema.statics.signup = async function ({ name, email, password, role }) {
  const exists = await this.findOne({ email });
  if (exists) throw new Error('Email already in use');
  const passwordHash = await bcrypt.hash(password, 10);
  // NOTE: If you want to forbid public creator signups, force role='consumer' here.
  return this.create({ name, email, passwordHash, role: role || 'consumer' });
};

export const User = mongoose.model('User', UserSchema);
