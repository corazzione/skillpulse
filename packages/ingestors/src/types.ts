import type { SkillEntry } from '@skillpulse/core';

export interface RawSkillResult {
  source: SkillEntry['source'];
  sourceId: string;
  name: string;
  rawDescription: string;
  url: string;
  author: string;
  stars?: number;
  downloads?: number;
  stargazersThisWeek?: number;
  topics?: string[];
  updatedAt: string;
  language?: string;
  readmeSnippet?: string;
}

export interface Ingestor {
  name: string;
  fetch(opts: { since?: string }): Promise<RawSkillResult[]>;
}
