import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
    isActive: boolean;
    isPaused: boolean;
    analyser?: AnalyserNode | null;
}

export function AudioWaveform({ isActive, isPaused, analyser }: AudioWaveformProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const [bars] = useState(() => Array.from({ length: 40 }, () => Math.random() * 0.3 + 0.1));

    useEffect(() => {
        if (!isActive || isPaused || !analyser) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = canvas.width / 40;
            const gap = 2;

            for (let i = 0; i < 40; i++) {
                const dataIndex = Math.floor((i / 40) * bufferLength);
                const barHeight = (dataArray[dataIndex] / 255) * canvas.height * 0.8 + canvas.height * 0.1;

                const x = i * (barWidth + gap);
                const y = (canvas.height - barHeight) / 2;

                // Gradient from indigo to purple
                const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
                gradient.addColorStop(0, '#818cf8');
                gradient.addColorStop(1, '#6366f1');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, 2);
                ctx.fill();
            }
        };

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isActive, isPaused, analyser]);

    // Fallback animated bars when no analyser
    if (!analyser) {
        return (
            <div className="flex items-center justify-center gap-[3px] h-16">
                {bars.map((height, i) => (
                    <div
                        key={i}
                        className={cn(
                            'w-1 rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400',
                            'transition-all duration-150'
                        )}
                        style={{
                            height: isActive && !isPaused ? `${Math.random() * 60 + 20}%` : '20%',
                            animationDelay: `${i * 50}ms`,
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            width={400}
            height={64}
            className={cn(
                'w-full max-w-md h-16',
                (!isActive || isPaused) && 'opacity-30'
            )}
        />
    );
}
