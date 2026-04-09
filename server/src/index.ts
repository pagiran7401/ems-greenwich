import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { initializeSocket } from './config/socket';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import eventRoutes from './routes/events';
import ticketRoutes from './routes/tickets';
import bookingRoutes from './routes/bookings';
import analyticsRoutes from './routes/analytics';
import notificationRoutes from './routes/notifications';
import uploadRoutes from './routes/upload';
import userManagementRoutes from './routes/userManagement';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initializeSocket(httpServer);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/events');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userManagementRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   EVENTO Server running on http://localhost:${PORT}         ║
║                                                           ║
║   Health:    http://localhost:${PORT}/api/health            ║
║   Auth:      http://localhost:${PORT}/api/auth              ║
║   Events:    http://localhost:${PORT}/api/events            ║
║   Tickets:   http://localhost:${PORT}/api/tickets           ║
║   Bookings:  http://localhost:${PORT}/api/bookings          ║
║   Analytics: http://localhost:${PORT}/api/analytics         ║
║   WebSocket: ws://localhost:${PORT} (Socket.io)            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
