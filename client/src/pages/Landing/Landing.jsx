import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Handshake, PhoneCall } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../../components/layout/LanguageToggle';
import Footer from '../../components/layout/Footer';
import './Landing.css';

export default function Landing() {
  const [stats, setStats] = useState({ profiles: 0, matches: 0, satisfaction: 0, cities: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const statsRef = useRef(null);
  const { t } = useLanguage();

  const testimonials = [
    { name: "Aarav & Ishita", location: "Indore", text: "Finding someone from the same community with matching values was so easy. Highly recommend Pavitra Milan!" },
    { name: "Kabir & Riya", location: "Bhopal", text: "We connected through the accepted interest contact sharing feature. Simple, transparent, and direct!" },
    { name: "Aditya & Sneha", location: "Ujjain", text: "The profile verification process gives peace of mind. We found our soulmate within 3 months." }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let p = 0, m = 0, s = 0, c = 0;
        const interval = setInterval(() => {
          let updated = false;
          if (p < 10000) { p += 250; updated = true; }
          if (m < 5000) { m += 125; updated = true; }
          if (s < 98) { s += 2; updated = true; }
          if (c < 15) { c += 1; updated = true; }
          
          setStats({ profiles: Math.min(p, 10000), matches: Math.min(m, 5000), satisfaction: Math.min(s, 98), cities: Math.min(c, 15) });
          if (!updated) clearInterval(interval);
        }, 30);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="navbar-logo">
            <span>Pavitra <span className="logo-accent">Milan</span></span>
          </Link>
          <div className="landing-nav-links">
            <LanguageToggle />
            <Link to="/about" className="landing-nav-link">{t('nav.about')}</Link>
            <Link to="/login" className="landing-nav-link">{t('nav.login')}</Link>
            <Link to="/register" className="btn btn-primary btn-sm">{t('nav.register')}</Link>
          </div>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content container">
          <h1 className="animate-fadeInUp">
            {t('landing.heroTitle1')} <br />
            <span className="text-gradient">{t('landing.heroTitle2')}</span>
          </h1>
          <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t('landing.heroSubtitle')}
          </p>
          <div className="hero-buttons animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link to="/register" className="btn btn-primary btn-lg">{t('landing.getStarted')}</Link>
            <Link to="/about" className="btn btn-outline btn-lg">{t('landing.learnMore')}</Link>
          </div>
        </div>
        <div className="floating-hearts">
          <div className="heart"><Heart size={28} fill="currentColor" /></div>
          <div className="heart"><Heart size={20} fill="currentColor" /></div>
          <div className="heart"><Heart size={36} fill="currentColor" /></div>
          <div className="heart"><Heart size={24} fill="currentColor" /></div>
        </div>
      </header>

      <section className="stats-section" ref={statsRef}>
        <div className="container grid grid-4">
          <div className="stat-item">
            <div className="stat-number">{stats.profiles.toLocaleString()}+</div>
            <div className="stat-label">{t('landing.statsProfiles')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.matches.toLocaleString()}+</div>
            <div className="stat-label">{t('landing.statsMatches')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.satisfaction}%</div>
            <div className="stat-label">{t('landing.statsSatisfaction')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.cities}+</div>
            <div className="stat-label">{t('landing.statsCities')}</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t('landing.whyTitle')}</h2>
        <p className="section-subtitle">{t('landing.whySubtitle')}</p>
        <div className="grid grid-3 gap-lg">
          <div className="feature-card glass-card text-center">
            <div className="feature-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <ShieldCheck size={40} color="var(--color-primary)" />
            </div>
            <h3>{t('landing.featureVerified')}</h3>
            <p>{t('landing.featureVerifiedDesc')}</p>
          </div>
          <div className="feature-card glass-card text-center">
            <div className="feature-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <Handshake size={40} color="var(--color-primary)" />
            </div>
            <h3>{t('landing.featureMatching')}</h3>
            <p>{t('landing.featureMatchingDesc')}</p>
          </div>
          <div className="feature-card glass-card text-center">
            <div className="feature-icon" style={{ display: 'flex', justifyContent: 'center' }}>
              <PhoneCall size={40} color="var(--color-primary)" />
            </div>
            <h3>{t('landing.featureContact')}</h3>
            <p>{t('landing.featureContactDesc')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">{t('landing.howTitle')}</h2>
          <p className="section-subtitle">{t('landing.howSubtitle')}</p>
          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>{t('landing.step1Title')}</h4>
              <p>{t('landing.step1Desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>{t('landing.step2Title')}</h4>
              <p>{t('landing.step2Desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>{t('landing.step3Title')}</h4>
              <p>{t('landing.step3Desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h4>{t('landing.step4Title')}</h4>
              <p>{t('landing.step4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container text-center">
        <h2 className="section-title">{t('landing.successTitle')}</h2>
        <div className="testimonial-container glass-card">
          <div className="quote-mark">"</div>
          <p className="testimonial-text">{testimonials[activeTestimonial].text}</p>
          <h4 className="testimonial-author">{testimonials[activeTestimonial].name}</h4>
          <span className="testimonial-location">{testimonials[activeTestimonial].location}</span>
        </div>
      </section>

      <section className="cta-section">
        <div className="container text-center">
          <h2>{t('landing.ctaTitle')}</h2>
          <p>{t('landing.ctaSubtitle')}</p>
          <Link to="/register" className="btn btn-secondary btn-lg" style={{ marginTop: '1.5rem' }}>{t('landing.ctaButton')}</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
