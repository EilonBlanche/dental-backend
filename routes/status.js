const express = require('express');
const router = express.Router();
const Status = require('../database/models/status'); // Sequelize model

router.get('/', async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.json(statuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch statuses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const status = await Status.findByPk(req.params.id);
    if (!status) return res.status(404).json({ message: 'Status not found' });
    res.json(status);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch status' });
  }
});

module.exports = router;