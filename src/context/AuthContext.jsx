/**
 * @module AuthContext
 * @description Manages Google auth lifecycle: script loading → ready → signed-in.
 * Exposes: { user, status, signIn, signOut }
 *   status: 'initialising' | 'ready' | 'loading' | 'authenticated' | 'error'
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createLogger } from '../utils/logger';
import { initGapi, initGsi, createTokenClient, revokeToken } from '../services/googleAuth';
import { fetchProfile } from '../services/gmailService';

const log = createLogger('AuthContext');
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState('initialising');
  const [user,   setUser]   = useState(null);
  const tokenRef = useRef(null);

  /* Load both Google scripts on mount */
  useEffect(() => {
    log.info('Initialising Google SDKs');
    Promise.all([initGapi(), initGsi()])
      .then(() => {
        tokenRef.current = createTokenClient(onToken);
        setStatus('ready');
        log.info('Auth ready');
      })
      .catch(err => {
        log.error('SDK init failed', err);
        setStatus('error');
      });
  }, []);

  const onToken = useCallback(async (resp) => {
    if (resp.error) {
      log.error('Token error:', resp.error);
      setStatus('ready');
      return;
    }
    log.info('Access token received');
    setStatus('loading');
    try {
      const profile = await fetchProfile();
      setUser(profile);
      setStatus('authenticated');
      log.info('Authenticated as:', profile.emailAddress);
    } catch (err) {
      log.error('Profile fetch failed', err);
      setStatus('error');
    }
  }, []);

  const signIn = useCallback(() => {
    if (status !== 'ready') return;
    log.info('signIn requested');
    tokenRef.current?.requestAccessToken({ prompt: 'consent' });
  }, [status]);

  const signOut = useCallback(() => {
    revokeToken();
    setUser(null);
    setStatus('ready');
    log.info('Signed out');
  }, []);

  return (
    <Ctx.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
