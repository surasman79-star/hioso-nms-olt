const express = require('express');
const { OLT } = require('../models');
const { authMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();
router.use(authMiddleware);

// Get all OLTs
router.get('/', async (req, res) => {
  try {
    const olts = await OLT.findAll();
    res.json(olts);
  } catch (error) {
    logger.error('Error fetching OLTs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get OLT by ID
router.get('/:id', async (req, res) => {
  try {
    const olt = await OLT.findByPk(req.params.id, { include: ['onus', 'ports', 'alarms'] });
    if (!olt) {
      return res.status(404).json({ error: 'OLT not found' });
    }
    res.json(olt);
  } catch (error) {
    logger.error('Error fetching OLT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create OLT
router.post('/', async (req, res) => {
  try {
    const { hostname, ip_address, snmp_community, vendor, model, description } = req.body;
    const olt = await OLT.create({ hostname, ip_address, snmp_community, vendor, model, description });
    logger.info(`OLT created: ${hostname}`);
    res.status(201).json(olt);
  } catch (error) {
    logger.error('Error creating OLT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update OLT
router.put('/:id', async (req, res) => {
  try {
    const olt = await OLT.findByPk(req.params.id);
    if (!olt) {
      return res.status(404).json({ error: 'OLT not found' });
    }
    await olt.update(req.body);
    logger.info(`OLT updated: ${olt.hostname}`);
    res.json(olt);
  } catch (error) {
    logger.error('Error updating OLT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete OLT
router.delete('/:id', async (req, res) => {
  try {
    const olt = await OLT.findByPk(req.params.id);
    if (!olt) {
      return res.status(404).json({ error: 'OLT not found' });
    }
    await olt.destroy();
    logger.info(`OLT deleted: ${olt.hostname}`);
    res.json({ message: 'OLT deleted successfully' });
  } catch (error) {
    logger.error('Error deleting OLT:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
