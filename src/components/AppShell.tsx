import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, Brush, House, Settings, ShoppingBag, Smile } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { parentPath } from '../routes/screens';
import type { Screen } from '../routes/screens';

const tabs = [
  { to: '/', label: '홈', section: 'home', icon: House },
  { to: '/brushing', label: '양치 관리', section: 'brushing', icon: Brush },
  { to: '/products', label: '제품', section: 'products', icon: ShoppingBag },
  { to: '/settings', label: '설정', section: 'settings', icon: Settings },
];

export function AppShell({ screen, children }: { screen?: Screen; children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const main = useRef<HTMLElement>(null);
  const visited = useRef(new Map<number, string>());
  const isHome = location.pathname === '/';
  const dark = screen?.section === 'brushing';

  useLayoutEffect(() => {
    document.title = `${screen?.title ?? '페이지를 찾을 수 없어요'} · Oneway`;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    const index: unknown = window.history.state?.idx;
    if (typeof index === 'number') {
      for (const entry of visited.current.keys()) if (entry > index) visited.current.delete(entry);
      visited.current.set(index, location.key);
    }
  }, [location.key, screen?.title]);

  function goBack() {
    // Only traverse history entries visited during this app session.
    // Direct URLs/reloads use a safe parent rather than leaving the app.
    const index: unknown = window.history.state?.idx;
    if (typeof index === 'number' && visited.current.has(index - 1)) void navigate(-1);
    else void navigate(parentPath(screen, location.pathname), { replace: true });
  }

  return (
    <div className={`app-shell ${dark ? 'theme-dark' : ''}`}>
      <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
      <header className="app-header">
        {isHome ? <span className="header-spacer" aria-hidden="true" /> : (
          <button className="icon-button" onClick={goBack} aria-label="뒤로가기"><ArrowLeft size={22} /></button>
        )}
        <Link className="wordmark" to="/" aria-label="Oneway 홈"><Smile size={23} strokeWidth={1.8} aria-hidden="true" />Oneway</Link>
        <Link className="icon-button" to="/settings" aria-label="설정 열기"><Settings size={21} strokeWidth={1.7} /></Link>
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        {children}
      </main>
      <nav className="bottom-nav" aria-label="주요 메뉴">
        {tabs.map(({ to, label, section, icon: Icon }) => (
          <Link key={to} to={to} className={`tab-link ${screen?.section === section ? 'selected' : ''}`}
            aria-current={screen?.section === section ? 'page' : undefined}>
            <span className="tab-icon"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
