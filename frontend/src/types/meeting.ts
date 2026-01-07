import type { Timestamp } from './timestamp';

// Meeting Types
export type MeetingType =
    | 'DAILY'
    | 'CLIENT_MEETING'
    | 'BRAINSTORM'
    | 'STRATEGY'
    | 'COMMITTEE'
    | 'RETROSPECTIVE'
    | 'OTHER';

export type MeetingStatus =
    | 'RECORDING'
    | 'UPLOADING'
    | 'TRANSCRIBING'
    | 'GENERATING_REPORT'
    | 'COMPLETED'
    | 'FAILED';

export interface Meeting {
    id: string;
    userId: string;
    title: string | null;
    type: MeetingType;
    context: string | null;
    durationSeconds: number;
    status: MeetingStatus;
    transcript: string | null;
    report: string | null;
    audioPath: string | null;
    meetingDate: string;
    createdAt: string;
    updatedAt: string;
    timestamps: Timestamp[];
}

export interface MeetingFormData {
    title?: string;
    type: MeetingType;
    context?: string;
}

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
    DAILY: 'Daily',
    CLIENT_MEETING: 'Client Meeting',
    BRAINSTORM: 'Brainstorm',
    STRATEGY: 'Strategy',
    COMMITTEE: 'Committee',
    RETROSPECTIVE: 'Retrospective',
    OTHER: 'Other',
};

export const MEETING_TYPE_OPTIONS = Object.entries(MEETING_TYPE_LABELS).map(
    ([value, label]) => ({
        value: value as MeetingType,
        label,
    })
);
