import { create } from 'zustand';
import type { Meeting, MeetingType } from '@/types';

interface MeetingFilters {
    search: string;
    type: MeetingType | 'ALL';
    sortBy: 'date' | 'title' | 'duration';
    sortOrder: 'asc' | 'desc';
}

interface MeetingState {
    meetings: Meeting[];
    currentMeeting: Meeting | null;
    isLoading: boolean;
    error: string | null;
    filters: MeetingFilters;

    // Actions
    setMeetings: (meetings: Meeting[]) => void;
    addMeeting: (meeting: Meeting) => void;
    updateMeeting: (id: string, updates: Partial<Meeting>) => void;
    removeMeeting: (id: string) => void;
    setCurrentMeeting: (meeting: Meeting | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setFilters: (filters: Partial<MeetingFilters>) => void;
    resetFilters: () => void;

    // Computed
    getFilteredMeetings: () => Meeting[];
}

const initialFilters: MeetingFilters = {
    search: '',
    type: 'ALL',
    sortBy: 'date',
    sortOrder: 'desc',
};

export const useMeetingStore = create<MeetingState>((set, get) => ({
    meetings: [],
    currentMeeting: null,
    isLoading: false,
    error: null,
    filters: { ...initialFilters },

    setMeetings: (meetings) => set({ meetings, isLoading: false }),

    addMeeting: (meeting) =>
        set((state) => ({
            meetings: [meeting, ...state.meetings],
        })),

    updateMeeting: (id, updates) =>
        set((state) => ({
            meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
            currentMeeting:
                state.currentMeeting?.id === id
                    ? { ...state.currentMeeting, ...updates }
                    : state.currentMeeting,
        })),

    removeMeeting: (id) =>
        set((state) => ({
            meetings: state.meetings.filter((m) => m.id !== id),
            currentMeeting: state.currentMeeting?.id === id ? null : state.currentMeeting,
        })),

    setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),

    setLoading: (loading) => set({ isLoading: loading }),

    setError: (error) => set({ error, isLoading: false }),

    setFilters: (filters) =>
        set((state) => ({
            filters: { ...state.filters, ...filters },
        })),

    resetFilters: () => set({ filters: { ...initialFilters } }),

    getFilteredMeetings: () => {
        const { meetings, filters } = get();
        let filtered = [...meetings];

        // Search filter
        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                (m) =>
                    m.title?.toLowerCase().includes(search) ||
                    m.context?.toLowerCase().includes(search)
            );
        }

        // Type filter
        if (filters.type !== 'ALL') {
            filtered = filtered.filter((m) => m.type === filters.type);
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
                case 'date':
                    comparison = new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime();
                    break;
                case 'title':
                    comparison = (a.title || '').localeCompare(b.title || '');
                    break;
                case 'duration':
                    comparison = b.durationSeconds - a.durationSeconds;
                    break;
            }
            return filters.sortOrder === 'asc' ? -comparison : comparison;
        });

        return filtered;
    },
}));
