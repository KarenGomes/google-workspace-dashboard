/**
 * @module useGmail
 * @description Fetches Gmail inbox unread count and 7-day email volume.
 * Auto-fetches when user becomes authenticated; resets on sign-out.
 * Returns: { unread, weekly, loading, error, refetch }
 */
import { useCallback, useEffect, useState } from 'react';
import { createLogger } from '../utils/logger';
import { fetchInboxLabel, fetchWeeklyStats } from '../services/gmailService';
import { useAuth } from '../context/AuthContext';

const log = createLogger('useGmail');

const INIT = { unread: null, weekly: null, loading: false, error: null };

export function useGmail() {
  const { status } = useAuth();
  const [state, setState] = useState(INIT);

  const fetch = useCallback(async () => {
    log.info('Fetching Gmail data');
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [label, weekly] = await Promise.all([fetchInboxLabel(), fetchWeeklyStats()]);
      setState({ unread: label.messagesUnread ?? 0, weekly, loading: false, error: null });
      log.info('Gmail data loaded', { unread: label.messagesUnread });
    } catch (err) {
      log.error('Gmail fetch failed', err);
      setState(s => ({ ...s, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetch();
    if (status === 'ready') setState(INIT); // reset on sign-out
  }, [status, fetch]);

  return { ...state, refetch: fetch };
}
