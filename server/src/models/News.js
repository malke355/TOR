import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const newsSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    summary: { type: String, default: '' },
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    publishedAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, default: 'Published' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String }
  },
  schemaOptions
);

export default mongoose.model('News', newsSchema);
