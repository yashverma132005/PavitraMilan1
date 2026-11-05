export default function Input({ label, name, type = 'text', value, onChange, error, required, placeholder, icon, className = '', ...props }) {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={icon ? 'input-with-icon' : ''}>
        {icon && <span className="input-icon-left">{icon}</span>}
        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`textarea-field ${error ? 'error' : ''}`}
            {...props}
          />
        ) : isSelect ? (
          <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            className={`select-field ${error ? 'error' : ''}`}
            {...props}
          >
            {props.children}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${error ? 'error' : ''}`}
            {...props}
          />
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
