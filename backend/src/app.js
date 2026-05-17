const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conflictRoutes = require('./routes/conflictRoutes');

app.use('/conflicts', conflictRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;
