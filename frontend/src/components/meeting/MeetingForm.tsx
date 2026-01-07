import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MEETING_TYPE_OPTIONS, type MeetingFormData } from '@/types';
import { cn } from '@/lib/utils';

interface MeetingFormProps {
    data: MeetingFormData;
    onChange: (data: Partial<MeetingFormData>) => void;
    disabled?: boolean;
}

export function MeetingForm({ data, onChange, disabled = false }: MeetingFormProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full max-w-md">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                disabled={disabled}
                className={cn(
                    'flex items-center justify-between w-full px-4 py-3 rounded-lg',
                    'bg-white border border-gray-200 shadow-sm',
                    'text-sm font-medium text-gray-700',
                    'transition-all duration-200',
                    'hover:bg-gray-50 hover:border-gray-300',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span>Meeting Details (Optional)</span>
                {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
            </button>

            <div
                className={cn(
                    'overflow-hidden transition-all duration-300',
                    isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                )}
            >
                <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Meeting Title
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., Weekly Team Sync"
                            value={data.title || ''}
                            onChange={(e) => onChange({ title: e.target.value })}
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Meeting Type
                        </label>
                        <Select
                            value={data.type}
                            onChange={(e) => onChange({ type: e.target.value as MeetingFormData['type'] })}
                            options={MEETING_TYPE_OPTIONS}
                            disabled={disabled}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Context Notes
                        </label>
                        <Textarea
                            placeholder="Add any relevant context for the meeting..."
                            value={data.context || ''}
                            onChange={(e) => onChange({ context: e.target.value })}
                            disabled={disabled}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
