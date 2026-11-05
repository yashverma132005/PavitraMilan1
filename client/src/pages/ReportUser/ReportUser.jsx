import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { reportUser } from '../../services/reportService';
import Button from '../../components/common/Button';
import { Check } from 'lucide-react';
import './ReportUser.css';

export default function ReportUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    setError(null);

    try {
      await reportUser(userId, reason, description);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="report-container">
        <div className="report-card glass-card text-center">
          <div className="success-checkmark" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-lg)' }}>
            <Check size={40} color="var(--color-success)" />
          </div>
          <h2>Report Submitted</h2>
          <p className="text-secondary" style={{ margin: '1rem 0 1.5rem' }}>
            We'll review this report within 24 hours and take appropriate action.
          </p>
          <Link to="/dashboard"><Button variant="primary">Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <div className="report-card glass-card">
        <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Report User</h2>
        {error && <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Reason <span className="required">*</span></label>
            <select className="select-field" value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">Select a reason</option>
              <option value="fake">Fake Profile</option>
              <option value="harassment">Harassment</option>
              <option value="inappropriate">Inappropriate Content</option>
              <option value="spam">Spam</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Description <span className="required">*</span></label>
            <textarea
              className="textarea-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              required
              rows="5"
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button variant="danger" type="submit" fullWidth loading={loading}>
              Submit Report
            </Button>
            <Button variant="ghost" onClick={() => navigate(-1)} fullWidth disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
