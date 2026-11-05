import { MapPin, Briefcase, GraduationCap, Phone, Lock, Check, X, Clock } from 'lucide-react';
import './ProfileCard.css';

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function ProfileCard({ profile, onViewProfile, onSendInterest, onAccept, onReject, showActions = false, showContact = false, variant = 'default', isInterestSent = false }) {
  const initials = profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const age = profile.age || calculateAge(profile.dateOfBirth);
  const requestSent = isInterestSent || profile.isInterestSent;

  return (
    <div className="profile-card" onClick={() => onViewProfile && onViewProfile(profile.id)}>
      <div className="profile-card-photo">
        {profile.profilePhoto ? (
          <img src={profile.profilePhoto} alt={profile.fullName} />
        ) : (
          <span>{initials}</span>
        )}
        <div className="profile-card-badges">
          {profile.isVerified && <span className="badge badge-verified">Verified</span>}
          {profile.isOnline && <span className="badge badge-online">Online</span>}
        </div>
      </div>
      <div className="profile-card-body">
        <div className="profile-card-name">
          {profile.fullName}{age ? `, ${age}` : ''}
        </div>
        {profile.city && (
          <p className="profile-card-info">
            <MapPin size={14} className="icon-inline" /> {profile.city}{profile.state ? `, ${profile.state}` : ''}
          </p>
        )}
        {profile.occupation && (
          <p className="profile-card-info">
            <Briefcase size={14} className="icon-inline" /> {profile.occupation}
          </p>
        )}
        {profile.highestQualification && (
          <p className="profile-card-info">
            <GraduationCap size={14} className="icon-inline" /> {profile.highestQualification}
          </p>
        )}
      </div>

      {showContact && profile.isMatched ? (
        <div className="profile-card-contact">
          {profile.phone ? (
            <a
              href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Contact ${profile.fullName} on WhatsApp`}
            >
              <Phone size={14} className="icon-inline" /> WhatsApp: {profile.phone}
            </a>
          ) : (
            <p><Phone size={14} className="icon-inline" /> WhatsApp number not provided</p>
          )}
        </div>
      ) : showContact && !profile.isMatched ? (
        <div className="profile-card-contact">
          <p className="contact-hidden"><Lock size={14} className="icon-inline" /> Contact shown after interest is accepted</p>
        </div>
      ) : null}

      {showActions && variant === 'received' && (
        <div className="profile-card-footer">
          <button className="btn btn-success btn-sm" onClick={(e) => { e.stopPropagation(); onAccept && onAccept(profile.id); }}>
            <Check size={14} style={{ marginRight: '4px' }} /> Accept
          </button>
          <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); onReject && onReject(profile.id); }}>
            <X size={14} style={{ marginRight: '4px' }} /> Reject
          </button>
        </div>
      )}

      {showActions && variant === 'default' && (
        <div className="profile-card-footer">
          <button
            className={`btn ${requestSent ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            disabled={requestSent}
            onClick={(e) => {
              e.stopPropagation();
              if (!requestSent) {
                onSendInterest && onSendInterest(profile.id);
              }
            }}
            style={requestSent ? { opacity: 0.8, cursor: 'not-allowed', display: 'inline-flex', alignItems: 'center', gap: '4px' } : {}}
          >
            {requestSent ? (
              <><Check size={14} /> Request Sent</>
            ) : (
              'Send Interest'
            )}
          </button>
          <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); onViewProfile && onViewProfile(profile.id); }}>View Profile</button>
        </div>
      )}

      {showActions && variant === 'sent' && profile.status && (
        <div className="profile-card-footer">
          <span className={`badge badge-${profile.status === 'ACCEPTED' ? 'accepted' : profile.status === 'REJECTED' ? 'rejected' : 'pending'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            {profile.status === 'ACCEPTED' ? (
              <><Check size={13} /> Accepted</>
            ) : profile.status === 'REJECTED' ? (
              <><X size={13} /> Rejected</>
            ) : (
              <><Clock size={13} /> Pending</>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
