import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Validate that the API key is configured
if (!process.env.GOOGLE_GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn('WARNING: GOOGLE_GEMINI_API_KEY no esta configurada. Configure su API key en el archivo .env.local');
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY })],
  model: 'googleai/gemini-2.0-flash',
});
