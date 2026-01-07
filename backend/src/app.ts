import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import path from 'path';
import prisma from './lib/prisma.js';

import authRoutes from './routes/auth.js';
import meetingsRoutes from './routes/meetings.js';
import transcriptionRoutes from './routes/transcription.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Load environment variables
config();

// Debug: Check if DATABASE_URL is visible to Node
logger.info(`🔍 Checking environment: DATABASE_URL is ${process.env.DATABASE_URL ? 'PRESENT' : 'MISSING'}`);
logger.info(`🔍 Checking environment: NODE_ENV is ${process.env.NODE_ENV}`);

// Test database connection
async function checkDb() {
    try {
        await prisma.$connect();
        logger.info('✅ Database connected successfully');
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
    }
}
checkDb();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Log incoming origin for debugging production connectivity
        if (origin) logger.debug(`Incoming request from origin: ${origin}`);

        const envOrigins = process.env.CORS_ORIGIN?.split(',');

        // In production, if no CORS_ORIGIN is defined, echo back the origin
        // This allows 'credentials: true' to work which is incompatible with '*'
        if (process.env.NODE_ENV === 'production' && !envOrigins) {
            callback(null, origin || true);
        } else {
            // Use configured origins or default development origin
            callback(null, envOrigins || ['http://localhost:5173']);
        }
    },
    credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(path.resolve(uploadDir)));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/transcribe', transcriptionRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

export default app;
