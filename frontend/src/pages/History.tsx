import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Clock, Calendar, Trash2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/ui/skeleton';
import { formatDate, formatDuration, getRelativeTime } from '@/lib/utils';
import { meetingsApi } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { MEETING_TYPE_LABELS, MEETING_TYPE_OPTIONS, type MeetingType } from '@/types';

interface Meeting {
    id: string;
    title: string;
    type: MeetingType;
    durationSeconds: number;
    meetingDate: string;
    status: string;
}

interface MeetingCardProps {
    id: string;
    title: string;
    type: MeetingType;
    duration: number;
    date: string;
    status: string;
    onDelete: () => void;
}

function MeetingCard({ id, title, type, duration, date, status, onDelete }: MeetingCardProps) {
    const isCompleted = status === 'COMPLETED';

    return (
        <Card className="group hover:shadow-lg transition-all duration-200">
            <Link to={`/report/${id}`} className="block p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                {title || 'Réunion sans titre'}
                            </h3>
                            {!isCompleted && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                    En cours
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{formatDate(date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{formatDuration(duration)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="whitespace-nowrap">
                            {MEETING_TYPE_LABELS[type] || 'Autre'}
                        </Badge>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">{getRelativeTime(date)}</p>
            </Link>
        </Card>
    );
}

export function History() {
    const { token, isAuthenticated } = useAuthStore();
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('ALL');
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch meetings from API
    useEffect(() => {
        async function fetchMeetings() {
            if (!isAuthenticated || !token) {
                setMeetings([]);
                setIsLoading(false);
                return;
            }

            try {
                const response = await meetingsApi.list(token);
                setMeetings(response.data as Meeting[]);
            } catch (err) {
                console.error('Error fetching meetings:', err);
                setError('Impossible de charger les réunions');
            } finally {
                setIsLoading(false);
            }
        }

        fetchMeetings();
    }, [token, isAuthenticated]);

    // Filter meetings
    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch =
            !search || meeting.title?.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'ALL' || meeting.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette réunion ?')) {
            return;
        }

        if (!token) return;

        try {
            await meetingsApi.delete(id, token);
            setMeetings((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error('Error deleting meeting:', err);
            alert('Erreur lors de la suppression');
        }
    };

    const filterOptions = [
        { value: 'ALL', label: 'Tous les types' },
        ...MEETING_TYPE_OPTIONS,
    ];

    // Not authenticated
    if (!isAuthenticated) {
        return (
            <div className="container py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connectez-vous pour voir votre historique</h3>
                        <p className="text-gray-500 mb-6">
                            Créez un compte pour sauvegarder et retrouver tous vos comptes-rendus
                        </p>
                        <div className="flex justify-center gap-3">
                            <Link to="/login">
                                <Button variant="outline">Se connecter</Button>
                            </Link>
                            <Link to="/signup">
                                <Button>Créer un compte</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Historique</h1>
                        <p className="text-gray-600 mt-1">
                            {filteredMeetings.length} réunion{filteredMeetings.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link to="/recording">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvel enregistrement
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            icon={<Search className="h-4 w-4" />}
                        />
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            options={filterOptions}
                        />
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Meetings List */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filteredMeetings.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune réunion trouvée</h3>
                        <p className="text-gray-500 mb-6">
                            {search || typeFilter !== 'ALL'
                                ? 'Essayez de modifier vos filtres'
                                : 'Commencez par enregistrer votre première réunion'}
                        </p>
                        {!search && typeFilter === 'ALL' && (
                            <Link to="/recording">
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Commencer un enregistrement
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredMeetings.map((meeting) => (
                            <MeetingCard
                                key={meeting.id}
                                id={meeting.id}
                                title={meeting.title}
                                type={meeting.type}
                                duration={meeting.durationSeconds}
                                date={meeting.meetingDate}
                                status={meeting.status}
                                onDelete={() => handleDelete(meeting.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
