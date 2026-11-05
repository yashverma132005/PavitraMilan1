import { Check } from 'lucide-react';
import './StepIndicator.css';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="step-indicator">
      {steps.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div className={`step-item ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}>
            <div className="step-content">
              <div className="step-circle">{i < currentStep ? <Check size={14} /> : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
          </div>
          {i < steps.length - 1 && <div className={`step-line ${i < currentStep ? 'completed' : ''}`} />}
        </div>
      ))}
    </div>
  );
}
