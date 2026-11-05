import Layout from '../../components/layout/Layout';
import { Calendar } from 'lucide-react';
import './PrivacyPolicy.css';


const sections = [
  { id: 'info-collect', title: 'Information We Collect', content: 'We collect personal information you provide during registration, including your name, email address, phone number, date of birth, photos, and profile details such as religion, caste, occupation, and family background. We also collect usage data including how you interact with profiles, interests sent and received, and device information such as IP address, browser type, and operating system.' },
  { id: 'how-we-use', title: 'How We Use Your Information', content: 'We use your information to create and maintain your profile, match you with potential partners based on your preferences, facilitate interest requests, and share contact details only upon mutual acceptance. We also use data to improve our services, send notifications about new matches and interests, and ensure platform security.' },
  { id: 'data-sharing', title: 'Data Sharing', content: 'We do not sell your personal data to third parties. Your contact information (phone number, email) is only shared with other users when both parties have mutually accepted an interest request. We may share anonymized data with analytics providers and comply with legal obligations when required by law enforcement or court orders.' },
  { id: 'data-security', title: 'Data Security', content: 'We implement industry-standard security measures including encryption of data in transit (SSL/TLS) and at rest, secure password hashing, rate limiting to prevent abuse, and regular security audits. Access to user data is restricted to authorized personnel only.' },
  { id: 'your-rights', title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal information at any time through your account settings. You can deactivate or permanently delete your account. You may request a copy of all data we hold about you. You can opt out of marketing communications while still receiving essential service notifications.' },
  { id: 'cookies', title: 'Cookies', content: 'We use essential cookies for authentication and session management, and preference cookies to remember your preferences and language settings. We do not use third-party tracking cookies for advertising purposes. You can manage cookie preferences in your browser settings.' },
  { id: 'updates', title: 'Updates to This Policy', content: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or an in-app notification. The "Last Updated" date at the top of this page indicates when the policy was last revised.' },
  { id: 'contact', title: 'Contact Us', content: 'If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at support@pavitramilan.com or write to us at Pavitra Milan, Indore, Madhya Pradesh, India 452001.' },
];

export default function PrivacyPolicy() {
  return (
    <Layout isAuthenticated={false}>
      <div className="privacy-page container section">
        <div className="privacy-layout">
          <aside className="privacy-toc">
            <h3>Contents</h3>
            <nav>
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="toc-link">{s.title}</a>
              ))}
            </nav>
          </aside>
          <article className="privacy-article">
            <h1>Privacy Policy</h1>
            <p className="privacy-updated" style={{ marginBottom: 'var(--spacing-2xl)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Last Updated: July 20, 2026
            </p>
            <p style={{ marginBottom: 'var(--spacing-2xl)', lineHeight: 'var(--lh-relaxed)' }}>
              At Pavitra Milan, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our matrimonial platform.
            </p>
            {sections.map(s => (
              <section key={s.id} id={s.id} className="privacy-section">
                <h2>{s.title}</h2>
                <p>{s.content}</p>
              </section>
            ))}
          </article>
        </div>
      </div>
    </Layout>
  );
}
