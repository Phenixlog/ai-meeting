import { TimestampMarker } from './TimestampMarker';
import type { LocalTimestamp } from '@/stores/recordingStore';

interface TimestampListProps {
    timestamps: LocalTimestamp[];
    onDelete: (id: string) => void;
}

export function TimestampList({ timestamps, onDelete }: TimestampListProps) {
    if (timestamps.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No timestamps yet</p>
                <p className="text-xs mt-1">Click the buttons above during recording to mark important moments</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
                Timestamps ({timestamps.length})
            </h3>
            <div className="flex flex-wrap gap-2">
                {timestamps.map((timestamp) => (
                    <TimestampMarker
                        key={timestamp.id}
                        type={timestamp.type}
                        timeSeconds={timestamp.timeSeconds}
                        note={timestamp.note}
                        onDelete={() => onDelete(timestamp.id)}
                    />
                ))}
            </div>
        </div>
    );
}
