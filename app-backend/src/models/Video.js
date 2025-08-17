import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  src: { type: String, required: true }, // file path (served static/stream)
  title: { type: String, required: true },
  publisher: { type: String, default: '' },
  producer: { type: String, default: '' },
  genre: { type: String, default: '' },
  ageRating: { type: String, default: 'PG' },
  tags: { type: String, default: '' },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  avgRating: { type: Number, default: 0 },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      value: { type: Number, min: 1, max: 5 }
    }
  ]
}, { timestamps: true });

VideoSchema.methods.recomputeAvg = function () {
  if (!this.ratings.length) { this.avgRating = 0; return; }
  this.avgRating = this.ratings.reduce((a, r) => a + r.value, 0) / this.ratings.length;
};

export const Video = mongoose.model('Video', VideoSchema);
