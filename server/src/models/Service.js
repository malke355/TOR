import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const serviceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General Public Service' },
    description: { type: String, required: true },
    eligibility: { type: String, default: 'Eligible citizens and enterprises' },
    requirements: { type: String, default: 'Valid identification and relevant documentation' },
    procedure: { type: String, default: 'Submit application to designated service desk' },
    processingTime: { type: String, default: '3 - 5 Working Days' },
    fees: { type: String, default: 'Standard administrative fee' },
    responsibleOffice: { type: String, default: 'Directorate of Public Services' },
    isOnline: { type: Boolean, default: false },
    portalUrl: { type: String, default: '' }
  },
  schemaOptions
);

export default mongoose.model('Service', serviceSchema);
