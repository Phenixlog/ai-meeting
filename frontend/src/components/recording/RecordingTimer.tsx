import { useEffect, useRef } from 'react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface RecordingTimerProps {
    seconds: number;
    isRecording: boolean;
    isPaused: boolean;
    onTick: () => void;
}

export function RecordingTimer({
    seconds,
    isRecording,
    isPaused,
    onTick,
}: RecordingTimerProps) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRecording && !isPaused) {
            intervalRef.current = setInterval(onTick, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRecording, isPaused, onTick]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={cn(
                    'font-mono text-6xl font-bold tracking-wider tabular-nums',
                    'transition-colors duration-300',
                    !isRecording && 'text-gray-300',
                    isRecording && !isPaused && 'text-gray-900',
                    isRecording && isPaused && 'text-amber-500'
                )}
            >
                {formatTime(seconds)}
            </div>

            {isRecording && (
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            'w-2 h-2 rounded-full',
                            !isPaused ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                        )}
                    />
                    <span className="text-sm text-gray-500 font-medium">
                        {isPaused ? 'PAUSED' : 'REC'}
                    </span>
                </div>
            )}
        </div>
    );
}
