import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PROCESSING_MESSAGES } from '@/lib/constants';
import { meetingsApi, transcriptionApi } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

type ProcessingStep = 'UPLOADING' | 'TRANSCRIBING' | 'GENERATING_REPORT' | 'COMPLETED' | 'FAILED';

const STEP_ORDER: ProcessingStep[] = ['UPLOADING', 'TRANSCRIBING', 'GENERATING_REPORT', 'COMPLETED'];

export function Processing() {
    const location = useLocation();
    const navigate = useNavigate();
    const { token, isAuthenticated, isLoading } = useAuthStore();
    const [currentStep, setCurrentStep] = useState<ProcessingStep>('UPLOADING');
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [meetingId, setMeetingId] = useState<string | null>(null);
    const hasStarted = useRef(false);

    const state = location.state as {
        audioBlob?: Blob;
        meetingForm?: { title?: string; type?: string; context?: string };
        timestamps?: Array<{ timeSeconds: number; type: string; note?: string }>;
        duration?: number;
    } | null;

    // Poll for status updates
    const pollStatus = useCallback(async (id: string, authToken: string) => {
        try {
            const response = await transcriptionApi.getStatus(id, authToken);
            const { status, progress: serverProgress } = response.data;

            setProgress(serverProgress);
            setCurrentStep(status as ProcessingStep);

            if (status === 'COMPLETED') {
                setTimeout(() => {
                    navigate(`/report/${id}`);
                }, 1000);
            } else if (status === 'FAILED') {
                setError('Processing failed. Please try again.');
            } else {
                setTimeout(() => pollStatus(id, authToken), 2000);
            }
        } catch (err) {
            console.error('Status poll error:', err);
            setTimeout(() => pollStatus(id, authToken), 3000);
        }
    }, [navigate]);

    // Demo mode
    const runDemoMode = useCallback(async () => {
        try {
            setCurrentStep('UPLOADING');
            for (let i = 0; i <= 30; i++) {
                await new Promise(r => setTimeout(r, 40));
                setProgress(i);
            }

            setCurrentStep('TRANSCRIBING');
            for (let i = 30; i <= 70; i++) {
                await new Promise(r => setTimeout(r, 60));
                setProgress(i);
            }

            setCurrentStep('GENERATING_REPORT');
            for (let i = 70; i <= 100; i++) {
                await new Promise(r => setTimeout(r, 50));
                setProgress(i);
            }

            setCurrentStep('COMPLETED');
            await new Promise(r => setTimeout(r, 1000));

            navigate('/report/demo', {
                state: {
                    meeting: {
                        title: state?.meetingForm?.title || 'Demo Meeting',
                        type: state?.meetingForm?.type || 'OTHER',
                        duration: state?.duration || 0,
                        date: new Date().toISOString(),
                    },
                },
            });
        } catch (err) {
            setCurrentStep('FAILED');
            setError('Demo processing failed');
        }
    }, [navigate, state]);

    useEffect(() => {
        // Wait for auth store to finish loading
        if (isLoading) {
            console.log('Waiting for auth store to load...');
            return;
        }

        if (!state?.audioBlob) {
            navigate('/recording');
            return;
        }

        // Prevent double execution
        if (hasStarted.current) return;
        hasStarted.current = true;

        console.log('Auth state:', { isAuthenticated, hasToken: !!token, token: token?.substring(0, 20) + '...' });

        const processRecording = async () => {
            try {
                // If not authenticated, use demo mode
                if (!isAuthenticated || !token) {
                    console.log('Running demo mode (not authenticated)');
                    await runDemoMode();
                    return;
                }

                console.log('Running real processing with token');

                // Step 1: Create meeting record
                setCurrentStep('UPLOADING');
                setProgress(10);

                const meetingData = {
                    title: state.meetingForm?.title || 'Meeting Recording',
                    type: state.meetingForm?.type || 'OTHER',
                    context: state.meetingForm?.context || '',
                    durationSeconds: state.duration || 0,
                    timestamps: state.timestamps?.map(t => ({
                        timeSeconds: t.timeSeconds,
                        type: t.type,
                        note: t.note,
                    })) || [],
                };

                console.log('Creating meeting with token:', token.substring(0, 20) + '...');
                const createResponse = await meetingsApi.create(meetingData, token);
                const newMeetingId = (createResponse.data as { id: string }).id;
                console.log('Meeting created:', newMeetingId);
                setMeetingId(newMeetingId);
                setProgress(20);

                // Step 2: Upload audio for transcription
                console.log('Uploading audio...');
                await transcriptionApi.upload(state.audioBlob!, newMeetingId, token);
                setProgress(30);

                // Step 3: Start polling for status
                pollStatus(newMeetingId, token);

            } catch (err) {
                console.error('Processing error:', err);
                setCurrentStep('FAILED');
                setError(err instanceof Error ? err.message : 'Processing failed');
            }
        };

        processRecording();
    }, [state, token, isAuthenticated, isLoading, navigate, runDemoMode, pollStatus]);

    const currentStepIndex = STEP_ORDER.indexOf(currentStep);

    // Show loading while auth is being restored
    if (isLoading) {
        return (
            <div className="container py-20">
                <div className="max-w-lg mx-auto text-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Initializing...</p>
                </div>
            </div>
        );
    }

    if (!state?.audioBlob) {
        return null;
    }

    return (
        <div className="container py-20">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {currentStep === 'COMPLETED' ? 'Processing Complete!' : 'Processing Your Meeting'}
                    </h1>
                    <p className="text-gray-600">
                        {currentStep === 'COMPLETED'
                            ? 'Your report is ready'
                            : 'Please wait while we analyze your recording'}
                    </p>
                    {!isAuthenticated && (
                        <p className="text-sm text-amber-600 mt-2">
                            Demo mode - Sign in for full AI processing
                        </p>
                    )}
                </div>

                {/* Progress Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    {/* Spinner or Checkmark */}
                    <div className="flex justify-center mb-8">
                        {currentStep === 'COMPLETED' ? (
                            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center animate-fade-in">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                            </div>
                        ) : currentStep === 'FAILED' ? (
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Status Text */}
                    <p className="text-center text-lg font-medium text-gray-900 mb-6">
                        {error || PROCESSING_MESSAGES[currentStep]}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-8">
                        <Progress value={progress} className="h-3" />
                        <p className="text-center text-sm text-gray-500 mt-2">{progress}%</p>
                    </div>

                    {/* Steps Indicator */}
                    <div className="space-y-3">
                        {STEP_ORDER.slice(0, -1).map((step, index) => {
                            const isActive = currentStepIndex === index;
                            const isCompleted = currentStepIndex > index;
                            const isFailed = currentStep === 'FAILED';

                            return (
                                <div
                                    key={step}
                                    className={cn(
                                        'flex items-center gap-3 p-3 rounded-lg transition-colors',
                                        isActive && 'bg-primary-50',
                                        isCompleted && 'bg-emerald-50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                                            isCompleted && 'bg-emerald-500 text-white',
                                            isActive && !isFailed && 'bg-primary-500 text-white',
                                            isActive && isFailed && 'bg-red-500 text-white',
                                            !isActive && !isCompleted && 'bg-gray-200 text-gray-500'
                                        )}
                                    >
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span
                                        className={cn(
                                            'text-sm font-medium',
                                            isCompleted && 'text-emerald-700',
                                            isActive && 'text-primary-700',
                                            !isActive && !isCompleted && 'text-gray-400'
                                        )}
                                    >
                                        {PROCESSING_MESSAGES[step]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Error Action */}
                    {currentStep === 'FAILED' && (
                        <div className="mt-8 flex justify-center">
                            <Button onClick={() => navigate('/recording')}>Try Again</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
