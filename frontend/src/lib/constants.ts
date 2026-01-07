// Application Constants

export const APP_NAME = 'Meeting Transcriptor Pro';
export const APP_DESCRIPTION = 'Professional meeting transcription and automated report generation';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Audio Recording Configuration
export const AUDIO_CONFIG = {
    mimeTypes: ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/wav'],
    maxFileSizeMB: 100,
    sampleRate: 44100,
} as const;

// Get supported MIME type
export function getSupportedMimeType(): string {
    for (const mimeType of AUDIO_CONFIG.mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
            return mimeType;
        }
    }
    return 'audio/webm';
}

// Navigation Links
export const NAV_LINKS = [
    { href: '/', label: 'Home', icon: 'Home' },
    { href: '/recording', label: 'New Recording', icon: 'Mic' },
    { href: '/history', label: 'History', icon: 'Clock' },
] as const;

// Status Messages
export const PROCESSING_MESSAGES = {
    UPLOADING: 'Uploading audio...',
    TRANSCRIBING: 'Transcribing audio...',
    GENERATING_REPORT: 'Generating report...',
    COMPLETED: 'Processing complete!',
    FAILED: 'Processing failed',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'meeting_app_token',
    USER: 'meeting_app_user',
    THEME: 'meeting_app_theme',
} as const;

// Validation
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    TITLE_MAX_LENGTH: 200,
    CONTEXT_MAX_LENGTH: 2000,
} as const;
