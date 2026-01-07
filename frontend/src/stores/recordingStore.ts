import { create } from 'zustand';
import type { TimestampInput, TimestampType, MeetingFormData, MeetingType } from '@/types';
import { generateId } from '@/lib/utils';

export interface LocalTimestamp extends TimestampInput {
    id: string;
}

interface RecordingState {
    // Recording Status
    isRecording: boolean;
    isPaused: boolean;
    elapsedSeconds: number;

    // Meeting Data
    meetingForm: MeetingFormData;
    timestamps: LocalTimestamp[];

    // Audio
    audioBlob: Blob | null;
    audioUrl: string | null;

    // Actions
    startRecording: () => void;
    stopRecording: (blob: Blob) => void;
    pauseRecording: () => void;
    resumeRecording: () => void;
    tick: () => void;
    reset: () => void;

    // Meeting Form Actions
    setMeetingForm: (form: Partial<MeetingFormData>) => void;

    // Timestamp Actions
    addTimestamp: (type: TimestampType, note?: string) => void;
    removeTimestamp: (id: string) => void;
    clearTimestamps: () => void;
}

const initialFormState: MeetingFormData = {
    title: '',
    type: 'OTHER' as MeetingType,
    context: '',
};

export const useRecordingStore = create<RecordingState>((set, get) => ({
    // Initial State
    isRecording: false,
    isPaused: false,
    elapsedSeconds: 0,
    meetingForm: { ...initialFormState },
    timestamps: [],
    audioBlob: null,
    audioUrl: null,

    // Recording Actions
    startRecording: () =>
        set({
            isRecording: true,
            isPaused: false,
            elapsedSeconds: 0,
            timestamps: [],
            audioBlob: null,
            audioUrl: null,
        }),

    stopRecording: (blob) => {
        const url = URL.createObjectURL(blob);
        set({
            isRecording: false,
            isPaused: false,
            audioBlob: blob,
            audioUrl: url,
        });
    },

    pauseRecording: () => set({ isPaused: true }),

    resumeRecording: () => set({ isPaused: false }),

    tick: () =>
        set((state) => ({
            elapsedSeconds: state.isPaused ? state.elapsedSeconds : state.elapsedSeconds + 1,
        })),

    reset: () => {
        const state = get();
        if (state.audioUrl) {
            URL.revokeObjectURL(state.audioUrl);
        }
        set({
            isRecording: false,
            isPaused: false,
            elapsedSeconds: 0,
            meetingForm: { ...initialFormState },
            timestamps: [],
            audioBlob: null,
            audioUrl: null,
        });
    },

    // Meeting Form Actions
    setMeetingForm: (form) =>
        set((state) => ({
            meetingForm: { ...state.meetingForm, ...form },
        })),

    // Timestamp Actions
    addTimestamp: (type, note) =>
        set((state) => ({
            timestamps: [
                ...state.timestamps,
                {
                    id: generateId(),
                    timeSeconds: state.elapsedSeconds,
                    type,
                    note,
                },
            ],
        })),

    removeTimestamp: (id) =>
        set((state) => ({
            timestamps: state.timestamps.filter((t) => t.id !== id),
        })),

    clearTimestamps: () => set({ timestamps: [] }),
}));
