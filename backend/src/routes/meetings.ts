import { Router, type Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// All meeting routes require auth
router.use(authMiddleware);

// Meeting types (matching frontend)
const MeetingTypes = ['DAILY', 'CLIENT_MEETING', 'BRAINSTORM', 'STRATEGY', 'COMMITTEE', 'RETROSPECTIVE', 'OTHER'] as const;
const TimestampTypes = ['IMPORTANT_POINT', 'DECISION_MADE', 'ACTION_ITEM', 'IDEA'] as const;

// Validation schemas
const createMeetingSchema = z.object({
    title: z.string().max(200).optional(),
    type: z.enum(MeetingTypes).optional().default('OTHER'),
    context: z.string().max(2000).optional(),
    durationSeconds: z.number().int().min(0).optional().default(0),
    timestamps: z.array(z.object({
        timeSeconds: z.number().int().min(0),
        type: z.enum(TimestampTypes),
        note: z.string().optional(),
    })).optional().default([]),
});

const updateMeetingSchema = z.object({
    title: z.string().max(200).optional(),
    type: z.enum(MeetingTypes).optional(),
    context: z.string().max(2000).optional(),
    status: z.enum(['RECORDING', 'UPLOADING', 'TRANSCRIBING', 'GENERATING_REPORT', 'COMPLETED', 'FAILED']).optional(),
});

// GET /api/meetings - List all meetings for user
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const meetings = await prisma.meeting.findMany({
            where: { userId: req.userId },
            orderBy: { meetingDate: 'desc' },
            include: {
                timestamps: true,
                _count: { select: { timestamps: true } },
            },
        });

        res.json({ success: true, data: meetings });
    } catch (error) {
        console.error('List meetings error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch meetings' });
    }
});

// GET /api/meetings/:id - Get single meeting
router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const meeting = await prisma.meeting.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId,
            },
            include: { timestamps: true },
        });

        if (!meeting) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        res.json({ success: true, data: meeting });
    } catch (error) {
        console.error('Get meeting error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch meeting' });
    }
});

// POST /api/meetings - Create new meeting
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data = createMeetingSchema.parse(req.body);

        const meeting = await prisma.meeting.create({
            data: {
                userId: req.userId!,
                title: data.title,
                type: data.type,
                context: data.context,
                durationSeconds: data.durationSeconds,
                timestamps: {
                    create: data.timestamps.map((t) => ({
                        timeSeconds: t.timeSeconds,
                        type: t.type,
                        note: t.note,
                    })),
                },
            },
            include: { timestamps: true },
        });

        res.status(201).json({ success: true, data: meeting });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, error: error.errors[0].message });
            return;
        }
        console.error('Create meeting error:', error);
        res.status(500).json({ success: false, error: 'Failed to create meeting' });
    }
});

// PATCH /api/meetings/:id - Update meeting
router.patch('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const data = updateMeetingSchema.parse(req.body);

        // Check ownership
        const existing = await prisma.meeting.findFirst({
            where: { id: req.params.id, userId: req.userId },
        });

        if (!existing) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        const meeting = await prisma.meeting.update({
            where: { id: req.params.id },
            data,
            include: { timestamps: true },
        });

        res.json({ success: true, data: meeting });
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, error: error.errors[0].message });
            return;
        }
        console.error('Update meeting error:', error);
        res.status(500).json({ success: false, error: 'Failed to update meeting' });
    }
});

// DELETE /api/meetings/:id - Delete meeting
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Check ownership
        const existing = await prisma.meeting.findFirst({
            where: { id: req.params.id, userId: req.userId },
        });

        if (!existing) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        await prisma.meeting.delete({
            where: { id: req.params.id },
        });

        res.json({ success: true, message: 'Meeting deleted' });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete meeting' });
    }
});

// GET /api/meetings/:id/report - Get meeting report
router.get('/:id/report', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const meeting = await prisma.meeting.findFirst({
            where: { id: req.params.id, userId: req.userId },
            select: { report: true, status: true },
        });

        if (!meeting) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        if (!meeting.report) {
            res.status(404).json({ success: false, error: 'Report not yet generated' });
            return;
        }

        res.json({ success: true, data: { report: meeting.report } });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch report' });
    }
});

export default router;
