import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const opportunitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    sector: { type: String, required: true },
    location: { type: String, required: true },
    investmentType: { type: String, default: 'Direct Commercial / Joint Venture' },
    requiredCapital: { type: String, default: 'Negotiable based on project scale' },
    landAvailable: { type: String, default: 'Available in designated zone' },
    status: { type: String, default: 'Published' },
    imageUrl: { type: String, default: '' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    incentives: { type: [String], default: [] },
    contactPerson: { type: String, default: 'Oromia Investment Facilitation Desk' },
    featured: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String }
  },
  schemaOptions
);

export default mongoose.model('Opportunity', opportunitySchema);
