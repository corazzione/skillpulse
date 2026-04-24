import pino from 'pino';

export function createLogger(module: string) {
  const isDev = process.env.NODE_ENV === 'development';
  return pino({
    name: module,
    level: process.env.LOG_LEVEL ?? 'info',
    ...(isDev ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {}),
  });
}

export type Logger = ReturnType<typeof createLogger>;
