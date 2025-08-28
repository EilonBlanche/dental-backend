const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');

const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const dentistRoutes = require('./routes/dentists');
const userRoutes = require('./routes/users');
const statusRoutes = require('./routes/status');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => res.send('Hello World!'));

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/status', statusRoutes);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
})();