import { X } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { TimestampType } from '@/types';
import { TIMESTAMP_CONFIG } from '@/types';

interface TimestampMarkerProps {
    type: TimestampType;
    timeSeconds: number;
    note?: string | null;
    onDelete?: () => void;
    compact?: boolean;
}

export function TimestampMarker({
    type,
    timeSeconds,
    note,
    onDelete,
    compact = false,
}: TimestampMarkerProps) {
    const config = TIMESTAMP_CONFIG[type];

    return (
        <div
            className={cn(
                'group flex items-center gap-2 rounded-full transition-all duration-200',
                config.bgClass,
                compact ? 'px-2 py-1' : 'px-3 py-1.5'
            )}
        >
            <span className={compact ? 'text-sm' : 'text-base'}>{config.icon}</span>

            <span className={cn('font-mono font-medium', config.textClass, compact ? 'text-xs' : 'text-sm')}>
                {formatTime(timeSeconds)}
            </span>

            {note && !compact && (
                <span className={cn('text-sm truncate max-w-[150px]', config.textClass)}>
                    {note}
                </span>
            )}

            {onDelete && (
                <button
                    onClick={onDelete}
                    className={cn(
                        'opacity-0 group-hover:opacity-100 transition-opacity',
                        'p-0.5 rounded-full hover:bg-black/10',
                        config.textClass
                    )}
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}
