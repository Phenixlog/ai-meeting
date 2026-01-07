import OpenAI from 'openai';
import { logger } from '../utils/logger.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface Timestamp {
    timeSeconds: number;
    type: string;
    note: string | null;
}

/**
 * Generate meeting report using OpenAI GPT-4o
 * Report language matches the transcript language
 */
export async function generateReport(
    transcript: string,
    title: string,
    type: string,
    context: string,
    timestamps: Timestamp[]
): Promise<string> {
    try {
        logger.info('Starting report generation');

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-your')) {
            logger.warn('OpenAI API key not configured, using mock report');
            return getMockReport(title, type);
        }

        const timestampInfo = timestamps.length > 0
            ? `\n\nUser-marked timestamps during recording:\n${timestamps.map(t =>
                `- [${formatTime(t.timeSeconds)}] ${t.type}: ${t.note || 'No note'}`
            ).join('\n')}`
            : '';

        const prompt = `Tu es un expert en synthèse stratégique et prise de notes pour cadres dirigeants. Ton objectif est de transformer une transcription de réunion brute en un compte-rendu d'exception, ultra-actionnable et structuré.

**LANGUE : GÉNÈRE LE RAPPORT DANS LA MÊME LANGUE QUE LA TRANSCRIPTION (Français si transcription FR, Anglais si EN).**

### INPUTS
- Titre initial : ${title}
- Type : ${type}
- Contexte : ${context}
- Marqueurs temporels manuels : ${timestampInfo}
- TRANSCRIPTION :
${transcript}

### DIRECTIVES DE RÉDACTION
1. **Titre Descriptif** : Ne garde pas le titre initial. Analyse le sujet principal et propose un titre impactant (ex: "Arbitrage Budget Q1 : Focus Authentification & Sécurité").
2. **Participants** : Extrais les noms des participants identifiés dans la transcription.
3. **Résumé Exécutif** : Style télégraphique. Max 3 puces. Uniquement les faits majeurs.
4. **Décisions vs Actions** : 
   - Une DÉCISION est un arbitrage fait, un changement de statut ou une validation.
   - Une ACTION est une tâche concrète à accomplir.
5. **Précision des Actions** : Format [Verbe d'action] + [Output attendu] + [Deadline extraite ou estimée] + [Responsable].
6. **Nuances & Climat** : Note les désaccords, les préoccupations soulevées ou les alternatives sérieuses qui ont été écartées.
7. **Blocages Réels** : Identifie ce qui empêche d'avancer (dépendances externes, manque de budget, etc.).
8. **Idées & Backlog** : Priorise les suggestions 💡 (Maintenant vs Plus tard).
9. **Roadmap Immédiate** : Section "Prochaines étapes" avec les 3 priorités post-réunion.

### STRUCTURE ATTENDUE (Markdown)

# [Titre Stratégique Détecté]

## 👥 Participants
(Liste des personnes identifiées)

## 🎯 Résumé Exécutif
- (Puce 1)
- (Puce 2)
- (Puce 3)

## ⚖️ Décisions Clés
- (Liste des décisions actées)

## ✅ Actions à Faire
| Priorité | Action | Responsable | Échéance | Output attendu |
|:---:|:---|:---|:---|:---|
| 🔴 | (Ex: Finaliser mockups) | (Nom) | (Date) | (Ex: Figma validé) |

## 🧠 Discussion & Nuances
- **Sujet X** : Points de friction, arguments pour/contre.
- **Sujet Y** : Alternatives évoquées.

## 🛑 Blocages & Alertes
- (Lister les points de blocage concrets)

## 💡 Idées & Opportunités Backlog
- (Idées à explorer plus tard)

## 🚀 Prochaines Étapes
1. (Priorité 1)
2. (Priorité 2)
3. (Priorité 3)

Rends le rapport professionnel, dense en informations utiles et évite le remplissage inutile.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: 'Tu es un assistant de haute volée pour la rédaction de comptes-rendus stratégiques. Tu excels dans l\'extraction de la valeur ajoutée et la distinction entre informations prioritaires et bruits de fond. Adapte la langue au contenu de la transcription.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.2,
            max_tokens: 2500,
        });

        const report = response.choices[0]?.message?.content;

        if (!report) {
            throw new Error('No report generated');
        }

        logger.info('Report generation completed');
        return report;
    } catch (error) {
        logger.error(`Report generation error: ${error}`);

        // Return mock report on error for development
        if (process.env.NODE_ENV === 'development') {
            logger.warn('Using mock report due to error');
            return getMockReport(title, type);
        }

        throw error;
    }
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getMockReport(title: string, type: string): string {
    return `# [Optimisé] Analyse Stratégique : ${title}

## 👥 Participants
- Sophie (Ingénierie)
- Michel (Produit)
- Jean (Lead technique)

## 🎯 Résumé Exécutif
- Priorisation absolue du système d'authentification pour réduire les plaintes clients.
- Extension du sprint actuel de 2 jours pour absorber la charge supplémentaire.
- Renforcement de la qualité via des revues de code obligatoires par les pairs.

## ⚖️ Décisions Clés
- Arbitrage en faveur de la refonte immédiate de l'auth au lieu de corriger les anciens bugs mineurs.
- Validation du processus de Peer Review systématique sur toutes les branches.

## ✅ Actions à Faire
| Priorité | Action | Responsable | Échéance | Output attendu |
|:---:|:---|:---|:---|:---|
| 🔴 | Finaliser le design de l'API d'auth | Sophie | Vendredi prochain | Spec validée |
| 🟠 | Mettre à jour la doc technique | Michel | Mercredi | Documentation en ligne |
| 🔴 | Relancer l'équipe Sécurité | Jean | Aujourd'hui | Approbe obtenue |

## 🧠 Discussion & Nuances
- **Qualité de code** : Débat sur la perte de vélocité induite par les Peer Reviews. Accord final car la stabilité prévaut.
- **Timeline** : Inquiétude sur le dépassement de budget. L'extension de sprint est vue comme un "one-shot".

## 🛑 Blocages & Alertes
- Risque de délai si l'équipe Sécurité ne répond pas sous 24h.

## 💡 Idées & Opportunités Backlog
- Implémentation de Feature Flags pour le rollout progressif.

## 🚀 Prochaines Étapes
1. Déclenchement de la phase de design API.
2. Déblocage du goulot d'étranglement Sécurité.
3. Mise en place des règles de PR sur GitHub.
`;
}
