import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vercel functions can only write to /tmp. Local and Render keep files in server/uploads.
export const UPLOADS_ROOT = process.env.VERCEL
  ? path.join('/tmp', 'otib-uploads')
  : path.join(__dirname, '../../uploads');
export const DOCUMENTS_DIR = path.join(UPLOADS_ROOT, 'documents');
export const APPLICATIONS_DIR = path.join(UPLOADS_ROOT, 'applications');

export function ensureUploadDirs() {
  for (const dir of [UPLOADS_ROOT, DOCUMENTS_DIR, APPLICATIONS_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}

function safeExt(originalName = '', fallback = '.pdf') {
  const ext = path.extname(originalName || '').toLowerCase();
  if (!ext || ext.length > 10) return fallback;
  return ext;
}

function diskStorage(destination) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureUploadDirs();
      cb(null, destination);
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
      cb(null, `${unique}${safeExt(file.originalname)}`);
    }
  });
}

const allowedMime = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain'
]);

function fileFilter(_req, file, cb) {
  if (allowedMime.has(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Allowed: PDF, DOC/DOCX, images, TXT.'));
  }
}

export const documentUpload = multer({
  storage: diskStorage(DOCUMENTS_DIR),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter
});

export const applicationUpload = multer({
  storage: diskStorage(APPLICATIONS_DIR),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

export function formatFileSize(bytes = 0) {
  if (!bytes || bytes < 1024) return `${bytes || 0} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function fileTypeFromName(name = '') {
  const ext = path.extname(name).replace('.', '').toUpperCase();
  return ext || 'FILE';
}

/** Minimal single-page PDF with a title line (for seed / placeholder docs). */
export function writeSimplePdf(filePath, title = 'OTIB Official Document') {
  const safeTitle = String(title).replace(/[()\\]/g, ' ').slice(0, 80);
  const stream = `BT /F1 18 Tf 50 750 Td (${safeTitle}) Tj ET`;
  const content = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;

  const objects = [
    '1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj',
    '2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj',
    '3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1 5 0 R >> >> >>endobj',
    `4 0 obj${content}endobj`,
    '5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${obj}\n`;
  }
  const xrefPos = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

  ensureUploadDirs();
  fs.writeFileSync(filePath, pdf);
  return fs.statSync(filePath).size;
}
