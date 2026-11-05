export default function Button({ children, variant = 'primary', size = '', fullWidth = false, loading = false, disabled = false, icon, type = 'button', onClick, className = '', ...props }) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    fullWidth && 'btn-full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...props}>
      {loading && <span className="btn-spinner" />}
      {!loading && icon && <span className="btn-icon-el">{icon}</span>}
      {children}
    </button>
  );
}
