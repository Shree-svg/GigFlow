import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { registerValidator, loginValidator } from '../validators';
import { validate } from '../middleware/validate';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, login);

// GET /api/auth/me
router.get('/me', protect, getMe);

export default router;
