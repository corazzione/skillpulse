import { appendFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { createLogger } from '@skillpulse/core';

const logger = createLogger('ai-client');

export const DEFAULT_MODEL = 'claude-haiku-4-5' as const;
export const ESCALATION_MODEL = 'claude-sonnet-4-6' as const;

let _client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is required');
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

export async function logCost(opts: {
  model: string;
  inputTokens: number;
  outputTokens: number;
}): Promise<void> {
  const entry = {
    timestamp: new Date().toISOString(),
    model: opts.model,
    inputTokens: opts.inputTokens,
    outputTokens: opts.outputTokens,
    // Haiku: $0.25/M input, $1.25/M output; Sonnet: $3/M input, $15/M output
    estimatedUSD:
      opts.model === DEFAULT_MODEL
        ? opts.inputTokens * 0.00000025 + opts.outputTokens * 0.00000125
        : opts.inputTokens * 0.000003 + opts.outputTokens * 0.000015,
  };

  try {
    const today = new Date().toISOString().split('T')[0];
    const logDir = join(process.cwd(), 'data', 'logs');
    await mkdir(logDir, { recursive: true });
    await appendFile(join(logDir, `cost-${today}.jsonl`), `${JSON.stringify(entry)}\n`, 'utf-8');
  } catch (err) {
    logger.warn({ msg: 'Failed to write cost log', error: String(err) });
  }
}
