require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth');
const oltRoutes = require('./routes/olt');
const onuRoutes = require('./routes/onu');
const monitoringRoutes = require('./routes/monitoring');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/olt', oltRoutes);
app.use('/api/onu', onuRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// WebSocket events
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Attach io to app for use in routes
app.io = io;

// Database sync and server start
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

sequelize.sync({ alter: false }).then(() => {
  server.listen(PORT, HOST, () => {
    logger.info(`Server running on http://${HOST}:${PORT}`);
  });
}).catch(err => {
  logger.error('Database sync error:', err);
  process.exit(1);
});

module.exports = { app, server, io };
