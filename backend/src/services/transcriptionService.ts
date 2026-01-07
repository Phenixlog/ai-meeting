import OpenAI from 'openai';
import fs from 'fs';
import { logger } from '../utils/logger.js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio file using OpenAI Whisper API
 * Supports automatic language detection
 */
export async function transcribeAudio(audioPath: string): Promise<string> {
    try {
        logger.info(`Starting transcription for: ${audioPath}`);

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-your')) {
            logger.warn('OpenAI API key not configured, using mock transcription');
            return getMockTranscript();
        }

        // Read the audio file
        const audioFile = fs.createReadStream(audioPath);

        // Call Whisper API - let it auto-detect language for best results
        const response = await openai.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            response_format: 'text',
            // Don't specify language - let Whisper auto-detect (works better for multilingual)
        });

        logger.info(`Transcription completed successfully, length: ${response.length} chars`);
        return response;
    } catch (error) {
        logger.error(`Transcription error: ${error}`);

        // Return mock transcript on error for development
        if (process.env.NODE_ENV === 'development') {
            logger.warn('Using mock transcript due to error');
            return getMockTranscript();
        }

        throw error;
    }
}

function getMockTranscript(): string {
    return `
Bonjour à tous. Commençons notre réunion de planification Q1.

Premièrement, je souhaite discuter de nos objectifs pour le trimestre. Nous devons nous concentrer sur trois domaines principaux : améliorer notre système d'authentification, améliorer l'expérience utilisateur et réduire la dette technique.

Jean : Je suis d'accord. Le système d'authentification a été un point de douleur pour les utilisateurs.

Sophie : J'ai déjà commencé à travailler sur un design pour le nouveau flux d'authentification.

Prenons une décision. Sophie dirigera la refonte de l'authentification.

Maintenant, concernant le calendrier du sprint. Vu l'ampleur des changements, je propose d'étendre le sprint actuel de deux jours.

Équipe : Oui, ça semble raisonnable.

Excellent. C'est donc décidé. Nous prolongeons le sprint de deux jours.

Avant de terminer, notons quelques actions :
- Sophie : Compléter le design de l'API d'authentification d'ici vendredi prochain
- Michel : Mettre à jour la documentation du projet d'ici mercredi
- David : Planifier la réunion de revue avec les parties prenantes pour lundi

Y a-t-il autre chose ?

Jean : Nous attendons toujours l'approbation de l'équipe sécurité.

Noté. Je les relancerai aujourd'hui.

Très bien, excellente réunion. Retrouvons-nous la semaine prochaine.
`.trim();
}
