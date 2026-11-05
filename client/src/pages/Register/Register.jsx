import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import './Register.css';

export default function Register() {
  return (
    <div className="register-container">
      <div className="register-visual-panel">
        <div className="visual-overlay" />
        <div className="visual-content">
          <Link to="/" className="navbar-logo" style={{ color: 'white', fontSize: '2.5rem' }}>
            <span>Pavitra <span style={{ color: 'var(--color-primary)' }}>Milan</span></span>
          </Link>
          <h2>Begin Your Journey to Finding Love</h2>
          <p>Create an account and build your profile to connect with verified, like-minded partner seekers.</p>
          <div className="visual-features">
            <div className="visual-feature"><span><Check size={16} /></span> Verified Profiles</div>
            <div className="visual-feature"><span><Check size={16} /></span> Community-Based Matching</div>
            <div className="visual-feature"><span><Check size={16} /></span> Secure & Private</div>
          </div>
        </div>
      </div>
      <div className="register-form-panel">
        <div className="register-form-wrapper">
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: 'var(--fs-3xl)', marginBottom: '0.5rem' }}>Create Account</h1>
            <p className="text-secondary">Join Pavitra Milan and find your perfect match</p>
          </div>

          <div className="clerk-auth-container">
            <SignUp
              routing="hash"
              forceRedirectUrl="/profile/create"
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
            Already have an account? <Link to="/login" style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-primary)' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
