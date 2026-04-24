import type { DataSnapshot, SkillEntry } from '@skillpulse/core';

export function recommendSimilar(snapshot: DataSnapshot, entry: SkillEntry, n = 5): SkillEntry[] {
  const scored = snapshot.entries
    .filter((e) => e.id !== entry.id)
    .map((e) => {
      let score = 0;
      if (e.category === entry.category) score += 3;
      for (const tag of e.tags) if (entry.tags.includes(tag)) score += 1;
      for (const c of e.compat) if (entry.compat.includes(c)) score += 0.5;
      if (e.kind === entry.kind) score += 1;
      return { e, score };
    })
    .sort((a, b) => b.score - a.score || b.e.pulseScore - a.e.pulseScore)
    .slice(0, n)
    .map((x) => x.e);
  return scored;
}

export function recommendForUser(snapshot: DataSnapshot, userHas: string[], n = 10): SkillEntry[] {
  // userHas: array of names/ids the user already has
  const userSet = new Set(userHas.map((x) => x.toLowerCase()));
  const candidates = snapshot.entries.filter((e) => !userSet.has(e.name.toLowerCase()));

  // Boost entries that share category/tags with user's existing stack
  const userEntries = snapshot.entries.filter((e) => userSet.has(e.name.toLowerCase()));
  const userCategories = new Set(userEntries.map((e) => e.category));
  const userTags = new Set(userEntries.flatMap((e) => e.tags));

  return candidates
    .map((e) => {
      let boost = 0;
      if (userCategories.has(e.category)) boost += 10;
      boost += e.tags.filter((t) => userTags.has(t)).length * 3;
      return { e, rank: e.pulseScore + boost };
    })
    .sort((a, b) => b.rank - a.rank)
    .slice(0, n)
    .map((x) => x.e);
}
