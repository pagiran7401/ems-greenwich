import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

interface JwtPayload {
  userId: string;
  userType: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify JWT token and attach user to request
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found. Authorization denied.',
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

// Check if user is an organizer
export const isOrganizer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.userType !== 'organizer') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Organizer role required.',
    });
    return;
  }
  next();
};

// Check if user is an attendee
export const isAttendee = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.userType !== 'attendee') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Attendee role required.',
    });
    return;
  }
  next();
};

// Generate JWT token
export const generateToken = (user: IUserDocument): string => {
  return jwt.sign(
    {
      userId: user._id.toString(),
      userType: user.userType,
    },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
