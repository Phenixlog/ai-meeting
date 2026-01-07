import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).optional(),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const data = signupSchema.parse(req.body);

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existing) {
            res.status(400).json({ success: false, error: 'Email already registered' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email });

        res.status(201).json({
            success: true,
            data: { user, token },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, error: error.errors[0].message });
            return;
        }
        console.error('Signup error:', error);
        res.status(500).json({ success: false, error: 'Failed to create account' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const data = loginSchema.parse(req.body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const validPassword = await bcrypt.compare(data.password, user.passwordHash);

        if (!validPassword) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email });

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
                token,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, error: error.errors[0].message });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, error: 'Failed to get user' });
    }
});

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
    // In a stateless JWT setup, we just acknowledge the logout
    // Client should remove the token
    res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
