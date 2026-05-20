import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not defined');
  return secret;
};

export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
