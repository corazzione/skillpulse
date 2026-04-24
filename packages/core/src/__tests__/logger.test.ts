import { describe, expect, it } from 'vitest';
import { createLogger } from '../logger.js';

describe('logger', () => {
  it('exports createLogger function', () => {
    expect(typeof createLogger).toBe('function');
  });

  it('creates a logger with module name', () => {
    const logger = createLogger('test');
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
  });
});
