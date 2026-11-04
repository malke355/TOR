import 'dotenv/config';
import path from 'path';
import fs from 'fs';
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
import {
  ensureUploadDirs,
  DOCUMENTS_DIR,
  writeSimplePdf,
  formatFileSize
} from './uploads.js';

/**
 * Seeds MongoDB only when a collection is empty.
 * Safe to run repeatedly without wiping live CMS data.
 */
export async function seedIfEmpty() {
  ensureUploadDirs();

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

  await ensureDocumentFiles();
}

/** Create real PDF files for documents that still lack stored files. */
export async function ensureDocumentFiles() {
  ensureUploadDirs();
  const docs = await Document.find();
  let fixed = 0;

  for (const doc of docs) {
    const needsFile =
      !doc.storedFileName ||
      !doc.downloadUrl ||
      doc.downloadUrl === '#' ||
      !fs.existsSync(path.join(DOCUMENTS_DIR, doc.storedFileName || ''));

    if (!needsFile) continue;

    const storedFileName = `${doc.id}.pdf`;
    const filePath = path.join(DOCUMENTS_DIR, storedFileName);
    const bytes = writeSimplePdf(filePath, doc.title || 'OTIB Document');

    doc.storedFileName = storedFileName;
    doc.originalFileName = `${String(doc.title || 'document').replace(/[^\w.-]+/g, '_')}.pdf`;
    doc.mimeType = 'application/pdf';
    doc.fileType = 'PDF';
    doc.fileSize = formatFileSize(bytes);
    doc.downloadUrl = `/api/documents/${doc.id}/download`;
    await doc.save();
    fixed += 1;
  }

  if (fixed > 0) {
    console.log(`[Seed] Attached real PDF files to ${fixed} documents`);
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
