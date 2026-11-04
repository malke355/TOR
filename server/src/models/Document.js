import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const documentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    fileType: { type: String, default: 'PDF' },
    fileSize: { type: String, default: '1.5 MB' },
    refNumber: { type: String, default: '' },
    publishedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    downloadUrl: { type: String, default: '#' },
    originalFileName: { type: String, default: '' },
    storedFileName: { type: String, default: '' },
    mimeType: { type: String, default: 'application/pdf' }
  },
  schemaOptions
);

export default mongoose.model('Document', documentSchema);
