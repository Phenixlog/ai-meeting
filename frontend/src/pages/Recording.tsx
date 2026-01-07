import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { RecordingButton } from '@/components/recording/RecordingButton';
import { RecordingTimer } from '@/components/recording/RecordingTimer';
import { TimestampActions } from '@/components/recording/TimestampActions';
import { TimestampList } from '@/components/recording/TimestampList';
import { AudioWaveform } from '@/components/recording/AudioWaveform';
import { MeetingForm } from '@/components/meeting/MeetingForm';
import { useRecordingStore } from '@/stores/recordingStore';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import type { TimestampType } from '@/types';

export function Recording() {
    const navigate = useNavigate();
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [isStopping, setIsStopping] = useState(false);
    const hasInitialized = useRef(false);

    const {
        isRecording: storeIsRecording,
        isPaused: storeIsPaused,
        elapsedSeconds,
        meetingForm,
        timestamps,
        startRecording: storeStartRecording,
        stopRecording: storeStopRecording,
        pauseRecording: storePauseRecording,
        resumeRecording: storeResumeRecording,
        tick,
        setMeetingForm,
        addTimestamp,
        removeTimestamp,
        reset,
    } = useRecordingStore();

    const {
        isRecording: captureIsRecording,
        isPaused: captureIsPaused,
        error: captureError,
        analyser,
        startRecording: captureStartRecording,
        stopRecording: captureStopRecording,
        pauseRecording: capturePauseRecording,
        resumeRecording: captureResumeRecording,
    } = useAudioCapture();

    // Reset store on mount
    useEffect(() => {
        if (!hasInitialized.current) {
            reset();
            hasInitialized.current = true;
        }
    }, [reset]);

    // Sync capture error to state
    useEffect(() => {
        if (captureError) {
            setPermissionError(captureError);
        }
    }, [captureError]);

    const handleStart = useCallback(async () => {
        setPermissionError(null);
        await captureStartRecording();
        storeStartRecording();
    }, [captureStartRecording, storeStartRecording]);

    const handleStop = useCallback(async () => {
        if (isStopping) return; // Prevent double-click
        setIsStopping(true);

        console.log('Stopping recording...');

        try {
            // Get the audio blob from the capture hook
            const blob = await captureStopRecording();
            console.log('Got blob:', blob?.size);

            // Get current state for navigation
            const state = useRecordingStore.getState();

            // Stop the store recording
            storeStopRecording(blob || new Blob());

            // Navigate to processing page with the data
            navigate('/processing', {
                state: {
                    audioBlob: blob || new Blob(),
                    meetingForm: state.meetingForm,
                    timestamps: state.timestamps,
                    duration: state.elapsedSeconds,
                },
            });
        } catch (err) {
            console.error('Stop recording error:', err);
            setIsStopping(false);
        }
    }, [captureStopRecording, storeStopRecording, navigate, isStopping]);

    const handlePause = useCallback(() => {
        capturePauseRecording();
        storePauseRecording();
    }, [capturePauseRecording, storePauseRecording]);

    const handleResume = useCallback(() => {
        captureResumeRecording();
        storeResumeRecording();
    }, [captureResumeRecording, storeResumeRecording]);

    const handleAddTimestamp = useCallback(
        (type: TimestampType) => {
            addTimestamp(type);
        },
        [addTimestamp]
    );

    const isRecording = storeIsRecording || captureIsRecording;
    const isPaused = storeIsPaused || captureIsPaused;

    return (
        <div className="container py-12">
            <div className="max-w-2xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isRecording ? 'Recording in Progress' : 'New Recording'}
                    </h1>
                    <p className="text-gray-600">
                        {isRecording
                            ? 'Use the timestamp buttons to mark important moments'
                            : 'Start recording your meeting and let AI handle the rest'}
                    </p>
                </div>

                {/* Error Message */}
                {permissionError && (
                    <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Microphone Access Required</p>
                            <p className="text-sm text-red-600 mt-1">{permissionError}</p>
                            <p className="text-xs text-red-500 mt-2">
                                Please allow microphone access in your browser settings and try again.
                            </p>
                        </div>
                    </div>
                )}

                {/* Pre-recording Form */}
                {!isRecording && (
                    <div className="flex justify-center mb-12">
                        <MeetingForm data={meetingForm} onChange={setMeetingForm} disabled={isRecording} />
                    </div>
                )}

                {/* Recording Interface */}
                <div className="flex flex-col items-center gap-8">
                    {/* Timer */}
                    <RecordingTimer
                        seconds={elapsedSeconds}
                        isRecording={isRecording}
                        isPaused={isPaused}
                        onTick={tick}
                    />

                    {/* Waveform */}
                    {isRecording && (
                        <div className="w-full max-w-md">
                            <AudioWaveform isActive={isRecording} isPaused={isPaused} analyser={analyser} />
                        </div>
                    )}

                    {/* Recording Button */}
                    <RecordingButton
                        isRecording={isRecording}
                        isPaused={isPaused}
                        onStart={handleStart}
                        onStop={handleStop}
                        onPause={handlePause}
                        onResume={handleResume}
                        disabled={isStopping}
                    />

                    {/* Timestamp Actions */}
                    {isRecording && (
                        <div className="w-full space-y-6 pt-4 animate-fade-in">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-3">Mark important moments:</p>
                                <TimestampActions
                                    onAddTimestamp={handleAddTimestamp}
                                    disabled={isPaused}
                                />
                            </div>

                            {/* Timestamp List */}
                            <div className="p-4 rounded-lg bg-white border border-gray-200">
                                <TimestampList timestamps={timestamps} onDelete={removeTimestamp} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
