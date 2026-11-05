import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMatches } from '../../services/matchService';
import { getReceivedInterests, getSentInterests, acceptInterest, rejectInterest, sendInterest } from '../../services/interestService';
import { getRecommendedProfiles } from '../../services/profileService';
import Layout from '../../components/layout/Layout';
import ProfileCard from '../../components/common/ProfileCard';
import Loader from '../../components/common/Loader';
import { getProfileCompletenessDetails } from '../../utils/profileCompleteness';
import { Sparkles, Heart, Handshake, MapPin, Check, X } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [interests, setInterests] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [sentInterestsMap, setSentInterestsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [matchesRes, interestsRes, sentRes] = await Promise.allSettled([
          getMatches(1, 10),
          getReceivedInterests(1, 10),
          getSentInterests(1, 50),
        ]);

        if (sentRes.status === 'fulfilled' && sentRes.value.data?.data) {
          const map = {};
          sentRes.value.data.data.forEach((item) => {
            const rId = item.receiver?.id || item.receiverId;
            if (rId) map[rId] = true;
          });
          setSentInterestsMap((prev) => ({ ...map, ...prev }));
        }

        // Fetch a fixed set of recommendations; user-provided search filters are disabled.
        try {
          const recRes = await getRecommendedProfiles();
          if (recRes.data?.data) {
            setRecommended(recRes.data.data);
          }
        } catch (recErr) {
          console.error('Failed to load recommendations:', recErr);
        }

        if (matchesRes.status === 'fulfilled' && matchesRes.value.data?.data) {
          const transformed = matchesRes.value.data.data.map((m) => ({
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
            phone: m.user?.phone || 'Phone shared upon match',
          }));
          setMatches(transformed);
        }

        if (interestsRes.status === 'fulfilled' && interestsRes.value.data?.data) {
          setInterests(interestsRes.value.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load some dashboard data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    let isMounted = true;
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user?.profile?.gender]);

  const handleAccept = async (interestId) => {
    try {
      await acceptInterest(interestId);
      setInterests((prev) => prev.filter((i) => i.id !== interestId));
      // Refresh matches
      const matchesRes = await getMatches(1, 10);
      if (matchesRes.data?.data) {
        const transformed = matchesRes.data.data.map((m) => ({
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
          phone: m.user?.phone || 'Phone shared upon match',
        }));
        setMatches(transformed);
      }
    } catch (err) {
      console.error('Failed to accept interest:', err);
    }
  };

  const handleReject = async (interestId) => {
    try {
      await rejectInterest(interestId);
      setInterests((prev) => prev.filter((i) => i.id !== interestId));
    } catch (err) {
      console.error('Failed to reject interest:', err);
    }
  };

  const handleSendInterest = async (targetUserId) => {
    try {
      await sendInterest(targetUserId);
      setSentInterestsMap((prev) => ({ ...prev, [targetUserId]: true }));
    } catch (err) {
      if (err.response?.status === 409) {
        setSentInterestsMap((prev) => ({ ...prev, [targetUserId]: true }));
      } else {
        console.error('Failed to send interest:', err);
        alert(err.response?.data?.message || 'Failed to send interest request');
      }
    }
  };

  const displayName = user?.profile?.fullName || user?.email?.split('@')[0] || 'User';
  const completionDetails = getProfileCompletenessDetails(user?.profile);
  const completionPercent = completionDetails.percent;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (completionPercent / 100) * circumference;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="dashboard-page">
        <div className="container">
          {/* Welcome Banner */}
          <section className="welcome-banner animate-fadeInUp">
            <div className="welcome-content">
              <h1 className="welcome-title">
                Welcome back, <span className="text-gradient">{displayName}!</span>
              </h1>
              <p className="welcome-date">{dateStr}</p>
              <p className="welcome-subtitle">
                You have <strong>{interests.length} interests</strong> and <strong>{matches.length} matches</strong>
              </p>
            </div>
            <div className="welcome-decorative">
              <span className="welcome-emoji"><Sparkles size={36} color="var(--color-secondary)" /></span>
            </div>
          </section>

          {/* Profile Completion + Stats Row */}
          <section className="dashboard-overview">
            {/* Profile Completion Card */}
            <div className="completion-card glass-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="completion-ring-wrapper">
                <svg className="completion-ring" viewBox="0 0 120 120">
                  <circle
                    className="completion-ring-bg"
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="8"
                  />
                  <circle
                    className="completion-ring-progress"
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                  />
                  <text x="60" y="56" className="completion-ring-text" textAnchor="middle">
                    {completionPercent}%
                  </text>
                  <text x="60" y="72" className="completion-ring-subtext" textAnchor="middle">
                    Complete
                  </text>
                </svg>
              </div>
              <div className="completion-info">
                <h3>{completionPercent === 100 ? 'Profile Complete!' : 'Complete Your Profile'}</h3>
                <p>
                  {completionPercent === 100
                    ? 'Your profile is 100% complete and fully optimized for matches'
                    : completionDetails.missing.length > 0
                    ? `Add ${completionDetails.missing.slice(0, 2).join(', ')} to boost your visibility`
                    : 'Add more details to get better matches'}
                </p>
                <Link to={user?.profile ? '/profile/edit' : '/profile/create'} className="btn btn-primary btn-sm">
                  {completionPercent === 100 ? 'Edit Profile →' : 'Complete Now →'}
                </Link>
              </div>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-card animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                <div className="stat-card-icon"><Heart size={24} color="var(--color-primary)" /></div>
                <div className="stat-card-number">{interests.length}</div>
                <div className="stat-card-label">Interests Received</div>
              </div>
              <div className="stat-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="stat-card-icon"><Handshake size={24} color="var(--color-primary)" /></div>
                <div className="stat-card-number">{matches.length}</div>
                <div className="stat-card-label">Matches</div>
              </div>
            </div>
          </section>

          {loading ? (
            <Loader message="Loading dashboard..." />
          ) : (
            <>
              {error && (
                <div className="alert alert-warning" style={{ margin: '1rem 0' }}>
                  {error}
                </div>
              )}

              {/* Recent Matches */}
              <section className="dashboard-section animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <div className="section-header">
                  <h2>Recent Matches</h2>
                  <Link to="/matches" className="section-link">View All →</Link>
                </div>
                {matches.length === 0 ? (
                  <p className="text-secondary" style={{ padding: '1rem 0' }}>
                    No matches yet. Send interests or accept incoming interests to match with users!
                  </p>
                ) : (
                  <div className="scroll-row">
                    {matches.map((profile) => (
                      <div className="scroll-item" key={profile.id}>
                        <ProfileCard
                          profile={profile}
                          showContact={true}
                          onViewProfile={(id) => navigate(`/profile/${id}`)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* New Interests */}
              <section className="dashboard-section animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
                <div className="section-header">
                  <h2>New Interests</h2>
                  <Link to="/interests" className="section-link">View All →</Link>
                </div>
                {interests.length === 0 ? (
                  <p className="text-secondary" style={{ padding: '1rem 0' }}>
                    No pending interests received yet.
                  </p>
                ) : (
                  <div className="interests-list">
                    {interests.map((interest) => {
                      const senderProfile = interest.sender?.profile;
                      const senderName = senderProfile?.fullName || 'Interested Candidate';
                      const initials = senderName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                      const city = senderProfile?.city || 'Location not specified';

                      return (
                        <div className="interest-item glass-card" key={interest.id}>
                          <div className="interest-avatar avatar avatar-lg">
                            <span>{initials}</span>
                          </div>
                          <div className="interest-info">
                            <h4 className="interest-name">{senderName}</h4>
                            <p className="interest-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={13} /> {city}
                            </p>
                            {interest.message && <p className="interest-time">"{interest.message}"</p>}
                          </div>
                          <div className="interest-actions">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleAccept(interest.id)}
                            >
                              <Check size={14} style={{ marginRight: '4px' }} /> Accept
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleReject(interest.id)}
                            >
                              <X size={14} style={{ marginRight: '4px' }} /> Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Discover Profiles */}
              <section className="dashboard-section animate-fadeInUp" style={{ animationDelay: '0.37s' }}>
                <div className="section-header">
                  <h2>Recommended Profiles</h2>
                  <Link to="/search" className="section-link">Browse All →</Link>
                </div>
                {recommended.length === 0 ? (
                  <p className="text-secondary" style={{ padding: '1rem 0' }}>
                    No recommended profiles available yet. Check back soon!
                  </p>
                ) : (
                  <div className="profiles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--spacing-lg)' }}>
                    {recommended.map((p) => {
                      const targetId = p.userId || p.id;
                      const isInterestSent = Boolean(sentInterestsMap[targetId]);
                      return (
                        <ProfileCard
                          key={p.id}
                          profile={{
                            ...p,
                            id: targetId,
                          }}
                          showActions={true}
                          isInterestSent={isInterestSent}
                          variant="default"
                          onSendInterest={() => handleSendInterest(targetId)}
                          onViewProfile={(id) => navigate(`/profile/${id}`)}
                        />
                      );
                    })}
                  </div>
                )}
              </section>

            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
