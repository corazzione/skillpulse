export type AgentId = 'claude-code' | 'cursor' | 'windsurf' | 'codex-cli' | 'gemini-cli';

export interface DetectedEntry {
  name: string;
  kind: 'mcp-server' | 'skill' | 'plugin' | 'prompt-pack';
  detectedBy: AgentId;
  sourceHint?: string;
}
