import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    FileText,
    FileDown,
    Link as LinkIcon,
    Clock,
    Calendar,
    Tag,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    AlertCircle,
    MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatDuration, formatDate, copyToClipboard, downloadAsFile } from '@/lib/utils';
import { meetingsApi } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { MEETING_TYPE_LABELS, type MeetingType } from '@/types';

interface Meeting {
    id: string;
    title: string;
    type: string;
    durationSeconds: number;
    meetingDate: string;
    transcript: string | null;
    report: string | null;
    status: string;
}

export function Report() {
    const { id } = useParams<{ id: string }>();
    const { token, isAuthenticated } = useAuthStore();
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    useEffect(() => {
        async function fetchMeeting() {
            // Demo mode
            if (id === 'demo' || !isAuthenticated || !token) {
                setMeeting({
                    id: 'demo',
                    title: 'Réunion Demo',
                    type: 'STRATEGY',
                    durationSeconds: 120,
                    meetingDate: new Date().toISOString(),
                    transcript: null,
                    report: getDemoReport(),
                    status: 'COMPLETED',
                });
                setLoading(false);
                return;
            }

            try {
                const response = await meetingsApi.get(id!, token);
                setMeeting(response.data as Meeting);
            } catch (err) {
                console.error('Error fetching meeting:', err);
                setError('Failed to load meeting');
            } finally {
                setLoading(false);
            }
        }

        fetchMeeting();
    }, [id, token, isAuthenticated]);

    const handleCopyLink = async () => {
        const url = window.location.href;
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleExportMarkdown = () => {
        if (meeting?.report) {
            downloadAsFile(meeting.report, `compte-rendu-${Date.now()}.md`, 'text/markdown');
        }
    };

    const handleExportPdf = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="container py-20">
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                    <p className="text-gray-600">Chargement du rapport...</p>
                </div>
            </div>
        );
    }

    if (error || !meeting) {
        return (
            <div className="container py-20">
                <div className="flex flex-col items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                    <p className="text-gray-900 font-medium mb-2">Erreur</p>
                    <p className="text-gray-600">{error || 'Réunion non trouvée'}</p>
                    <Link to="/history" className="mt-4">
                        <Button>Retour à l'historique</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const report = meeting.report || '';

    return (
        <div className="container py-8 print:py-0">
            {/* Back Button - hide on print */}
            <Link
                to="/history"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 print:hidden"
            >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'historique
            </Link>

            <div className="max-w-4xl mx-auto">
                {/* Report Header */}
                <Card className="mb-6 print:shadow-none print:border-0">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl mb-3">
                                    {meeting.title || 'Compte-rendu de réunion'}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(meeting.meetingDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatDuration(meeting.durationSeconds)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Tag className="h-4 w-4" />
                                        <Badge variant="default">
                                            {MEETING_TYPE_LABELS[meeting.type as MeetingType] || 'Autre'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Export Buttons - hide on print */}
                            <div className="flex items-center gap-2 print:hidden">
                                <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
                                    <FileText className="h-4 w-4 mr-1.5" />
                                    Markdown
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExportPdf}>
                                    <FileDown className="h-4 w-4 mr-1.5" />
                                    PDF
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-500" />
                                            Copié!
                                        </>
                                    ) : (
                                        <>
                                            <LinkIcon className="h-4 w-4 mr-1.5" />
                                            Lien
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Transcript Toggle */}
                {meeting.transcript && (
                    <div className="mb-6 print:hidden">
                        <button
                            onClick={() => setShowTranscript(!showTranscript)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>{showTranscript ? 'Masquer' : 'Afficher'} la transcription</span>
                        </button>

                        {showTranscript && (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Transcription complète</h3>
                                <pre className="whitespace-pre-wrap text-sm text-gray-600 font-normal leading-relaxed">
                                    {meeting.transcript}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Report Content */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden print:border-0">
                    <div className="p-6 md:p-8">
                        <div className={cn(
                            "prose prose-gray max-w-none",
                            // Headings
                            "prose-h2:text-xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mt-8 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-100",
                            "prose-h3:text-lg prose-h3:font-semibold prose-h3:text-gray-800 prose-h3:mt-6 prose-h3:mb-3",
                            // Lists
                            "prose-ul:my-4 prose-li:my-1",
                            // Tables
                            "prose-table:w-full prose-table:border-collapse prose-table:text-sm",
                            "prose-th:bg-gray-50 prose-th:text-left prose-th:font-semibold prose-th:text-gray-700 prose-th:p-3 prose-th:border prose-th:border-gray-200",
                            "prose-td:p-3 prose-td:border prose-td:border-gray-200 prose-td:text-gray-600",
                            // Strong/Bold
                            "prose-strong:text-gray-900 prose-strong:font-semibold",
                            // Paragraphs
                            "prose-p:text-gray-600 prose-p:leading-relaxed"
                        )}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {report}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-400 print:hidden">
                    Généré par Meeting Transcriptor Pro • {formatDate(meeting.meetingDate)}
                </div>
            </div>
        </div>
    );
}

function getDemoReport(): string {
    return `## Résumé Exécutif

- Discussion des objectifs Q1 et résultats clés pour l'équipe
- Revue de l'avancement du sprint actuel et identification des blocages
- Accord sur la priorisation du nouveau système d'authentification
- Réunion de suivi planifiée pour la semaine prochaine

## Décisions Prises

1. **Priorité du système d'authentification** : Sera déplacé en haut du backlog
2. **Durée du sprint** : Extension de 2 jours acceptée
3. **Processus de revue de code** : Revues par les pairs obligatoires

## Actions à Faire

| Action | Responsable | Échéance | Priorité |
|--------|-------------|----------|----------|
| Compléter le design de l'API | Sophie | Vendredi | Haute |
| Mettre à jour la documentation | Michel | Mercredi | Moyenne |
| Planifier la revue parties prenantes | David | Lundi | Haute |

## Points de Discussion Clés

- **Système d'authentification** : Le flux actuel est trop compliqué
- **Planification du sprint** : Extension nécessaire
- **Processus de revue** : Les PRs restent trop longtemps sans revue

## Blocages & Questions Ouvertes

- En attente de l'approbation de l'équipe sécurité
- Besoin de clarifier le périmètre des mises à jour

## Idées & Suggestions

💡 Envisager des feature flags pour un déploiement progressif

💡 Explorer les sessions de pair programming

---
*Mode Démo - Connectez-vous pour la vraie transcription IA*`;
}
