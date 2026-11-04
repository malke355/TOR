import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, default: '' }
  },
  schemaOptions
);

export default mongoose.model('User', userSchema);
