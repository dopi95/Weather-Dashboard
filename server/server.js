
'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const weatherRoutes = require('./routes/weather');
const forecastRoutes = require('./routes/forecast');
const locationRoutes = require('./routes/location');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:3000'];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o.trim()))) {
        cb(null, true);
      } else {
        cb(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    methods: ['GET'],
  })
);

app.use(express.json());

// Routes

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/weather', weatherRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/location', locationRoutes);

// 404 for unknown routes
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.path}`);
  err.status = 404;
  next(err);
});

// Global error handler (must be last)

app.use(errorHandler);

// Start 

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

module.exports = app;
