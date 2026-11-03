import express from 'express';
import { getStore } from '../config/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats
router.get('/', (req, res) => {
  const store = getStore();

  const publishedOpps = store.opportunities.filter(o => o.status === 'Published').length;
  const draftOpps = store.opportunities.filter(o => o.status !== 'Published').length;
  const newMessages = store.messages.filter(m => m.status === 'New').length;

  res.json({
    opportunities: {
      total: store.opportunities.length,
      published: publishedOpps,
      draft: draftOpps
    },
    tradeProducts: store.tradeProducts.length,
    services: store.services.length,
    news: store.news.length,
    documents: store.documents.length,
    messages: {
      total: store.messages.length,
      new: newMessages
    },
    institutionalMetrics: {
      activeInvestmentZones: 12,
      priorityExportSectors: 6,
      licensedInvestorsYTD: 248,
      regionalExportVolumeUSD: '295 Billion ETB',
      regionalExportVolumeETB: '295 Billion ETB'
    }
  });
});

// GET /api/stats/backup (Protected - Bureau Data Export)
router.get('/backup', requireAuth, (req, res) => {
  const store = getStore();
  const backup = {
    institution: 'Oromia Trade and Investment Bureau',
    exportTimestamp: new Date().toISOString(),
    exportedBy: req.user.name,
    data: store
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=otib-backup-${Date.now()}.json`);
  res.json(backup);
});

export default router;
