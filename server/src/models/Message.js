import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    organization: { type: String, default: 'Individual / Investor' },
    subject: { type: String, default: 'Public Bureau Inquiry' },
    message: { type: String, required: true },
    status: { type: String, default: 'New' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  schemaOptions
);

export default mongoose.model('Message', messageSchema);
