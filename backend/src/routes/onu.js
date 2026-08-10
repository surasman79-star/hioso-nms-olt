const express = require('express');
const { ONU, ONUOptical } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();
router.use(authMiddleware);

// Get all ONU
router.get('/', async (req, res) => {
  try {
    const onus = await ONU.findAll({ include: ['optical_data'] });
    res.json(onus);
  } catch (error) {
    logger.error('Error fetching ONU:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ONU by ID
router.get('/:id', async (req, res) => {
  try {
    const onu = await ONU.findByPk(req.params.id, { include: ['optical_data'] });
    if (!onu) {
      return res.status(404).json({ error: 'ONU not found' });
    }
    res.json(onu);
  } catch (error) {
    logger.error('Error fetching ONU:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ONU optical data
router.get('/:id/optical', async (req, res) => {
  try {
    const optical = await ONUOptical.findAll({
      where: { onu_id: req.params.id },
      order: [['timestamp', 'DESC']],
      limit: 100
    });
    res.json(optical);
  } catch (error) {
    logger.error('Error fetching optical data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
