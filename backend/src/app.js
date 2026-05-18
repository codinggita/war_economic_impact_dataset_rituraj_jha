const express = require('express');
const cors = require('cors');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimiter');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const conflictRoutes = require('./routes/conflictRoutes');
const recordRoutes = require('./routes/recordRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const jwtRoutes = require('./routes/jwtRoutes');
const adminRoutes = require('./routes/adminRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply API rate limiter to all requests
app.use(apiLimiter);

// Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/jwt', jwtRoutes);
app.use('/admin', adminRoutes);
app.use('/protected', protectedRoutes);

app.use('/conflicts', conflictRoutes);
app.use('/', recordRoutes); // /regions, /countries, /economic-records, etc.
app.use('/search', searchRoutes);
app.use('/stats', statsRoutes);

// Health, Version, Compare Routes
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
app.head('/health', (req, res) => res.status(200).end());

app.get('/version', (req, res) => res.status(200).json({ version: '1.0.0' }));

app.get('/compare', async (req, res) => {
  try {
    const Conflict = require('./models/Conflict');
    const { conflict1, conflict2 } = req.query;
    if (!conflict1 || !conflict2) return res.status(400).json({ message: 'Missing conflicts to compare' });
    const c1 = await Conflict.findOne({ name: { $regex: conflict1, $options: 'i' } });
    const c2 = await Conflict.findOne({ name: { $regex: conflict2, $options: 'i' } });
    res.status(200).json({ conflict1: c1, conflict2: c2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// AI summary stub
app.get('/conflicts/summary/ai', (req, res) => {
  res.status(200).json({ summary: 'AI generated summary of conflicts placeholder' });
});

// Default Route
app.get('/', (req, res) => {
  res.send('War Economic Impact API is running...');
});

// Handle HEAD and OPTIONS requests globally
app.options('*', cors());
app.head('*', (req, res) => res.status(200).end());

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
