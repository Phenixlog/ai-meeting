// Timestamp Types
export type TimestampType = 'IMPORTANT_POINT' | 'DECISION_MADE' | 'ACTION_ITEM' | 'IDEA';

export interface Timestamp {
    id: string;
    meetingId: string;
    timeSeconds: number;
    type: TimestampType;
    note: string | null;
    createdAt: string;
}

export interface TimestampInput {
    timeSeconds: number;
    type: TimestampType;
    note?: string;
}

export const TIMESTAMP_CONFIG: Record<
    TimestampType,
    { icon: string; label: string; color: string; bgClass: string; textClass: string }
> = {
    IMPORTANT_POINT: {
        icon: '📌',
        label: 'Important Point',
        color: 'primary',
        bgClass: 'bg-indigo-100',
        textClass: 'text-indigo-700',
    },
    DECISION_MADE: {
        icon: '✅',
        label: 'Decision Made',
        color: 'success',
        bgClass: 'bg-emerald-100',
        textClass: 'text-emerald-700',
    },
    ACTION_ITEM: {
        icon: '🚨',
        label: 'Action Item',
        color: 'danger',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
    },
    IDEA: {
        icon: '💡',
        label: 'Idea',
        color: 'warning',
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-700',
    },
};
