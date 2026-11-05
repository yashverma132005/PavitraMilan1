export default function Loader({ size = '', text = '' }) {
  return (
    <div className="flex-center flex-col gap-md" style={{ padding: '2rem' }}>
      <div className={`loader ${size ? `loader-${size}` : ''}`} />
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  );
}

export function FullPageLoader({ text = 'Loading...' }) {
  return (
    <div className="loader-fullpage">
      <div className="loader loader-lg" />
      <p className="loader-text">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1rem' }}>
      <div className="skeleton skeleton-avatar" style={{ width: 64, height: 64, marginBottom: 12 }} />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div className="skeleton skeleton-text" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />
    </div>
  );
}
