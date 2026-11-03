import express from 'express';
import { getStore } from '../config/store.js';

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

export default router;
