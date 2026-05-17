/**
 * @module logger
 * @description Module-scoped logger. Prefixes every log with [Module] tag.
 * Enabled only in development (import.meta.env.DEV). Errors always surface.
 *
 * Usage:
 *   import { createLogger } from '../utils/logger';
 *   const log = createLogger('MyComponent');
 *   log.info('mounted');   log.warn('slow api');   log.error('failed', err);
 */

const isDev = import.meta.env.DEV;

export function createLogger(module) {
  const tag  = `[${module}]`;
  const cyan = 'color:#2dd4bf;font-weight:600';
  const grey = 'color:#7c6fff;font-weight:600';

  return {
    info:  (...a) => isDev && console.log (`%c${tag}`, grey, ...a),
    debug: (...a) => isDev && console.debug(`%c${tag}`, cyan, ...a),
    warn:  (...a) => isDev && console.warn (`${tag}`, ...a),
    error: (...a) => console.error(`${tag}`, ...a),
    group: (label, fn) => {
      if (!isDev) return fn();
      console.groupCollapsed(`%c${tag} ${label}`, grey);
      fn();
      console.groupEnd();
    },
  };
}
