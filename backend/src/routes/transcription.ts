import { Router, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { uploadMiddleware } from '../middleware/upload.js';
import { transcribeAudio } from '../services/transcriptionService.js';
import { generateReport } from '../services/reportService.js';
import { logger } from '../utils/logger.js';

const router = Router();
const prisma = new PrismaClient();

// All routes require auth
router.use(authMiddleware);

// POST /api/transcribe - Upload audio and start transcription
router.post('/', uploadMiddleware.single('audio'), async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { meetingId } = req.body;
        const file = req.file;

        if (!file) {
            res.status(400).json({ success: false, error: 'No audio file provided' });
            return;
        }

        if (!meetingId) {
            res.status(400).json({ success: false, error: 'Meeting ID is required' });
            return;
        }

        // Verify meeting ownership
        const meeting = await prisma.meeting.findFirst({
            where: { id: meetingId, userId: req.userId },
        });

        if (!meeting) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        // Update meeting with audio path and status
        await prisma.meeting.update({
            where: { id: meetingId },
            data: {
                audioPath: file.path,
                status: 'UPLOADING',
            },
        });

        // Start async processing
        processAudioAsync(meetingId, file.path).catch((err) => {
            logger.error(`Async processing failed for meeting ${meetingId}: ${err.message}`);
        });

        res.status(202).json({
            success: true,
            data: {
                meetingId,
                status: 'UPLOADING',
                message: 'Audio uploaded, processing started',
            },
        });
    } catch (error) {
        logger.error(`Upload error: ${error}`);
        res.status(500).json({ success: false, error: 'Failed to upload audio' });
    }
});

// GET /api/transcribe/:id/status - Get processing status
router.get('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
    try {
        const meeting = await prisma.meeting.findFirst({
            where: { id: req.params.id, userId: req.userId },
            select: { status: true, transcript: true, report: true },
        });

        if (!meeting) {
            res.status(404).json({ success: false, error: 'Meeting not found' });
            return;
        }

        let progress = 0;
        switch (meeting.status) {
            case 'UPLOADING':
                progress = 20;
                break;
            case 'TRANSCRIBING':
                progress = 50;
                break;
            case 'GENERATING_REPORT':
                progress = 80;
                break;
            case 'COMPLETED':
                progress = 100;
                break;
            case 'FAILED':
                progress = 0;
                break;
            default:
                progress = 10;
        }

        res.json({
            success: true,
            data: {
                meetingId: req.params.id,
                status: meeting.status,
                progress,
                hasTranscript: !!meeting.transcript,
                hasReport: !!meeting.report,
            },
        });
    } catch (error) {
        logger.error(`Status check error: ${error}`);
        res.status(500).json({ success: false, error: 'Failed to check status' });
    }
});

// Async processing function
async function processAudioAsync(meetingId: string, audioPath: string): Promise<void> {
    try {
        // Update status to transcribing
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { status: 'TRANSCRIBING' },
        });

        // Transcribe audio
        const transcript = await transcribeAudio(audioPath);

        // Update with transcript
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { transcript, status: 'GENERATING_REPORT' },
        });

        // Get meeting context for report generation
        const meeting = await prisma.meeting.findUnique({
            where: { id: meetingId },
            include: { timestamps: true },
        });

        // Generate report
        const report = await generateReport(
            transcript,
            meeting?.title || 'Meeting',
            meeting?.type || 'OTHER',
            meeting?.context || '',
            meeting?.timestamps || []
        );

        // Update with final report
        await prisma.meeting.update({
            where: { id: meetingId },
            data: { report, status: 'COMPLETED' },
        });

        logger.info(`Successfully processed meeting ${meetingId}`);
    } catch (error) {
        logger.error(`Processing failed for meeting ${meetingId}: ${error}`);

        await prisma.meeting.update({
            where: { id: meetingId },
            data: { status: 'FAILED' },
        });
    }
}

export default router;
