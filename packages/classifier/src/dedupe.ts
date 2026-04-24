import type { SkillEntry } from '@skillpulse/core';

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const prev = dp[i - 1];
      const curr = dp[i];
      const diag = prev?.[j - 1] ?? 0;
      const top = prev?.[j] ?? 0;
      const left = curr?.[j - 1] ?? 0;
      if (curr) {
        curr[j] = a[i - 1] === b[j - 1] ? diag : 1 + Math.min(top, left, diag);
      }
    }
  }
  return dp[m]?.[n] ?? 0;
}

function normalizeUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
}

export function dedupeEntries(entries: SkillEntry[]): SkillEntry[] {
  const result: SkillEntry[] = [];
  const seenUrls = new Map<string, number>(); // normalizedUrl -> index in result

  for (const entry of entries) {
    const normalizedUrl = normalizeUrl(entry.sourceUrl);

    // Check exact URL match
    if (seenUrls.has(normalizedUrl)) {
      const existingIdx = seenUrls.get(normalizedUrl) ?? -1;
      const existing = result[existingIdx];
      // Keep the one with more stars
      if (existing && (entry.stars ?? 0) > (existing.stars ?? 0)) {
        result[existingIdx] = {
          ...entry,
          firstSeenAt: existing.firstSeenAt, // preserve original discovery date
        };
      }
      continue;
    }

    // Check similar name + same author (fuzzy)
    let merged = false;
    for (let i = 0; i < result.length; i++) {
      const existing = result[i];
      if (
        existing &&
        existing.author === entry.author &&
        levenshtein(existing.name.toLowerCase(), entry.name.toLowerCase()) < 3
      ) {
        // Merge: keep higher-star entry
        if ((entry.stars ?? 0) > (existing.stars ?? 0)) {
          result[i] = { ...entry, firstSeenAt: existing.firstSeenAt };
          seenUrls.set(normalizedUrl, i);
        }
        merged = true;
        break;
      }
    }

    if (!merged) {
      seenUrls.set(normalizedUrl, result.length);
      result.push(entry);
    }
  }

  return result;
}
