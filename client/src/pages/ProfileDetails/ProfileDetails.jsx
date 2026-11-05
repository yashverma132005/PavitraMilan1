import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfileById } from '../../services/profileService';
import { sendInterest } from '../../services/interestService';
import { blockUser } from '../../services/reportService';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/common/Loader';
import { MapPin, Briefcase, GraduationCap, Check, Heart, Ban, AlertTriangle } from 'lucide-react';
import './ProfileDetails.css';

export default function ProfileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interestSent, setInterestSent] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const res = await getProfileById(id);
        if (res.data?.data) {
          setProfile(res.data.data);
          if (res.data.data.hasSentInterest) {
            setInterestSent(true);
          }
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProfile();
    }
  }, [id]);

  const handleSendInterest = async () => {
    try {
      const targetId = profile?.userId || profile?.id;
      await sendInterest(targetId);
      setInterestSent(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setInterestSent(true);
      } else {
        console.error('Failed to send interest:', err);
        alert(err.response?.data?.message || 'Failed to send interest');
      }
    }
  };

  const handleBlockUser = async () => {
    if (!window.confirm('Are you sure you want to block this user?')) return;
    try {
      const targetId = profile?.userId || profile?.id;
      await blockUser(targetId);
      setBlocked(true);
    } catch (err) {
      console.error('Failed to block user:', err);
      alert(err.response?.data?.message || 'Failed to block user');
    }
  };

  if (loading) {
    return (
      <Layout isAuthenticated={true} user={user}>
        <Loader message="Loading profile details..." />
      </Layout>
    );
  }

  if (error || !profile) {
    return (
      <Layout isAuthenticated={true} user={user}>
        <div className="container section text-center" style={{ padding: '4rem 1rem' }}>
          <h2>Profile Not Found</h2>
          <p className="text-secondary" style={{ margin: '1rem 0 2rem' }}>
            {error || "The profile you are looking for does not exist or is unavailable."}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            Back to Profiles
          </button>
        </div>
      </Layout>
    );
  }

  const name = profile.fullName || 'Candidate';
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const prefs = profile.partnerPreference || {};

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="profile-details-page">
        <div className="container">
          {/* Hero Section */}
          <section className="profile-hero animate-fadeInUp">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-name-row">
                <h1 className="profile-name">{name}</h1>
                <div className="profile-badges">
                  {profile.isVerified && <span className="badge badge-verified">Verified</span>}
                </div>
              </div>
              {profile.city && (
                <p className="profile-location">
                  <MapPin size={16} /> {profile.city}{profile.state ? `, ${profile.state}` : ''}
                </p>
              )}
              {profile.occupation && (
                <p className="profile-occupation">
                  <Briefcase size={16} /> {profile.occupation}{profile.companyName ? ` at ${profile.companyName}` : ''}
                </p>
              )}
              {profile.highestQualification && (
                <p className="profile-education">
                  <GraduationCap size={16} /> {profile.highestQualification}
                </p>
              )}

              <div className="profile-actions">
                {interestSent ? (
                  <button
                    className="btn btn-secondary"
                    disabled
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: 0.8, cursor: 'not-allowed' }}
                  >
                    <Check size={16} /> Request Sent
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSendInterest} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={16} /> Send Interest
                  </button>
                )}

                {blocked ? (
                  <span className="badge badge-danger" style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}>
                    Blocked
                  </span>
                ) : (
                  <button className="btn btn-ghost" onClick={handleBlockUser} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Ban size={16} /> Block
                  </button>
                )}

                <Link to={`/report/${profile.userId || profile.id}`} className="btn btn-ghost profile-report-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Report
                </Link>
              </div>
            </div>
          </section>

          <div className="profile-sections animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <section className="profile-detail-section">
                <h2>About</h2>
                {profile.aboutMe && (
                  <div className="about-section">
                    <h3>About Me</h3>
                    <p className="about-text">{profile.aboutMe}</p>
                  </div>
                )}
                <div className="info-grid">
                  {profile.dateOfBirth && (
                    <div className="info-item">
                      <span className="info-item-label">Date of Birth</span>
                      <span className="info-item-value">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                  {profile.height && (
                    <div className="info-item">
                      <span className="info-item-label">Height</span>
                      <span className="info-item-value">{profile.height} cm</span>
                    </div>
                  )}
                  {profile.weight && (
                    <div className="info-item">
                      <span className="info-item-label">Weight</span>
                      <span className="info-item-value">{profile.weight} kg</span>
                    </div>
                  )}
                  {profile.bloodGroup && (
                    <div className="info-item">
                      <span className="info-item-label">Blood Group</span>
                      <span className="info-item-value">{profile.bloodGroup}</span>
                    </div>
                  )}
                  {profile.maritalStatus && (
                    <div className="info-item">
                      <span className="info-item-label">Marital Status</span>
                      <span className="info-item-value">{profile.maritalStatus.replace('_', ' ')}</span>
                    </div>
                  )}
                  {profile.motherTongue && (
                    <div className="info-item">
                      <span className="info-item-label">Mother Tongue</span>
                      <span className="info-item-value">{profile.motherTongue}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="profile-detail-section">
                <h2>Education &amp; Career</h2>
                <div className="info-grid">
                  {profile.highestQualification && (
                    <div className="info-item">
                      <span className="info-item-label">Highest Qualification</span>
                      <span className="info-item-value">{profile.highestQualification}</span>
                    </div>
                  )}
                  {profile.college && (
                    <div className="info-item">
                      <span className="info-item-label">College / University</span>
                      <span className="info-item-value">{profile.college}</span>
                    </div>
                  )}
                  {profile.occupation && (
                    <div className="info-item">
                      <span className="info-item-label">Occupation</span>
                      <span className="info-item-value">{profile.occupation}</span>
                    </div>
                  )}
                  {profile.companyName && (
                    <div className="info-item">
                      <span className="info-item-label">Company</span>
                      <span className="info-item-value">{profile.companyName}</span>
                    </div>
                  )}
                  {profile.annualIncome && (
                    <div className="info-item">
                      <span className="info-item-label">Annual Income</span>
                      <span className="info-item-value">{profile.annualIncome.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                  {profile.workLocation && (
                    <div className="info-item">
                      <span className="info-item-label">Work Location</span>
                      <span className="info-item-value">{profile.workLocation}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="profile-detail-section">
                <h2>Family</h2>
                <div className="info-grid">
                  {profile.fatherName && (
                    <div className="info-item">
                      <span className="info-item-label">Father's Name</span>
                      <span className="info-item-value">{profile.fatherName}</span>
                    </div>
                  )}
                  {profile.fatherOccupation && (
                    <div className="info-item">
                      <span className="info-item-label">Father's Occupation</span>
                      <span className="info-item-value">{profile.fatherOccupation}</span>
                    </div>
                  )}
                  {profile.motherName && (
                    <div className="info-item">
                      <span className="info-item-label">Mother's Name</span>
                      <span className="info-item-value">{profile.motherName}</span>
                    </div>
                  )}
                  {profile.motherOccupation && (
                    <div className="info-item">
                      <span className="info-item-label">Mother's Occupation</span>
                      <span className="info-item-value">{profile.motherOccupation}</span>
                    </div>
                  )}
                  {profile.brothers !== null && (
                    <div className="info-item">
                      <span className="info-item-label">Brothers</span>
                      <span className="info-item-value">{profile.brothers}</span>
                    </div>
                  )}
                  {profile.sisters !== null && (
                    <div className="info-item">
                      <span className="info-item-label">Sisters</span>
                      <span className="info-item-value">{profile.sisters}</span>
                    </div>
                  )}
                  {profile.familyType && (
                    <div className="info-item">
                      <span className="info-item-label">Family Type</span>
                      <span className="info-item-value">{profile.familyType}</span>
                    </div>
                  )}
                  {profile.familyStatus && (
                    <div className="info-item">
                      <span className="info-item-label">Family Status</span>
                      <span className="info-item-value">{profile.familyStatus.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="profile-detail-section">
                <h2>Religion &amp; Lifestyle</h2>
                <div className="info-grid">
                  {profile.religion && (
                    <div className="info-item">
                      <span className="info-item-label">Religion</span>
                      <span className="info-item-value">{profile.religion}</span>
                    </div>
                  )}
                  {profile.caste && (
                    <div className="info-item">
                      <span className="info-item-label">Caste</span>
                      <span className="info-item-value">{profile.caste}</span>
                    </div>
                  )}
                  {profile.gotra && (
                    <div className="info-item">
                      <span className="info-item-label">Gotra</span>
                      <span className="info-item-value">{profile.gotra}</span>
                    </div>
                  )}
                  {profile.manglikStatus && (
                    <div className="info-item">
                      <span className="info-item-label">Manglik Status</span>
                      <span className="info-item-value">{profile.manglikStatus}</span>
                    </div>
                  )}
                  {profile.diet && (
                    <div className="info-item">
                      <span className="info-item-label">Diet</span>
                      <span className="info-item-value">{profile.diet}</span>
                    </div>
                  )}
                  {profile.smoking && (
                    <div className="info-item">
                      <span className="info-item-label">Smoking</span>
                      <span className="info-item-value">{profile.smoking}</span>
                    </div>
                  )}
                  {profile.drinking && (
                    <div className="info-item">
                      <span className="info-item-label">Drinking</span>
                      <span className="info-item-value">{profile.drinking}</span>
                    </div>
                  )}
                </div>

                {profile.hobbies && (
                  <div className="lifestyle-section">
                    <h3>Hobbies & Interests</h3>
                    <div className="chips-container">
                      {(typeof profile.hobbies === 'string' ? profile.hobbies.split(',') : profile.hobbies).map((hobby) => (
                        <span className="chip chip-active" key={hobby}>{hobby.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <section className="profile-detail-section">
                <h2>Partner Preferences</h2>
                <div className="info-grid">
                  {prefs.ageMin && prefs.ageMax && (
                    <div className="info-item">
                      <span className="info-item-label">Preferred Age</span>
                      <span className="info-item-value">{prefs.ageMin} - {prefs.ageMax} yrs</span>
                    </div>
                  )}
                  {prefs.heightMin && prefs.heightMax && (
                    <div className="info-item">
                      <span className="info-item-label">Preferred Height</span>
                      <span className="info-item-value">{prefs.heightMin} - {prefs.heightMax} cm</span>
                    </div>
                  )}
                  {prefs.education && (
                    <div className="info-item">
                      <span className="info-item-label">Preferred Education</span>
                      <span className="info-item-value">
                        {Array.isArray(prefs.education) ? prefs.education.join(', ') : prefs.education}
                      </span>
                    </div>
                  )}
                  {prefs.occupation && (
                    <div className="info-item">
                      <span className="info-item-label">Preferred Occupation</span>
                      <span className="info-item-value">
                        {Array.isArray(prefs.occupation) ? prefs.occupation.join(', ') : prefs.occupation}
                      </span>
                    </div>
                  )}
                  {prefs.locations && (
                    <div className="info-item">
                      <span className="info-item-label">Preferred Location</span>
                      <span className="info-item-value">
                        {Array.isArray(prefs.locations) ? prefs.locations.join(', ') : prefs.locations}
                      </span>
                    </div>
                  )}
                  {prefs.otherExpectations && (
                    <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                      <span className="info-item-label">Other Expectations</span>
                      <span className="info-item-value">{prefs.otherExpectations}</span>
                    </div>
                  )}
                </div>
              </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
