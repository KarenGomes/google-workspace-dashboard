/**
 * @module useCalendar
 * @description Fetches today's Calendar events.
 * Auto-fetches when user becomes authenticated; resets on sign-out.
 * Returns: { events, loading, error, refetch }
 */
import { useCallback, useEffect, useState } from 'react';
import { createLogger } from '../utils/logger';
import { fetchTodayEvents } from '../services/calendarService';
import { useAuth } from '../context/AuthContext';

const log = createLogger('useCalendar');

const INIT = { events: null, loading: false, error: null };


export function useCalendar() {
  const { status } = useAuth();
  const [state, setState] = useState(INIT);

  const fetch = useCallback(async () => {
    log.info('Fetching Calendar events');
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const events = await fetchTodayEvents();
      setState({ events, loading: false, error: null });
      log.info(`${events.length} events loaded`);
    } catch (err) {
      log.error('Calendar fetch failed', err);
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetch();
    if (status === 'ready') setState(INIT);
  }, [status, fetch]);

  return { ...state, refetch: fetch };
}
