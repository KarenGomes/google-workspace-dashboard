/**
 * @module calendarService
 * @description Thin wrapper around Google Calendar API v3.
 * All functions assume gapi.client is already initialised.
 */
import { createLogger } from '../utils/logger';
import { fmt } from '../utils/dateUtils';

const log = createLogger('calendarService');

/** Returns all primary calendar events for today, ordered by start time. */
export async function fetchTodayEvents() {
  log.info('fetchTodayEvents');
  const r = await window.gapi.client.calendar.events.list({
    calendarId:   'primary',
    timeMin:      fmt.isoStart(),
    timeMax:      fmt.isoEnd(),
    singleEvents: true,
    orderBy:      'startTime',
  });
  const items = r.result.items || [];
  log.debug(`${items.length} events today`);
  return items;
}

/**
 * Returns all events for a given month.
 * @param {number} year  — full year (e.g. 2026)
 * @param {number} month — 0-indexed (0 = January)
 */
export async function fetchMonthEvents(year, month) {
  log.info(`fetchMonthEvents ${year}/${month + 1}`);
  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 1).toISOString();
  const r = await window.gapi.client.calendar.events.list({
    calendarId:   'primary',
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy:      'startTime',
    maxResults:   250,
  });
  const items = r.result.items || [];
  log.debug(`${items.length} events in month`);
  return items;
}

