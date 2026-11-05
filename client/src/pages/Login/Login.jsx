import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-visual-panel">
        <div className="visual-overlay" />
        <div className="visual-content">
          <Link to="/" className="navbar-logo" style={{ color: 'white', fontSize: '2.5rem' }}>
            <span>Pavitra <span style={{ color: 'var(--color-primary)' }}>Milan</span></span>
          </Link>
          <h2>Connecting Hearts, Uniting Families</h2>
          <p>Find your perfect match in our trusted matrimonial community. Sign in to discover verified candidates.</p>
        </div>
      </div>
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: '0.5rem' }}>Sign In</h1>
            <p className="text-secondary">Welcome back to Pavitra Milan</p>
          </div>

          <div className="clerk-auth-container">
            <SignIn
              routing="hash"
              forceRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: { width: '100%' },
                  card: {
                    boxShadow: 'none',
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                  },
                  headerTitle: { display: 'none' },
                  headerSubtitle: { display: 'none' },
                  socialButtonsBlockButton: {
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  },
                  formButtonPrimary: {
                    background: 'var(--gradient-primary)',
                    borderRadius: 'var(--radius-md)',
                    textTransform: 'none',
                    fontWeight: '600',
                  },
                  formFieldInput: {
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  },
                  footerActionLink: { color: 'var(--color-primary)' },
                  footer: { display: 'none' },
                },
              }}
            />
          </div>

          <p className="text-center text-sm text-secondary" style={{ marginTop: '2rem' }}>
            New to Pavitra Milan? <Link to="/register" style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-primary)' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
