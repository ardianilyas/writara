import { OpenRouter } from '@openrouter/sdk';
import { env } from './env.js';

export const openRouter = new OpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
  appTitle: 'Writara AI Content Generation Platform',
  httpReferer: env.CLIENT_URL,
});
