import { useLanguage } from '../../context/LanguageContext';
import './LanguageToggle.css';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      className="lang-toggle"
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
      title={language === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
    >
      <span className="lang-toggle-track">
        <span className={`lang-toggle-option ${language === 'en' ? 'active' : ''}`}>EN</span>
        <span className={`lang-toggle-option ${language === 'hi' ? 'active' : ''}`}>हिन्दी</span>
        <span
          className="lang-toggle-slider"
          style={{ transform: language === 'hi' ? 'translateX(100%)' : 'translateX(0)' }}
        />
      </span>
    </button>
  );
}
