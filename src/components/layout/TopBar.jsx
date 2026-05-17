/** @component TopBar — brand, current date, user info, theme toggle */
import { fmt } from '../../utils/dateUtils';
import { ThemeToggle } from '../common/ThemeToggle';

const AVATAR_BASE = 'https://ui-avatars.com/api/?background=7c6fff&color=fff&size=64&name=';

export function TopBar({ user, onSignOut }) {
  const today = fmt.fullDate();
  return (
    <header className="topbar" role="banner">
      <div className="topbar__brand">
        <span className="topbar__brand-dot" aria-hidden="true" />
        Meu dashboard
      </div>

      <div className="topbar__right">
        <ThemeToggle />
        <time className="topbar__date" dateTime={new Date().toISOString().split('T')[0]}>
          {today}
        </time>
        {user && (
          <div className="topbar__user" id="topbar-user">
            <img
              className="topbar__avatar"
              src={`${AVATAR_BASE}${encodeURIComponent(user.emailAddress)}`}
              alt={user.emailAddress}
            />
            <span className="topbar__username">{user.emailAddress}</span>
            <button className="topbar__signout" onClick={onSignOut}>Sair</button>
          </div>
        )}
      </div>
    </header>
  );
}
