import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import './Navbar.css';

export default function Navbar({ isAuthenticated = false, user = null, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const displayName = user?.profile?.fullName || user?.fullName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);


  const authLinks = [
    { to: '/dashboard', label: t('nav.dashboard') },
    { to: '/search', label: t('nav.search') },
    { to: '/interests', label: t('nav.interests') },
    { to: '/matches', label: t('nav.matches') },
  ];

  const publicLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/login', label: t('nav.login') },
    { to: '/register', label: t('nav.register') },
  ];

  const links = isAuthenticated ? authLinks : publicLinks;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <span>Pavitra <span className="logo-accent">Milan</span></span>
          </Link>

          <div className="navbar-links">
            {links.map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="navbar-actions">
            <div className="navbar-language-toggle">
              <LanguageToggle />
            </div>

            {isAuthenticated && (
              <div className="navbar-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="avatar avatar-sm">{initials}</div>
                <span className="navbar-profile-name">{displayName}</span>

                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <Link to="/profile/edit" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <User size={16} /> {t('nav.profile')}
                    </Link>
                    <Link to="/settings" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <Settings size={16} /> {t('nav.settings')}
                    </Link>
                    <div className="divider" style={{ margin: '0.25rem 0' }} />
                    <button className="navbar-dropdown-item danger" onClick={() => { setDropdownOpen(false); onLogout && onLogout(); }}>
                      <LogOut size={16} /> {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className={`hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div id="mobile-navigation" className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <LanguageToggle />
        <div className="divider" style={{ margin: '0.5rem 0' }} />
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
            {link.label}
          </NavLink>
        ))}
        {isAuthenticated && (
          <>
            <div className="divider" />
            <Link to="/profile/edit" className="navbar-link" onClick={() => setMobileOpen(false)}>{t('nav.profile')}</Link>
            <Link to="/settings" className="navbar-link" onClick={() => setMobileOpen(false)}>{t('nav.settings')}</Link>
            <button className="navbar-link" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', color: 'var(--color-error)' }} onClick={() => { setMobileOpen(false); onLogout && onLogout(); }}>{t('nav.logout')}</button>
          </>
        )}
      </div>
    </>
  );
}
