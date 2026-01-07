import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient({
    log: ['error', 'warn'],
});

export default prisma;
