import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    referenceNumber: { type: String, required: true, unique: true },
    serviceId: { type: String, required: true },
    serviceTitle: { type: String, default: 'Service Application' },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, default: '' },
    companyName: { type: String, default: '' },
    formData: { type: mongoose.Schema.Types.Mixed, default: {} },
    uploadedDocuments: { type: [mongoose.Schema.Types.Mixed], default: [] },
    status: { type: String, default: 'Pending Review' },
    submittedAt: { type: String, default: () => new Date().toISOString() },
    reviewedAt: { type: String, default: null },
    reviewNotes: { type: String, default: '' }
  },
  schemaOptions
);

export default mongoose.model('Application', applicationSchema);
