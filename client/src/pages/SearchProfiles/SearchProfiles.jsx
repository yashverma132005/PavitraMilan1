import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchProfiles } from '../../services/profileService';
import { getSentInterests, sendInterest } from '../../services/interestService';
import Layout from '../../components/layout/Layout';
import ProfileCard from '../../components/common/ProfileCard';
import Loader from '../../components/common/Loader';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import './SearchProfiles.css';

const defaultFilters = {
  ageMin: '18',
  ageMax: '60',
  city: '',
  religion: '',
  maritalStatus: '',
  education: '',
};

export default function SearchProfiles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [sentInterests, setSentInterests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getSentInterests(1, 100)
      .then((res) => {
        if (!active || !res.data?.data) return;
        const sent = {};
        res.data.data.forEach((interest) => {
          const recipientId = interest.receiver?.id || interest.receiverId;
          if (recipientId) sent[recipientId] = true;
        });
        setSentInterests(sent);
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadProfiles() {
      setLoading(true);
      setError('');
      try {
        const res = await searchProfiles({ ...appliedFilters, page, limit: 12, sortBy });
        if (!active) return;
        setProfiles(res.data?.data || []);
        setTotalPages(res.data?.pagination?.totalPages || 1);
      } catch (err) {
        if (!active) return;
        console.error('Failed to browse profiles:', err);
        setError(err.response?.data?.message || 'Could not load profiles. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfiles();
    return () => { active = false; };
  }, [appliedFilters, page, sortBy]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const applyFilters = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedFilters({ ...filters });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSortBy('newest');
    setPage(1);
  };

  const handleSendInterest = async (targetId) => {
    try {
      await sendInterest(targetId);
      setSentInterests((current) => ({ ...current, [targetId]: true }));
    } catch (err) {
      if (err.response?.status === 409) {
        setSentInterests((current) => ({ ...current, [targetId]: true }));
        return;
      }
      alert(err.response?.data?.message || 'Failed to send interest request');
    }
  };

  return (
    <Layout isAuthenticated={true} user={user}>
      <main className="browse-profiles-page">
        <div className="container section">
          <header className="browse-profiles-heading">
            <div>
              <h1>Browse Profiles</h1>
              <p className="text-secondary">Explore recommended profiles and narrow the list with filters.</p>
            </div>
          </header>

          <form className="browse-filters card" onSubmit={applyFilters}>
            <div className="browse-filters-title">
              <h2><SlidersHorizontal size={18} /> Filters</h2>
              <label className="browse-sort">
                <span>Sort by</span>
                <select className="input-field" value={sortBy} onChange={(event) => { setPage(1); setSortBy(event.target.value); }}>
                  <option value="newest">Recently joined</option>
                  <option value="ageAsc">Age: youngest first</option>
                  <option value="ageDesc">Age: oldest first</option>
                  <option value="nameAsc">Name: A–Z</option>
                </select>
              </label>
            </div>

            <div className="browse-filter-grid">
              <label className="browse-filter-field">
                <span>Minimum age</span>
                <input className="input-field" type="number" name="ageMin" min="18" max="100" value={filters.ageMin} onChange={updateFilter} />
              </label>
              <label className="browse-filter-field">
                <span>Maximum age</span>
                <input className="input-field" type="number" name="ageMax" min="18" max="100" value={filters.ageMax} onChange={updateFilter} />
              </label>
              <label className="browse-filter-field">
                <span>City</span>
                <input className="input-field" type="text" name="city" value={filters.city} onChange={updateFilter} placeholder="Any city" />
              </label>
              <label className="browse-filter-field">
                <span>Religion</span>
                <input className="input-field" type="text" name="religion" value={filters.religion} onChange={updateFilter} placeholder="Any religion" />
              </label>
              <label className="browse-filter-field">
                <span>Marital status</span>
                <select className="input-field" name="maritalStatus" value={filters.maritalStatus} onChange={updateFilter}>
                  <option value="">Any status</option>
                  <option value="NEVER_MARRIED">Never married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="AWAITING_DIVORCE">Awaiting divorce</option>
                </select>
              </label>
              <label className="browse-filter-field">
                <span>Education</span>
                <input className="input-field" type="text" name="education" value={filters.education} onChange={updateFilter} placeholder="Any education" />
              </label>
            </div>

            <div className="browse-filter-actions">
              <button className="btn btn-primary" type="submit">Apply filters</button>
              <button className="btn btn-outline" type="button" onClick={resetFilters}><RotateCcw size={15} /> Reset</button>
            </div>
          </form>

          {loading ? (
            <Loader message="Loading profiles..." />
          ) : error ? (
            <div className="browse-results-message" role="alert">
              <p>{error}</p>
              <button className="btn btn-outline" onClick={() => setAppliedFilters({ ...appliedFilters })}>Try again</button>
            </div>
          ) : profiles.length === 0 ? (
            <p className="browse-results-message text-secondary">No profiles match these filters. Try widening your selection.</p>
          ) : (
            <>
              <div className="browse-profiles-grid">
                {profiles.map((profile) => {
                  const targetId = profile.userId || profile.id;
                  return (
                    <ProfileCard
                      key={profile.id}
                      profile={{ ...profile, id: targetId }}
                      showActions
                      isInterestSent={Boolean(sentInterests[targetId])}
                      onSendInterest={() => handleSendInterest(targetId)}
                      onViewProfile={(id) => navigate(`/profile/${id}`)}
                    />
                  );
                })}
              </div>
              {totalPages > 1 && (
                <nav className="browse-pagination" aria-label="Profile pages">
                  <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
                  <span>Page {page} of {totalPages}</span>
                  <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
