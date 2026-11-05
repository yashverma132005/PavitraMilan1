import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code text-gradient">404</h1>
        <h2>Page Not Found</h2>
        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)', maxWidth: '400px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">Go Home</Link>
      </div>
    </div>
  );
}
