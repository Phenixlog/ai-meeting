const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    body?: unknown;
    token?: string;
    isFormData?: boolean;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token, isFormData = false } = options;

    const headers: Record<string, string> = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!isFormData && body) {
        headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
        method,
        headers,
        credentials: 'include',
    };

    if (body) {
        config.body = isFormData ? (body as FormData) : JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// Auth API
export const authApi = {
    login: (email: string, password: string) =>
        apiRequest<{ success: boolean; data: { user: unknown; token: string } }>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        }),

    signup: (email: string, password: string, name?: string) =>
        apiRequest<{ success: boolean; data: { user: unknown; token: string } }>('/api/auth/signup', {
            method: 'POST',
            body: { email, password, name },
        }),

    me: (token: string) =>
        apiRequest<{ success: boolean; data: unknown }>('/api/auth/me', { token }),
};

// Meetings API
export const meetingsApi = {
    list: (token: string) =>
        apiRequest<{ success: boolean; data: unknown[] }>('/api/meetings', { token }),

    get: (id: string, token: string) =>
        apiRequest<{ success: boolean; data: unknown }>(`/api/meetings/${id}`, { token }),

    create: (data: unknown, token: string) =>
        apiRequest<{ success: boolean; data: unknown }>('/api/meetings', {
            method: 'POST',
            body: data,
            token,
        }),

    update: (id: string, data: unknown, token: string) =>
        apiRequest<{ success: boolean; data: unknown }>(`/api/meetings/${id}`, {
            method: 'PATCH',
            body: data,
            token,
        }),

    delete: (id: string, token: string) =>
        apiRequest<{ success: boolean }>(`/api/meetings/${id}`, {
            method: 'DELETE',
            token,
        }),
};

// Transcription API
export const transcriptionApi = {
    upload: async (
        audioBlob: Blob,
        meetingId: string,
        token: string
    ): Promise<{ success: boolean; data: { meetingId: string; status: string } }> => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('meetingId', meetingId);

        return apiRequest('/api/transcribe', {
            method: 'POST',
            body: formData,
            token,
            isFormData: true,
        });
    },

    getStatus: (meetingId: string, token: string) =>
        apiRequest<{
            success: boolean;
            data: {
                meetingId: string;
                status: string;
                progress: number;
                hasTranscript: boolean;
                hasReport: boolean;
            };
        }>(`/api/transcribe/${meetingId}/status`, { token }),
};

// Health check
export const healthCheck = () =>
    apiRequest<{ status: string; timestamp: string }>('/api/health');
