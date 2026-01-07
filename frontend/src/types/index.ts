// Re-export all types
export * from './meeting';
export * from './timestamp';
export * from './user';
export * from './report';

// Common API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Processing Status
export interface ProcessingStatus {
    meetingId: string;
    status: 'UPLOADING' | 'TRANSCRIBING' | 'GENERATING_REPORT' | 'COMPLETED' | 'FAILED';
    progress: number;
    estimatedSeconds?: number;
    error?: string;
}
