import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/helpers';
import User from '../models/User';

// ─── Protect Route (must be logged in) ───────────────────────────────────────

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'Access denied. No token provided.', 401);
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      sendError(res, 'Access denied. Invalid token format.', 401);
      return;
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      sendError(res, 'User not found. Token is invalid.', 401);
      return;
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        sendError(res, 'Invalid token.', 401);
        return;
      }
      if (error.name === 'TokenExpiredError') {
        sendError(res, 'Token expired. Please login again.', 401);
        return;
      }
    }
    sendError(res, 'Authentication failed.', 401);
  }
};

// ─── Role-Based Access Control ────────────────────────────────────────────────

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Not authenticated.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}`,
        403
      );
      return;
    }

    next();
  };
};

// ─── Admin Only Shorthand ─────────────────────────────────────────────────────

export const adminOnly = authorize(UserRole.ADMIN);
