import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
    max?: number;
    showLabel?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, max = 100, showLabel = false, ...props }, ref) => {
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));

        return (
            <div className={cn('relative', className)} {...props}>
                <div
                    ref={ref}
                    className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
                >
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                {showLabel && (
                    <span className="absolute -top-6 right-0 text-xs font-medium text-gray-500">
                        {Math.round(percentage)}%
                    </span>
                )}
            </div>
        );
    }
);

Progress.displayName = 'Progress';

export { Progress };
