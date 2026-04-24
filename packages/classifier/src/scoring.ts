import type { SkillEntry } from '@skillpulse/core';

function normalizedStars(stars: number): number {
  if (stars <= 0) return 0;
  return Math.min(Math.log10(stars + 1) / Math.log10(10001), 1);
}

function recencyBoost(firstSeenAt: string): number {
  const daysSince = (Date.now() - new Date(firstSeenAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince <= 30) return 1.0;
  if (daysSince <= 90) return 0.7;
  if (daysSince <= 180) return 0.4;
  return 0.2;
}

export function computePulseScore(entry: SkillEntry, history: SkillEntry[]): number {
  const historical = history.find((h) => h.id === entry.id);
  const growthRate = historical?.stars
    ? Math.max(0, ((entry.stars ?? 0) - historical.stars) / Math.max(historical.stars, 1))
    : 0;

  const score =
    0.3 * normalizedStars(entry.stars ?? 0) * 100 +
    0.25 * Math.min(growthRate * 100, 100) +
    0.2 * recencyBoost(entry.firstSeenAt) * 100 +
    0.15 * 0 + // cross-source bonus: will be enhanced when we track cross-source in pipeline
    0.1 * (entry.pulseScore ?? 50); // use existing confidence as placeholder

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function computeTrend(entry: SkillEntry, history: SkillEntry[]): SkillEntry['trend'] {
  const historical = history.find((h) => h.id === entry.id);
  if (!historical) return 'new';

  const oldScore = historical.pulseScore;
  const newScore = entry.pulseScore;
  const delta = oldScore > 0 ? (newScore - oldScore) / oldScore : 0;

  if (delta > 0.15) return 'rising';
  if (delta < -0.15) return 'declining';
  return 'stable';
}
