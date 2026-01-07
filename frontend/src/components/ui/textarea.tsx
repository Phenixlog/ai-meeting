import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <div>
                <textarea
                    className={cn(
                        'flex min-h-[120px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-200',
                        'placeholder:text-gray-400',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 focus:border-indigo-500',
                        'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
                        'resize-none',
                        error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
