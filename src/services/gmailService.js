/**
 * @module gmailService
 * @description Thin wrappers around Gmail REST API v1.
 * All functions assume gapi.client is already initialised.
 */
import { createLogger } from '../utils/logger';
import { fmt } from '../utils/dateUtils';

const log = createLogger('gmailService');

export async function fetchProfile() {
  log.info('fetchProfile');
  const r = await window.gapi.client.gmail.users.getProfile({ userId: 'me' });
  log.debug('profile:', r.result.emailAddress);
  return r.result;
}

export async function fetchInboxLabel() {
  log.info('fetchInboxLabel');
  const r = await window.gapi.client.gmail.users.labels.get({ userId: 'me', id: 'INBOX' });
  return r.result;
}

/** Returns approximate email count for a single day via resultSizeEstimate. */
async function fetchDayCount(date) {
  const after  = fmt.dayStart(date);
  const before = fmt.dayEnd(date);
  const r = await window.gapi.client.gmail.users.messages.list({
    userId: 'me', q: `after:${after} before:${before}`, maxResults: 1,
  });
  return r.result.resultSizeEstimate || 0;
}

/**
 * Fetches email counts for the last 7 days (today = index 6).
 * Uses Promise.allSettled so a single day failure does not abort the rest.
 * Returns: { labels: string[], counts: number[] }
 */
export async function fetchWeeklyStats() {
  log.info('fetchWeeklyStats');
  const now    = new Date();
  const labels = [];
  const tasks  = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    labels.push(fmt.weekdayShort(d));
    tasks.push(fetchDayCount(d));
  }

  const settled = await Promise.allSettled(tasks);
  const counts  = settled.map(r => (r.status === 'fulfilled' ? r.value : 0));
  log.debug('weekly counts:', counts);
  return { labels, counts };
}
