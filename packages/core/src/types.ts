export type SkillKind = 'skill' | 'mcp-server' | 'plugin' | 'prompt-pack' | 'cli-tool';
export type AgentCompat =
  | 'claude-code'
  | 'cursor'
  | 'codex-cli'
  | 'gemini-cli'
  | 'windsurf'
  | 'generic';

export interface SkillEntry {
  id: string;
  name: string;
  description: string;
  kind: SkillKind;
  source: 'github' | 'npm' | 'pypi' | 'tokrepo' | 'anthropic-registry' | 'hn' | 'reddit';
  sourceUrl: string;
  author: string;
  stars?: number;
  downloadsWeekly?: number;
  compat: AgentCompat[];
  category: string;
  tags: string[];
  firstSeenAt: string;
  lastUpdatedAt: string;
  pulseScore: number;
  trend: 'rising' | 'stable' | 'declining' | 'new';
}

export interface DataSnapshot {
  generatedAt: string;
  totalEntries: number;
  entries: SkillEntry[];
}
