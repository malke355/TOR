import express from 'express';
import {
  Opportunity,
  TradeProduct,
  Service,
  News,
  Document,
  Message,
  Application,
  User
} from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const [
      totalOpps,
      publishedOpps,
      draftOpps,
      tradeProducts,
      services,
      news,
      documents,
      totalMessages,
      newMessages
    ] = await Promise.all([
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ status: 'Published' }),
      Opportunity.countDocuments({ status: { $ne: 'Published' } }),
      TradeProduct.countDocuments(),
      Service.countDocuments(),
      News.countDocuments(),
      Document.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ status: 'New' })
    ]);

    res.json({
      opportunities: {
        total: totalOpps,
        published: publishedOpps,
        draft: draftOpps
      },
      tradeProducts,
      services,
      news,
      documents,
      messages: {
        total: totalMessages,
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
  } catch (err) {
    console.error('[Stats] error:', err.message);
    res.status(500).json({ error: 'Unable to load statistics.' });
  }
});

// GET /api/stats/backup (Protected - Bureau Data Export)
router.get('/backup', requireAuth, async (req, res) => {
  try {
    const strip = (docs) => docs.map(({ _id, ...rest }) => rest);

    const [users, opportunities, tradeProducts, services, news, documents, messages, applications] =
      await Promise.all([
        User.find().lean(),
        Opportunity.find().lean(),
        TradeProduct.find().lean(),
        Service.find().lean(),
        News.find().lean(),
        Document.find().lean(),
        Message.find().lean(),
        Application.find().lean()
      ]);

    const backup = {
      institution: 'Oromia Trade and Investment Bureau',
      exportTimestamp: new Date().toISOString(),
      exportedBy: req.user.name,
      data: {
        users: strip(users).map(({ password, ...u }) => ({ ...u, password: '[REDACTED]' })),
        opportunities: strip(opportunities),
        tradeProducts: strip(tradeProducts),
        services: strip(services),
        news: strip(news),
        documents: strip(documents),
        messages: strip(messages),
        applications: strip(applications)
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=otib-backup-${Date.now()}.json`);
    res.json(backup);
  } catch (err) {
    console.error('[Stats] backup error:', err.message);
    res.status(500).json({ error: 'Unable to export backup.' });
  }
});

export default router;
