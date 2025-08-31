const express = require('express');
const Appointment = require('../database/models/appointments');
const User = require('../database/models/users');
const Dentist = require('../database/models/dentists');
const Status = require('../database/models/status');
const verifyToken = require('../verifyToken');

const router = express.Router();
router.use(verifyToken);

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId },
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: Dentist, attributes: ['id', 'name', 'specialization', 'email'] },
        { model: Status, attributes: ['id', 'description'] }, 
      ],
    });
    console.log(appointments);
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

router.post('/', async (req, res) => {
  const { dentist_id, date, timeFrom, timeTo } = req.body;
  try {
    const appointment = await Appointment.create({
      user_id: req.userId,
      dentist_id,
      date,
      timeFrom,
      timeTo,
      status_id: 1
    });
    res.json({ message: 'Appointment booked', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, timeFrom, timeTo, dentist_id, user_id, status_id } = req.body;
  try {
    const appointment = await Appointment.findOne({ where: { id, user_id: req.userId } });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    await appointment.update({ date, timeFrom, timeTo, dentist_id, user_id, status_id });
    res.json({ message: 'Appointment updated', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Appointment.destroy({ where: { id, user_id: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment canceled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete appointment' });
  }
});

router.post('/dentist', async (req, res) => {
  try {
    console.log(req.body)
    const { dentistId, date } = req.body;

    const appointments = await Appointment.findAll({
      attributes: ['id','date', 'timeFrom', 'timeTo'],
      where: { 
        dentist_id: dentistId, 
        date: date,
        status_id: [1,3]
      },
      order: [['date', 'ASC'], ['timeFrom', 'ASC']]
    });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments for this dentist' });
  }
});


module.exports = router;
