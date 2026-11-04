import 'dotenv/config';
import { connectDB } from './db.js';
import {
  User,
  Opportunity,
  TradeProduct,
  Service,
  News,
  Document,
  Message
} from '../models/index.js';
import {
  initialUsers,
  initialOpportunities,
  initialTradeProducts,
  initialServices,
  initialNews,
  initialDocuments,
  initialMessages
} from './seedData.js';

/**
 * Seeds MongoDB only when a collection is empty.
 * Safe to run repeatedly without wiping live CMS data.
 */
export async function seedIfEmpty() {
  const jobs = [
    { Model: User, data: initialUsers, label: 'users' },
    { Model: Opportunity, data: initialOpportunities, label: 'opportunities' },
    { Model: TradeProduct, data: initialTradeProducts, label: 'tradeProducts' },
    { Model: Service, data: initialServices, label: 'services' },
    { Model: News, data: initialNews, label: 'news' },
    { Model: Document, data: initialDocuments, label: 'documents' },
    { Model: Message, data: initialMessages, label: 'messages' }
  ];

  for (const { Model, data, label } of jobs) {
    const count = await Model.countDocuments();
    if (count === 0) {
      await Model.insertMany(data);
      console.log(`[Seed] Inserted ${data.length} ${label}`);
    } else {
      console.log(`[Seed] Skipped ${label} (${count} existing)`);
    }
  }
}

// Allow: npm run seed
const isDirectRun = process.argv[1] && process.argv[1].includes('seed.js');
if (isDirectRun) {
  try {
    await connectDB();
    await seedIfEmpty();
    console.log('[Seed] Done');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Failed:', err.message);
    process.exit(1);
  }
}
