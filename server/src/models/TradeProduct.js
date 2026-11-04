import mongoose from 'mongoose';
import { schemaOptions } from './schemas.js';

const tradeProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    originZones: { type: String, default: 'Regional Oromia' },
    exportSpecs: { type: String, default: 'Standard Ethiopian Export Quality' },
    description: { type: String, default: '' },
    seasonality: { type: String, default: 'Year-round' },
    imageUrl: { type: String, default: '' }
  },
  schemaOptions
);

export default mongoose.model('TradeProduct', tradeProductSchema);
