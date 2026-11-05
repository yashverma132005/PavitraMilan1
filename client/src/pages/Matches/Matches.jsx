import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMatches } from '../../services/matchService';
import Layout from '../../components/layout/Layout';
import ProfileCard from '../../components/common/ProfileCard';
import Loader from '../../components/common/Loader';
import { Handshake } from 'lucide-react';
import './Matches.css';

export default function Matches() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);
        const res = await getMatches(1, 50);
        if (res.data?.data) {
          const transformed = res.data.data.map((m) => ({
            id: m.user?.id || m.matchId,
            matchId: m.matchId,
            fullName: m.user?.profile?.fullName || 'Matched User',
            city: m.user?.profile?.city,
            occupation: m.user?.profile?.occupation,
            highestQualification: m.user?.profile?.highestQualification,
            profilePhoto: m.user?.profile?.profilePhoto,
            dateOfBirth: m.user?.profile?.dateOfBirth,
            isMatched: true,
            isVerified: true,
            phone: m.user?.phone || 'Phone not provided',
            matchedDate: m.matchedAt ? new Date(m.matchedAt).toLocaleDateString() : 'Recently',
          }));
          setMatches(transformed);
        }
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setError('Failed to load matches. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="container section">
        <div className="matches-header">
          <h1>Your Matches</h1>
          <span className="badge badge-primary">{matches.length} matches</span>
        </div>
        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
          WhatsApp contact details are shared only for accepted matches.
        </p>

        {loading ? (
          <Loader message="Loading matches..." />
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : matches.length === 0 ? (
          <div className="empty-state text-center" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <Handshake size={48} color="var(--color-primary)" />
            </div>
            <h3>No Matches Yet</h3>
            <p className="text-secondary">
              When someone accepts your interest, your match will appear here with their WhatsApp contact if they provided one.
            </p>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((profile) => (
              <div key={profile.id} className="match-card-wrapper">
                <ProfileCard
                  profile={profile}
                  showContact={true}
                  onViewProfile={(id) => navigate(`/profile/${id}`)}
                />
                <div className="match-date">Matched on {profile.matchedDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
