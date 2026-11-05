import Layout from '../../components/layout/Layout';
import { ShieldCheck, Lock, Users } from 'lucide-react';
import './About.css';

export default function About() {
  const values = [
    { icon: <ShieldCheck size={44} color="var(--color-primary)" />, title: 'Trust & Safety', desc: 'Every profile is verified through email and phone. We take fraudulent profiles extremely seriously.' },
    { icon: <Lock size={44} color="var(--color-primary)" />, title: 'Privacy First', desc: 'Your contact details are never shown publicly. They are shared only after mutual interest acceptance.' },
    { icon: <Users size={44} color="var(--color-primary)" />, title: 'Community Focused', desc: 'Built specifically for our community, with fields for gotra, caste, manglik status, and horoscope details.' },
  ];

  const team = [
    { initials: 'YV', name: 'Yash Verma', role: 'Founder & Developer' },
    { initials: 'RS', name: 'Rohit Sharma', role: 'Product Manager' },
    { initials: 'AP', name: 'Anita Patel', role: 'UI/UX Designer' },
    { initials: 'SK', name: 'Sunil Kumar', role: 'Community Manager' },
  ];

  const steps = [
    { num: '1', title: 'Register', desc: 'Create a secure account with email or phone verification.' },
    { num: '2', title: 'Complete Profile', desc: 'Fill in personal, family, education and lifestyle details.' },
    { num: '3', title: 'Send Interest', desc: 'Browse profiles and send interest to candidates you like.' },
    { num: '4', title: 'View Contacts', desc: 'Once both parties accept, contact details are shared instantly.' },
  ];

  return (
    <Layout isAuthenticated={false}>
      <div className="about-page">
        <section className="about-hero text-center section container">
          <h1 className="text-gradient" style={{ fontSize: 'var(--fs-4xl)', fontFamily: 'var(--font-display)' }}>About Pavitra Milan</h1>
          <p className="text-secondary" style={{ maxWidth: '700px', margin: '1rem auto 0', fontSize: 'var(--fs-lg)', lineHeight: 'var(--lh-relaxed)' }}>
            Pavitra Milan is a trusted matrimonial platform created for our community. We help families find compatible, verified matches with complete transparency and privacy.
          </p>
        </section>

        <section className="section container">
          <div className="about-story-grid">
            <div>
              <h2 style={{ marginBottom: '1rem' }}>Our Story</h2>
              <p className="text-secondary" style={{ lineHeight: 'var(--lh-relaxed)', marginBottom: '1rem' }}>
                Founded in 2026, Pavitra Milan was born from a simple idea — there needed to be a safe, modern, and community-focused matrimonial platform that respects tradition while embracing technology.
              </p>
              <p className="text-secondary" style={{ lineHeight: 'var(--lh-relaxed)' }}>
                Unlike generic matchmaking apps, we focus on verified profiles, transparent contact sharing through mutual acceptance, and comprehensive fields like gotra, manglik status, and family values that matter to our community.
              </p>
            </div>
            <div className="about-shape-container">
              <div className="about-shape" />
            </div>
          </div>
        </section>

        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <h2 className="section-title">How It Works</h2>
            <div className="about-steps-grid">
              {steps.map(s => (
                <div key={s.num} className="about-step">
                  <div className="about-step-num">{s.num}</div>
                  <h4>{s.title}</h4>
                  <p className="text-sm text-secondary">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section container">
          <h2 className="section-title">Our Values</h2>
          <div className="grid grid-3 gap-lg">
            {values.map(v => (
              <div key={v.title} className="card text-center" style={{ padding: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)' }}>{v.icon}</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{v.title}</h3>
                <p className="text-secondary text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <h2 className="section-title">Stats at a Glance</h2>
            <div className="grid grid-4 gap-lg" style={{ marginTop: 'var(--spacing-xl)' }}>
              <div className="stat-card"><div className="stat-card-number">10,000+</div><div className="stat-card-label">Active Profiles</div></div>
              <div className="stat-card"><div className="stat-card-number">5,000+</div><div className="stat-card-label">Happy Matches</div></div>
              <div className="stat-card"><div className="stat-card-number">98%</div><div className="stat-card-label">Satisfaction</div></div>
              <div className="stat-card"><div className="stat-card-number">15+</div><div className="stat-card-label">Cities</div></div>
            </div>
          </div>
        </section>

        <section className="section container">
          <h2 className="section-title">Our Team</h2>
          <div className="grid grid-4 gap-lg" style={{ marginTop: 'var(--spacing-xl)' }}>
            {team.map(t => (
              <div key={t.initials} className="text-center">
                <div className="avatar avatar-xl" style={{ margin: '0 auto var(--spacing-md)', fontSize: '1.5rem' }}>{t.initials}</div>
                <h4>{t.name}</h4>
                <p className="text-sm text-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
