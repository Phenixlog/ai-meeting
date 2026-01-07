import type { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
    userId?: string;
    userEmail?: string;
}

export async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = extractToken(req.headers.authorization);

        if (!token) {
            res.status(401).json({ success: false, error: 'Authentication required' });
            return;
        }

        const payload = verifyToken(token);

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            res.status(401).json({ success: false, error: 'User not found' });
            return;
        }

        req.userId = payload.userId;
        req.userEmail = payload.email;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
}

// Optional auth - doesn't fail if no token
export async function optionalAuthMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = extractToken(req.headers.authorization);

        if (token) {
            const payload = verifyToken(token);
            req.userId = payload.userId;
            req.userEmail = payload.email;
        }

        next();
    } catch {
        // Invalid token, but continue anyway
        next();
    }
}
