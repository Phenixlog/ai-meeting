import { Mic, Square, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordingButtonProps {
    isRecording: boolean;
    isPaused: boolean;
    onStart: () => void;
    onStop: () => void;
    onPause: () => void;
    onResume: () => void;
    disabled?: boolean;
}

export function RecordingButton({
    isRecording,
    isPaused,
    onStart,
    onStop,
    onPause,
    onResume,
    disabled = false,
}: RecordingButtonProps) {
    const handleClick = () => {
        if (disabled) return;

        if (!isRecording) {
            onStart();
        } else {
            onStop();
        }
    };

    const handlePauseResume = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPaused) {
            onResume();
        } else {
            onPause();
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Main Recording Button */}
            <button
                onClick={handleClick}
                disabled={disabled}
                className={cn(
                    'relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 transform',
                    'focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-4',
                    disabled && 'opacity-50 cursor-not-allowed',
                    !isRecording && [
                        'bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30',
                        'hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105',
                        'focus-visible:ring-indigo-500',
                    ],
                    isRecording && !isPaused && [
                        'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30',
                        'hover:shadow-xl hover:shadow-red-500/40 hover:scale-105',
                        'focus-visible:ring-red-500',
                    ],
                    isRecording && isPaused && [
                        'bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/30',
                        'hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105',
                        'focus-visible:ring-amber-500',
                    ]
                )}
            >
                {/* Pulse Ring Animation - pointer-events-none to not block clicks */}
                {isRecording && !isPaused && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25 pointer-events-none" />
                        <span className="absolute inset-[-8px] rounded-full border-4 border-red-500 opacity-50 animate-pulse pointer-events-none" />
                    </>
                )}

                {/* Icon */}
                <span className="relative z-10 text-white">
                    {!isRecording ? (
                        <Mic className="w-14 h-14" />
                    ) : (
                        <Square className="w-12 h-12 fill-current" />
                    )}
                </span>
            </button>

            {/* Pause/Resume Button (only visible when recording) */}
            {isRecording && (
                <button
                    onClick={handlePauseResume}
                    className={cn(
                        'flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all',
                        'bg-white border border-gray-200 shadow-sm',
                        'hover:bg-gray-50 hover:border-gray-300',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
                    )}
                >
                    {isPaused ? (
                        <>
                            <Play className="w-5 h-5 text-emerald-600" />
                            <span className="text-gray-700">Resume</span>
                        </>
                    ) : (
                        <>
                            <Pause className="w-5 h-5 text-amber-600" />
                            <span className="text-gray-700">Pause</span>
                        </>
                    )}
                </button>
            )}

            {/* Status Text */}
            <p className={cn(
                'text-sm font-medium',
                !isRecording && 'text-gray-500',
                isRecording && !isPaused && 'text-red-600',
                isRecording && isPaused && 'text-amber-600'
            )}>
                {!isRecording && 'Click to start recording'}
                {isRecording && !isPaused && 'Recording in progress...'}
                {isRecording && isPaused && 'Recording paused'}
            </p>
        </div>
    );
}
