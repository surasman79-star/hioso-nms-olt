const express = require('express');
const { OLT, ONU, TrafficData, Alarm } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

const router = express.Router();
router.use(authMiddleware);

// Dashboard metrics
router.get('/dashboard', async (req, res) => {
  try {
    const totalOlts = await OLT.count();
    const onlineOlts = await OLT.count({ where: { status: 'online' } });
    const totalOnus = await ONU.count();
    const onlineOnus = await ONU.count({ where: { status: 'online' } });
    const activeAlarms = await Alarm.count({ where: { status: 'active' } });

    res.json({
      totalOlts,
      onlineOlts,
      totalOnus,
      onlineOnus,
      activeAlarms,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Traffic data (24h)
router.get('/traffic', async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const traffic = await TrafficData.findAll({
      where: { timestamp: { [Op.gte]: twentyFourHoursAgo } },
      order: [['timestamp', 'ASC']],
      raw: true
    });
    res.json(traffic);
  } catch (error) {
    logger.error('Error fetching traffic data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alarms
router.get('/alarms', async (req, res) => {
  try {
    const alarms = await Alarm.findAll({
      where: { status: 'active' },
      order: [['created_at', 'DESC']]
    });
    res.json(alarms);
  } catch (error) {
    logger.error('Error fetching alarms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
