/**
 * @module googleAuth
 * @description Loads GSI + GAPI scripts dynamically, manages token lifecycle.
 * Keeps script loading idempotent — safe to call multiple times.
 */
import { createLogger } from '../utils/logger';

const log = createLogger('googleAuth');

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES    = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
].join(' ');
const DISCOVERY = [
  'https://gmail.googleapis.com/$discovery/rest?version=v1',
  'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s  = document.createElement('script');
    s.src    = src;
    s.async  = true;
    s.onload = () => { log.info(`Script loaded: ${src}`); resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function initGapi() {
  await loadScript('https://apis.google.com/js/api.js');
  await new Promise(res => window.gapi.load('client', res));
  await window.gapi.client.init({ discoveryDocs: DISCOVERY });
  log.info('GAPI client initialised');
}

export async function initGsi() {
  await loadScript('https://accounts.google.com/gsi/client');
  log.info('GSI client initialised');
}

/** Returns a configured tokenClient. callback(resp) is called on token grant/error. */
export function createTokenClient(callback) {
  return window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope:     SCOPES,
    callback,
  });
}

export function revokeToken() {
  const token = window.gapi?.client.getToken();
  if (!token) return;
  window.google.accounts.oauth2.revoke(token.access_token, () => {
    log.info('Token revoked');
  });
  window.gapi.client.setToken('');
}

export function getToken() {
  return window.gapi?.client.getToken();
}
