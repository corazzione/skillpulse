import pRetry from 'p-retry';

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
): Promise<Response> {
  return pRetry(
    async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'User-Agent': 'SkillPulse-Bot/1.0 (https://github.com/corazzione/skillpulse)',
            ...options.headers,
          },
        });
        if (!response.ok && response.status !== 404) {
          throw new Error(`HTTP ${response.status}: ${url}`);
        }
        return response;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    {
      retries,
      minTimeout: 1000,
      maxTimeout: 30_000,
      factor: 2,
      onFailedAttempt: (error) => {
        console.error(
          JSON.stringify({
            level: 'warn',
            msg: `Attempt ${error.attemptNumber} failed. Retrying...`,
            url,
            error: error.message,
          }),
        );
      },
    },
  );
}

export function normalizeGithubUrl(url: string): string {
  return url.replace(/\/$/, '').toLowerCase();
}

export function dedupeByUrl<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const normalized = normalizeGithubUrl(item.url);
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}
