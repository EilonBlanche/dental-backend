const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db');
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const dentistRoutes = require('./routes/dentists');
const userRoutes = require('./routes/users');
const statusRoutes = require('./routes/status');
const jwt = require('jsonwebtoken');

require('./cron/cron');

const app = express();
const PORT = 5000;

app.get('/', (req, res) => res.send('Hello World!'));

// Allow local dev and production frontend domains
const allowedOrigins = [
  'http://localhost:3000',
  'https://genuine-piroshki-e21886.netlify.app'
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer TOKEN"
  if (!token) return res.status(401).json({ message: 'Unauthorized Access' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Unauthorized Access' });
    req.user = user; // decoded payload
    next();
  });
}


app.use(authenticateToken);
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