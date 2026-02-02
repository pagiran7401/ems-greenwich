import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// Health check endpoint
router.get('/', (_req: Request, res: Response) => {
  const healthStatus = {
    success: true,
    message: 'EMS API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
    },
  };

  res.status(200).json(healthStatus);
});

// Database health check
router.get('/db', async (_req: Request, res: Response) => {
  try {
    await mongoose.connection.db?.admin().ping();
    res.status(200).json({
      success: true,
      message: 'Database connection is healthy',
      status: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      status: 'disconnected',
    });
  }
});

export default router;
