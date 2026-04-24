import { createLogger } from '@skillpulse/core';
import type { RawSkillResult } from '@skillpulse/ingestors';
import pRetry from 'p-retry';
import { z } from 'zod';
import { DEFAULT_MODEL, ESCALATION_MODEL, getClient, logCost } from './ai-client.js';
import { CATEGORIES_LIST } from './categories.js';

const logger = createLogger('classifier');

const classificationSchema = z.object({
  description: z.string().min(20).max(200),
  kind: z.enum(['skill', 'mcp-server', 'plugin', 'prompt-pack', 'cli-tool']),
  category: z.string().min(3).max(40),
  tags: z.array(z.string()).min(1).max(8),
  compat: z
    .array(z.enum(['claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'windsurf', 'generic']))
    .min(1),
  confidence: z.number().min(0).max(1),
});

export type ClassificationResult = z.infer<typeof classificationSchema>;

const SYSTEM_PROMPT = `You are a classifier for an AI agent skills registry. Given information about a GitHub repo, npm package, or similar resource, extract structured metadata.

Canonical categories (pick the single closest match): ${CATEGORIES_LIST}

Rules:
- description: concise, informative, max 200 chars, no marketing fluff
- kind: 'mcp-server' if it implements Model Context Protocol, 'skill' if it's a reusable Claude Code skill/command, 'plugin' if it extends an IDE/tool, 'prompt-pack' if it's a collection of prompts, 'cli-tool' otherwise
- compat: which AI coding agents can use this? Be conservative — only list agents that can realistically benefit
- confidence: your confidence in the classification (0.0-1.0)
- tags: lowercase, hyphenated, specific (e.g. 'typescript', 'database-migration', not 'tool', 'useful')`;

async function callClaude(
  raw: RawSkillResult,
  model: string,
): Promise<ClassificationResult | null> {
  const client = getClient();
  const context = [
    `Name: ${raw.name}`,
    `Description: ${raw.rawDescription}`,
    raw.topics?.length ? `Topics: ${raw.topics.join(', ')}` : '',
    raw.language ? `Language: ${raw.language}` : '',
    raw.readmeSnippet ? `README (first 1000 chars): ${raw.readmeSnippet.slice(0, 1000)}` : '',
    `URL: ${raw.url}`,
  ]
    .filter(Boolean)
    .join('\n');

  const response = await client.messages.create({
    model,
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    tools: [
      {
        name: 'classify_skill',
        description: 'Classify this AI agent skill/tool into the registry schema',
        input_schema: {
          type: 'object' as const,
          properties: {
            description: { type: 'string', description: 'Concise description, max 200 chars' },
            kind: {
              type: 'string',
              enum: ['skill', 'mcp-server', 'plugin', 'prompt-pack', 'cli-tool'],
            },
            category: { type: 'string', description: `One of: ${CATEGORIES_LIST}` },
            tags: { type: 'array', items: { type: 'string' }, description: 'Up to 8 tags' },
            compat: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['claude-code', 'cursor', 'codex-cli', 'gemini-cli', 'windsurf', 'generic'],
              },
            },
            confidence: { type: 'number', description: 'Classification confidence 0-1' },
          },
          required: ['description', 'kind', 'category', 'tags', 'compat', 'confidence'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'classify_skill' },
    messages: [{ role: 'user', content: context }],
  });

  await logCost({
    model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  });

  const toolUse = response.content.find((c) => c.type === 'tool_use');
  if (!toolUse || toolUse.type !== 'tool_use') return null;

  const parsed = classificationSchema.safeParse(toolUse.input);
  if (!parsed.success) {
    logger.warn({ msg: 'Invalid classification schema', errors: parsed.error.issues });
    return null;
  }
  return parsed.data;
}

export async function classifyEntry(raw: RawSkillResult): Promise<ClassificationResult | null> {
  return pRetry(
    async () => {
      let result = await callClaude(raw, DEFAULT_MODEL);

      if (!result) {
        logger.warn({ msg: 'Classification failed, trying sonnet', name: raw.name });
        result = await callClaude(raw, ESCALATION_MODEL);
      } else if (result.confidence < 0.7) {
        logger.info({
          msg: 'Low confidence, escalating to sonnet',
          name: raw.name,
          confidence: result.confidence,
        });
        const escalated = await callClaude(raw, ESCALATION_MODEL);
        if (escalated) result = escalated;
      }

      return result;
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 30_000,
      factor: 2,
      shouldRetry: (err) => {
        const msg = String(err);
        // Retry on rate limits and server errors
        return msg.includes('429') || msg.includes('529') || msg.includes('overloaded');
      },
    },
  );
}
