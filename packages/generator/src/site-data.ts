import type { DataSnapshot, SkillEntry } from '@skillpulse/core';

export function getTopTrending(snapshot: DataSnapshot, n = 20): SkillEntry[] {
  return snapshot.entries
    .filter((e) => e.trend === 'rising' || e.trend === 'new')
    .sort((a, b) => b.pulseScore - a.pulseScore)
    .slice(0, n);
}

export function getByCategory(snapshot: DataSnapshot, category: string): SkillEntry[] {
  return snapshot.entries
    .filter((e) => e.category === category)
    .sort((a, b) => b.pulseScore - a.pulseScore);
}

export function getByAgent(snapshot: DataSnapshot, agent: string): SkillEntry[] {
  return snapshot.entries
    .filter((e) => e.compat.includes(agent as SkillEntry['compat'][number]))
    .sort((a, b) => b.pulseScore - a.pulseScore);
}

export function getAllCategories(snapshot: DataSnapshot): string[] {
  return [...new Set(snapshot.entries.map((e) => e.category))].sort();
}

export function getAllAgents(snapshot: DataSnapshot): string[] {
  const agents = new Set<string>();
  for (const entry of snapshot.entries) {
    for (const agent of entry.compat) agents.add(agent);
  }
  return [...agents].sort();
}

export function search(snapshot: DataSnapshot, query: string): SkillEntry[] {
  const q = query.toLowerCase();
  return snapshot.entries.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q)),
  );
}
