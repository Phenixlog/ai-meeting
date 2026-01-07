import { Button } from '@/components/ui/button';
import { TIMESTAMP_CONFIG, type TimestampType } from '@/types';
import { cn } from '@/lib/utils';

interface TimestampActionsProps {
    onAddTimestamp: (type: TimestampType) => void;
    disabled?: boolean;
}

const timestampTypes: TimestampType[] = [
    'IMPORTANT_POINT',
    'DECISION_MADE',
    'ACTION_ITEM',
    'IDEA',
];

export function TimestampActions({ onAddTimestamp, disabled = false }: TimestampActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {timestampTypes.map((type) => {
                const config = TIMESTAMP_CONFIG[type];
                return (
                    <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => onAddTimestamp(type)}
                        className={cn(
                            'transition-all duration-200',
                            'hover:scale-105',
                            disabled && 'opacity-50'
                        )}
                    >
                        <span className="mr-1">{config.icon}</span>
                        <span className="hidden sm:inline">{config.label}</span>
                    </Button>
                );
            })}
        </div>
    );
}
