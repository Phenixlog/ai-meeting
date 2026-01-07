// Report Types
export interface ReportSection {
    title: string;
    content: string;
}

export interface ActionItem {
    action: string;
    assignee: string | null;
    deadline: string | null;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface MeetingReport {
    meetingId: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    executiveSummary: string[];
    decisions: string[];
    actionItems: ActionItem[];
    keyDiscussionPoints: string[];
    blockers: string[];
    insights: string[];
    rawMarkdown: string;
}

export interface ExportFormat {
    type: 'markdown' | 'pdf' | 'email' | 'link';
    label: string;
    icon: string;
}

export const EXPORT_OPTIONS: ExportFormat[] = [
    { type: 'markdown', label: 'Download as Markdown', icon: 'FileText' },
    { type: 'pdf', label: 'Download as PDF', icon: 'FileDown' },
    { type: 'email', label: 'Send via Email', icon: 'Mail' },
    { type: 'link', label: 'Copy shareable link', icon: 'Link' },
];
