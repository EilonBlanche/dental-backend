const express = require('express');
const router = express.Router();
const Dentist = require('../database/models/dentists');

// Get all dentists
router.get('/', async (req, res) => {
  try {
    const dentists = await Dentist.findAll();
    res.json(dentists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dentists' });
  }
});

// Create a new dentist
router.post('/', async (req, res) => {
  const { name, email, specialization, availableStart, availableEnd } = req.body;

  if (!name) return res.status(400).json({ message: 'Name is required' });

  try {
    const dentist = await Dentist.create({
      name,
      email: email || null,
      specialization: specialization || null,
      availableStart: availableStart || null,
      availableEnd: availableEnd || null,
    });

    res.json(dentist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create dentist' });
  }
});

// Update dentist
router.put('/:id', async (req, res) => {
  const { name, email, specialization, availableStart, availableEnd } = req.body;

  try {
    const dentist = await Dentist.findByPk(req.params.id);
    if (!dentist) return res.status(404).json({ message: 'Dentist not found' });

    // Update all fields if provided
    dentist.name = name ?? dentist.name;
    dentist.email = email ?? dentist.email;
    dentist.specialization = specialization ?? dentist.specialization;
    dentist.availableStart = availableStart ?? dentist.availableStart;
    dentist.availableEnd = availableEnd ?? dentist.availableEnd;
    dentist.dateUpdated = new Date();

    await dentist.save();

    res.json(dentist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update dentist' });
  }
});


// Delete dentist
router.delete('/:id', async (req, res) => {
  try {
    const dentist = await Dentist.findByPk(req.params.id);
    if (!dentist) return res.status(404).json({ message: 'Dentist not found' });

    await dentist.destroy();
    res.json({ message: 'Dentist deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete dentist' });
  }
});

module.exports = router;
