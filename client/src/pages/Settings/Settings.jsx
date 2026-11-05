import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Button from '../../components/common/Button';
import { User, Key, Lock, Bell, AlertTriangle } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [toggles, setToggles] = useState({
    showProfile: true,
    contactAfterMatch: true,
    emailNotif: true,
    interestAlert: true,
    matchAlert: true,
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Key },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const name = user?.profile?.fullName || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="container section">
        <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Settings</h1>
        <div className="settings-layout">
          <aside className="settings-sidebar">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  className={`settings-nav-item ${activeSection === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Icon size={16} />
                  <span>{s.label}</span>
                </button>
              );
            })}
          </aside>
          <div className="settings-content">
            {activeSection === 'profile' && (
              <div className="settings-card card">
                <h2>Profile</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                  <div className="avatar avatar-xl">
                    {user?.profile?.profilePhoto ? (
                      <img src={user.profile.profilePhoto} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      initials
                    )}
                  </div>
                  <div>
                    <h3>{name}</h3>
                    <p className="text-secondary text-sm">{email}</p>
                    <Link to="/profile/edit" style={{ fontSize: 'var(--fs-sm)', marginTop: '4px', display: 'inline-block' }}>
                      Edit Profile →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="settings-card card">
                <h2>Account Information</h2>
                <div style={{ marginTop: '1.5rem' }}>
                  <p className="text-secondary">
                    Your account is managed securely via Clerk. To update your password, email, or multi-factor authentication settings, please use the account profile options.
                  </p>
                  <Button variant="outline" onClick={logout} style={{ marginTop: '1rem' }}>
                    Sign Out of Account
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="settings-card card">
                <h2>Privacy</h2>
                <div className="toggle-row">
                  <div>
                    <h4>Show Profile in Search</h4>
                    <p className="text-sm text-muted">Your profile will appear in community browse results</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={toggles.showProfile} onChange={() => handleToggle('showProfile')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <h4>Share Contact Only After Match</h4>
                    <p className="text-sm text-muted">Phone number and email are shared only when both users accept interest</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={toggles.contactAfterMatch} onChange={() => handleToggle('contactAfterMatch')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="settings-card card">
                <h2>Notifications</h2>
                <div className="toggle-row">
                  <div>
                    <h4>Email Notifications</h4>
                    <p className="text-sm text-muted">Receive match and interest updates via email</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={toggles.emailNotif} onChange={() => handleToggle('emailNotif')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <h4>Interest Alerts</h4>
                    <p className="text-sm text-muted">Get notified when someone sends you an interest</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={toggles.interestAlert} onChange={() => handleToggle('interestAlert')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <h4>Match Alerts</h4>
                    <p className="text-sm text-muted">Get notified when you form a new match</p>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={toggles.matchAlert} onChange={() => handleToggle('matchAlert')} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'danger' && (
              <div className="settings-card card danger-zone">
                <h2>Danger Zone</h2>
                <p className="text-secondary" style={{ margin: '1rem 0' }}>
                  Signing out will end your current session.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button variant="danger" onClick={logout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
