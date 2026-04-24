export const CANONICAL_CATEGORIES = [
  'developer-tooling',
  'testing',
  'database',
  'design',
  'observability',
  'security',
  'documentation',
  'ci-cd',
  'deployment',
  'ai-ml',
  'browser-automation',
  'file-ops',
  'version-control',
  'content-creation',
  'productivity',
  'api-integration',
  'data-analysis',
  'translation',
  'code-review',
  'refactoring',
  'orchestration',
  'other',
] as const;

export type Category = (typeof CANONICAL_CATEGORIES)[number];

export const CATEGORIES_LIST = CANONICAL_CATEGORIES.join(', ');
