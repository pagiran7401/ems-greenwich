import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Auth middleware - verify JWT on connection
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      ) as { userId: string; userType: string };
      (socket as any).userId = decoded.userId;
      (socket as any).userType = decoded.userType;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`[Socket.io] User connected: ${userId}`);

    // Join user-specific room for targeted notifications
    socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${userId}`);
    });
  });

  console.log('[Socket.io] WebSocket server initialized');
  return io;
}

export function getIO(): Server | null {
  return io;
}

// Emit notification to a specific user
export function emitNotification(userId: string, notification: any): void {
  if (io) {
    io.to(`user:${userId}`).emit('notification', notification);
  }
}

// Emit notification to multiple users
export function emitNotifications(userIds: string[], notification: any): void {
  if (io) {
    userIds.forEach((userId) => {
      io!.to(`user:${userId}`).emit('notification', notification);
    });
  }
}
