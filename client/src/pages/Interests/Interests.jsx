import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReceivedInterests, getSentInterests, acceptInterest, rejectInterest } from '../../services/interestService';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import { Mail, Send, MapPin, Check, X, Clock } from 'lucide-react';
import './Interests.css';

function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Interests() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [receivedList, setReceivedList] = useState([]);
  const [sentList, setSentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInterests() {
      try {
        setLoading(true);
        setError(null);

        const [recRes, sentRes] = await Promise.allSettled([
          getReceivedInterests(1, 50),
          getSentInterests(1, 50),
        ]);

        if (recRes.status === 'fulfilled' && recRes.value.data?.data) {
          setReceivedList(recRes.value.data.data);
        }
        if (sentRes.status === 'fulfilled' && sentRes.value.data?.data) {
          setSentList(sentRes.value.data.data);
        }
      } catch (err) {
        console.error('Failed to load interests:', err);
        setError('Failed to fetch interests');
      } finally {
        setLoading(false);
      }
    }

    loadInterests();
  }, []);

  const handleAccept = async (interestId) => {
    try {
      await acceptInterest(interestId);
      setReceivedList((prev) =>
        prev.map((item) => (item.id === interestId ? { ...item, status: 'ACCEPTED' } : item))
      );
    } catch (err) {
      console.error('Failed to accept interest:', err);
      alert(err.response?.data?.message || 'Failed to accept interest');
    }
  };

  const handleReject = async (interestId) => {
    try {
      await rejectInterest(interestId);
      setReceivedList((prev) =>
        prev.map((item) => (item.id === interestId ? { ...item, status: 'REJECTED' } : item))
      );
    } catch (err) {
      console.error('Failed to reject interest:', err);
      alert(err.response?.data?.message || 'Failed to reject interest');
    }
  };

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="interests-page">
        <div className="container">
          {/* Page Header */}
          <div className="interests-header animate-fadeInUp">
            <h1 className="interests-title">Interests</h1>
            <p className="interests-subtitle">Manage your received and sent interests</p>
          </div>

          {/* Tabs */}
          <div className="tabs interests-tabs animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <button
              className={`tab-item ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => setActiveTab('received')}
            >
              Received <span className="tab-badge">{receivedList.length}</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'sent' ? 'active' : ''}`}
              onClick={() => setActiveTab('sent')}
            >
              Sent <span className="tab-badge">{sentList.length}</span>
            </button>
          </div>

          {loading ? (
            <Loader message="Loading interests..." />
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              {/* Received Tab */}
              {activeTab === 'received' && (
                <div className="interests-content animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                  {receivedList.length === 0 ? (
                    <EmptyState
                      icon={<Mail size={44} color="var(--color-primary)" />}
                      title="No Interests Received"
                      description="You haven't received any interests yet. Complete your profile to attract more matches."
                    />
                  ) : (
                    <div className="interests-grid">
                      {receivedList.map((interest) => {
                        const senderProfile = interest.sender?.profile;
                        const name = senderProfile?.fullName || 'Candidate';
                        const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                        const city = senderProfile?.city || 'Location not specified';
                        const dateStr = new Date(interest.createdAt).toLocaleDateString();

                        return (
                          <div className="interest-card glass-card" key={interest.id}>
                            <div className="interest-card-top">
                              <div className="avatar avatar-xl interest-card-avatar">
                                {senderProfile?.profilePhoto ? (
                                  <img src={senderProfile.profilePhoto} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <span>{initials}</span>
                                )}
                              </div>
                              <div className="interest-card-info">
                                <h3 className="interest-card-name">{name}</h3>
                                <p className="interest-card-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} /> {city}
                                </p>
                                <span className="interest-card-date">{dateStr}</span>
                              </div>
                            </div>
                            {interest.message && (
                              <div className="interest-card-message">
                                <p>"{interest.message}"</p>
                              </div>
                            )}
                            <div className="interest-card-actions">
                              {interest.status === 'PENDING' ? (
                                <>
                                  <button className="btn btn-success btn-sm" onClick={() => handleAccept(interest.id)}>
                                    <Check size={14} style={{ marginRight: '4px' }} /> Accept
                                  </button>
                                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(interest.id)}>
                                    <X size={14} style={{ marginRight: '4px' }} /> Reject
                                  </button>
                                </>
                              ) : (
                                <span className={`badge badge-${interest.status === 'ACCEPTED' ? 'accepted' : 'rejected'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  {interest.status === 'ACCEPTED' ? <><Check size={13} /> Accepted</> : <><X size={13} /> Rejected</>}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Sent Tab */}
              {activeTab === 'sent' && (
                <div className="interests-content animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                  {sentList.length === 0 ? (
                    <EmptyState
                      icon={<Send size={44} color="var(--color-primary)" />}
                      title="No Interests Sent"
                      description="You haven't sent any interests yet. Browse profiles and send an interest to connect."
                    />
                  ) : (
                    <div className="interests-grid">
                      {sentList.map((interest) => {
                        const receiverProfile = interest.receiver?.profile;
                        const name = receiverProfile?.fullName || 'Candidate';
                        const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
                        const city = receiverProfile?.city || 'Location not specified';
                        const dateStr = new Date(interest.createdAt).toLocaleDateString();
                        const statusClass = interest.status === 'ACCEPTED' ? 'accepted' : interest.status === 'REJECTED' ? 'rejected' : 'pending';
                        const statusIcon = interest.status === 'ACCEPTED' ? <Check size={13} /> : interest.status === 'REJECTED' ? <X size={13} /> : <Clock size={13} />;

                        return (
                          <div className="interest-card glass-card" key={interest.id}>
                            <div className="interest-card-top">
                              <div className="avatar avatar-xl interest-card-avatar">
                                {receiverProfile?.profilePhoto ? (
                                  <img src={receiverProfile.profilePhoto} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                  <span>{initials}</span>
                                )}
                              </div>
                              <div className="interest-card-info">
                                <h3 className="interest-card-name">{name}</h3>
                                <p className="interest-card-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={13} /> {city}
                                </p>
                                <span className="interest-card-date">{dateStr}</span>
                              </div>
                            </div>
                            <div className="interest-card-actions interest-card-status">
                              <span className={`badge badge-${statusClass} interest-status-badge`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {statusIcon} {interest.status.charAt(0) + interest.status.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
