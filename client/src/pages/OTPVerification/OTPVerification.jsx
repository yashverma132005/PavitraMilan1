import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import './OTPVerification.css';

export default function OTPVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(60);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card glass-card">
        <h2 className="text-center" style={{ marginBottom: '0.5rem' }}>Verify Phone</h2>
        <p className="text-center text-secondary text-sm" style={{ marginBottom: '2rem' }}>
          We have sent a 6-digit OTP code to your phone number.
        </p>

        <form onSubmit={handleVerify}>
          <div className="otp-inputs">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength="1"
                value={digit}
                ref={el => inputsRef.current[idx] = el}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className="otp-box"
              />
            ))}
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: '2rem' }}>
            Verify & Proceed
          </Button>
        </form>

        <div className="text-center text-sm" style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {timer > 0 ? (
            <span>Resend code in <strong>0:{timer.toString().padStart(2, '0')}</strong></span>
          ) : (
            <button onClick={handleResend} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'var(--fw-semibold)', cursor: 'pointer' }}>
              Resend OTP Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
