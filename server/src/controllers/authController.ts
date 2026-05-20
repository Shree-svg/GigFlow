import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { asyncHandler, sendSuccess, sendError } from '../utils/helpers';
import { UserRole } from '../types';

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  };

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    sendError(res, 'User with this email already exists', 409);
    return;
  }

  // Create user (password is hashed in model pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    role: role ?? UserRole.SALES,
  });

  const token = generateToken(user._id.toString(), user.role);

  sendSuccess(
    res,
    {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
    'Registration successful',
    201
  );
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  // Find user with password (select: false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    sendError(res, 'Invalid email or password', 401);
    return;
  }

  const token = generateToken(user._id.toString(), user.role);

  sendSuccess(res, {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }, 'Login successful');
});

// ─── Get Me ───────────────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by protect middleware
  const authReq = req as Request & { user?: { _id: string } };
  const user = await User.findById(authReq.user?._id);

  if (!user) {
    sendError(res, 'User not found', 404);
    return;
  }

  sendSuccess(res, {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }, 'User fetched successfully');
});
