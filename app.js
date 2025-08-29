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

// Allow local dev and production frontend domains
const allowedOrigins = [
  'http://localhost:3000',
  'https://genuine-piroshki-e21886.netlify.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true // allow cookies or auth headers
}));

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