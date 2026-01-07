import { useRef, useState, useCallback } from 'react';
import { getSupportedMimeType } from '@/lib/constants';

interface UseAudioCaptureReturn {
    isRecording: boolean;
    isPaused: boolean;
    error: string | null;
    analyser: AnalyserNode | null;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob | null>;
    pauseRecording: () => void;
    resumeRecording: () => void;
}

export function useAudioCapture(): UseAudioCaptureReturn {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const startRecording = useCallback(async () => {
        try {
            setError(null);
            chunksRef.current = [];

            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                },
            });

            streamRef.current = stream;

            // Set up audio analyser for waveform
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            const source = audioContext.createMediaStreamSource(stream);
            const analyserNode = audioContext.createAnalyser();
            analyserNode.fftSize = 256;
            source.connect(analyserNode);
            setAnalyser(analyserNode);

            // Create MediaRecorder
            const mimeType = getSupportedMimeType();
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(1000); // Collect data every second
            setIsRecording(true);
            setIsPaused(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to start recording';
            setError(message);
            console.error('Recording error:', err);
        }
    }, []);

    const stopRecording = useCallback(async (): Promise<Blob | null> => {
        if (!mediaRecorderRef.current || !streamRef.current) {
            return null;
        }

        return new Promise<Blob>((resolve) => {
            const mediaRecorder = mediaRecorderRef.current!;

            mediaRecorder.onstop = () => {
                const mimeType = getSupportedMimeType();
                const blob = new Blob(chunksRef.current, { type: mimeType });
                console.log('Recording stopped, blob size:', blob.size);
                resolve(blob);
            };

            mediaRecorder.stop();

            // Stop all tracks
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;

            // Close audio context
            audioContextRef.current?.close();
            audioContextRef.current = null;
            setAnalyser(null);

            setIsRecording(false);
            setIsPaused(false);
        });
    }, []);

    const pauseRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    }, []);

    const resumeRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    }, []);

    return {
        isRecording,
        isPaused,
        error,
        analyser,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
    };
}
