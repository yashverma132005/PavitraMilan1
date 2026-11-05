import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createProfile } from '../../services/profileService';
import StepIndicator from '../../components/common/StepIndicator';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { User, GraduationCap, Users, Heart, Check, LogOut, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import './ProfileCreate.css';

const STEP_LABELS = [
  'Personal Details',
  'Education & Career',
  'Family & Lifestyle',
  'Partner Preferences',
];

const INITIAL_FORM_DATA = {
  // Step 1: Personal
  fullName: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  birthTime: '',
  maritalStatus: 'NEVER_MARRIED',
  height: '',
  weight: '',
  bloodGroup: 'B_POSITIVE',
  city: '',
  state: '',
  country: 'India',
  aboutMe: '',
  expectations: '',

  // Step 2: Education & Career
  highestQualification: 'BACHELORS',
  college: '',
  occupation: '',
  companyName: '',
  annualIncome: '5_10_LAKH',
  workLocation: '',

  // Step 3: Family & Religion
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  brothers: 0,
  sisters: 0,
  familyType: 'NUCLEAR',
  familyStatus: 'UPPER_MIDDLE_CLASS',
  religion: 'Hindu',
  caste: '',
  subCaste: '',
  gotra: '',
  manglikStatus: 'NO',
  motherTongue: 'Hindi',
  diet: 'VEGETARIAN',
  smoking: 'No',
  drinking: 'No',
  hobbies: '',

  // Step 4: Partner Preferences
  ageMin: 21,
  ageMax: 35,
  heightMin: 150,
  heightMax: 190,
  partnerEducation: '',
  partnerOccupation: '',
  partnerLocation: '',
  partnerReligion: '',
  partnerCastes: '',
  otherExpectations: '',
};

export default function ProfileCreate() {
  const navigate = useNavigate();
  const { user, clerkUser, logout, refreshUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    fullName: clerkUser?.fullName || user?.email?.split('@')[0] || '',
    phone: user?.phone || clerkUser?.primaryPhoneNumber?.phoneNumber || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Auto-populate user's full name from Clerk if available
  useEffect(() => {
    if (clerkUser || user) {
      const derivedName =
        clerkUser?.fullName ||
        [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(' ') ||
        user?.email?.split('@')[0] ||
        '';

      setFormData((prev) => (prev.fullName ? prev : { ...prev, fullName: derivedName }));
    }
  }, [clerkUser, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 0) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.gender) errs.gender = 'Please select your gender';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
      if (!formData.maritalStatus) errs.maritalStatus = 'Marital status is required';
      if (formData.height && (Number(formData.height) < 100 || Number(formData.height) > 250)) {
        errs.height = 'Height must be between 100 and 250 cm';
      }
      if (formData.weight && (Number(formData.weight) < 30 || Number(formData.weight) > 200)) {
        errs.weight = 'Weight must be between 30 and 200 kg';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const dobISO = formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString()
        : undefined;

      const payload = {
        phone: formData.phone,
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: dobISO,
        birthTime: formData.birthTime || undefined,
        maritalStatus: formData.maritalStatus,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bloodGroup: formData.bloodGroup || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        country: formData.country || 'India',
        aboutMe: formData.aboutMe || undefined,
        expectations: formData.expectations || undefined,
        highestQualification: formData.highestQualification || undefined,
        college: formData.college || undefined,
        occupation: formData.occupation || undefined,
        companyName: formData.companyName || undefined,
        annualIncome: formData.annualIncome || undefined,
        workLocation: formData.workLocation || undefined,
        fatherName: formData.fatherName || undefined,
        fatherOccupation: formData.fatherOccupation || undefined,
        motherName: formData.motherName || undefined,
        motherOccupation: formData.motherOccupation || undefined,
        brothers: formData.brothers ? parseInt(formData.brothers, 10) : 0,
        sisters: formData.sisters ? parseInt(formData.sisters, 10) : 0,
        familyType: formData.familyType || undefined,
        familyStatus: formData.familyStatus || undefined,
        religion: formData.religion || undefined,
        caste: formData.caste || undefined,
        subCaste: formData.subCaste || undefined,
        gotra: formData.gotra || undefined,
        manglikStatus: formData.manglikStatus || undefined,
        motherTongue: formData.motherTongue || undefined,
        diet: formData.diet || undefined,
        smoking: formData.smoking || undefined,
        drinking: formData.drinking || undefined,
        hobbies: formData.hobbies || undefined,
        partnerPreference: {
          ageMin: Number(formData.ageMin) || 21,
          ageMax: Number(formData.ageMax) || 35,
          heightMin: Number(formData.heightMin) || null,
          heightMax: Number(formData.heightMax) || null,
          education: formData.partnerEducation ? [formData.partnerEducation] : [],
          occupation: formData.partnerOccupation ? [formData.partnerOccupation] : [],
          locations: formData.partnerLocation ? [formData.partnerLocation] : [],
          religions: formData.partnerReligion ? [formData.partnerReligion] : [],
          castes: formData.partnerCastes ? [formData.partnerCastes] : [],
          otherExpectations: formData.otherExpectations || null,
        },
      };

      await createProfile(payload);
      await refreshUser();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create profile:', err);
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && Array.isArray(serverErrors)) {
        const messages = serverErrors.map((e) => `${e.field}: ${e.message}`).join(', ');
        setSubmitError(`Validation failed: ${messages}`);
      } else {
        setSubmitError(
          err.response?.data?.message || 'Failed to create profile. Please check all required fields.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const userEmail = user?.email || clerkUser?.primaryEmailAddress?.emailAddress || '';
  const userDisplayName = formData.fullName || userEmail.split('@')[0] || 'User';

  return (
    <div className="profile-create-page">
      {/* Top Navbar */}
      <header className="profile-create-topbar">
        <div className="topbar-inner">
          <Link to="/" className="topbar-logo">
            <span className="logo-text">Pavitra <span className="logo-accent">Milan</span></span>
          </Link>
          <div className="topbar-actions">
            {userEmail && (
              <span className="user-badge" title={userEmail}>
                <span className="user-badge-dot" />
                <span className="user-badge-text">{userEmail}</span>
              </span>
            )}
            <button
              type="button"
              className="btn-logout-minimal"
              onClick={logout}
              title="Sign out or switch account"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Welcome & Explanatory Banner */}
        <div className="profile-create-header text-center">
          <div className="welcome-pill">
            <Sparkles size={14} /> Quick One-Time Profile Setup
          </div>
          <h1 className="header-title">
            Complete Your <span className="text-gradient">Matrimonial Profile</span>
          </h1>
          <p className="header-subtitle">
            Welcome, <strong>{userDisplayName}</strong>! Fill in your basic details so candidates can find and connect with you.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator-wrapper">
          <StepIndicator steps={STEP_LABELS} currentStep={currentStep} />
        </div>

        {submitError && (
          <div className="alert alert-danger animate-fadeInUp">
            {submitError}
          </div>
        )}

        <div className="profile-create-card glass-card">
          {/* Step 1: Personal Details */}
          {currentStep === 0 && (
            <div className="step-pane animate-fadeInUp">
              <div className="step-pane-header">
                <div className="step-pane-icon">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="step-title">Step 1: Personal Details</h2>
                  <p className="step-subtitle">Essential details to display your age, location, and marital status.</p>
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Full Name *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  required
                  placeholder="e.g. Yash Verma"
                />

                <Input
                  label="WhatsApp Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Include country code, e.g. +91 98765 43210"
                />

                <Input
                  label="Gender *"
                  name="gender"
                  type="select"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Input>

                <Input
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  required
                />

                <Input
                  label="Marital Status *"
                  name="maritalStatus"
                  type="select"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  error={errors.maritalStatus}
                  required
                >
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="AWAITING_DIVORCE">Awaiting Divorce</option>
                </Input>

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Delhi / Indore"
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Delhi NCR / Madhya Pradesh"
                />

                <Input
                  label="Height (in cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  error={errors.height}
                  placeholder="e.g. 175"
                />

                <Input
                  label="Blood Group"
                  name="bloodGroup"
                  type="select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="B_POSITIVE">B+</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="O_NEGATIVE">O-</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="AB_NEGATIVE">AB-</option>
                </Input>
              </div>

              <Input
                label="About Yourself (Optional)"
                name="aboutMe"
                type="textarea"
                value={formData.aboutMe}
                onChange={handleChange}
                placeholder="Share a short introduction about your lifestyle, personality, and hobbies..."
                rows="3"
              />
            </div>
          )}

          {/* Step 2: Education & Career */}
          {currentStep === 1 && (
            <div className="step-pane animate-fadeInUp">
              <div className="step-pane-header">
                <div className="step-pane-icon">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h2 className="step-title">Step 2: Education & Career</h2>
                  <p className="step-subtitle">Share your academic qualifications and current profession (optional).</p>
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Highest Qualification"
                  name="highestQualification"
                  type="select"
                  value={formData.highestQualification}
                  onChange={handleChange}
                >
                  <option value="BACHELORS">Bachelor's Degree</option>
                  <option value="MASTERS">Master's Degree</option>
                  <option value="DOCTORATE">PhD / Doctorate</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="HIGH_SCHOOL">High School</option>
                </Input>

                <Input
                  label="College / University"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. Delhi University / IIT"
                />

                <Input
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer / Entrepreneur"
                />

                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Tech Corp / Self-Employed"
                />

                <Input
                  label="Annual Income"
                  name="annualIncome"
                  type="select"
                  value={formData.annualIncome}
                  onChange={handleChange}
                >
                  <option value="3_5_LAKH">₹3L - ₹5L</option>
                  <option value="5_10_LAKH">₹5L - ₹10L</option>
                  <option value="10_20_LAKH">₹10L - ₹20L</option>
                  <option value="25_50_LAKH">₹25L - ₹50L</option>
                  <option value="ABOVE_50_LAKH">Above ₹50 Lakh</option>
                  <option value="BELOW_3_LAKH">Below ₹3 Lakh</option>
                </Input>

                <Input
                  label="Work Location"
                  name="workLocation"
                  value={formData.workLocation}
                  onChange={handleChange}
                  placeholder="e.g. Delhi NCR / Remote"
                />
              </div>
            </div>
          )}

          {/* Step 3: Family & Lifestyle */}
          {currentStep === 2 && (
            <div className="step-pane animate-fadeInUp">
              <div className="step-pane-header">
                <div className="step-pane-icon">
                  <Users size={20} />
                </div>
                <div>
                  <h2 className="step-title">Step 3: Family, Religion & Lifestyle</h2>
                  <p className="step-subtitle">Cultural and family background details (optional).</p>
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  placeholder="e.g. Hindu"
                />

                <Input
                  label="Caste / Community"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  placeholder="e.g. Verma / Brahmin / Any"
                />

                <Input
                  label="Mother Tongue"
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleChange}
                  placeholder="e.g. Hindi / English"
                />

                <Input
                  label="Diet Preference"
                  name="diet"
                  type="select"
                  value={formData.diet}
                  onChange={handleChange}
                >
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                  <option value="EGGETARIAN">Eggetarian</option>
                  <option value="VEGAN">Vegan</option>
                </Input>

                <Input
                  label="Family Type"
                  name="familyType"
                  type="select"
                  value={formData.familyType}
                  onChange={handleChange}
                >
                  <option value="NUCLEAR">Nuclear</option>
                  <option value="JOINT">Joint</option>
                </Input>

                <Input
                  label="Family Status"
                  name="familyStatus"
                  type="select"
                  value={formData.familyStatus}
                  onChange={handleChange}
                >
                  <option value="UPPER_MIDDLE_CLASS">Upper Middle Class</option>
                  <option value="MIDDLE_CLASS">Middle Class</option>
                  <option value="RICH">Affluent / Rich</option>
                </Input>
              </div>

              <Input
                label="Hobbies & Interests"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleChange}
                placeholder="e.g. Traveling, Fitness, Reading, Cooking"
              />
            </div>
          )}

          {/* Step 4: Partner Preferences */}
          {currentStep === 3 && (
            <div className="step-pane animate-fadeInUp">
              <div className="step-pane-header">
                <div className="step-pane-icon">
                  <Heart size={20} />
                </div>
                <div>
                  <h2 className="step-title">Step 4: Partner Preferences</h2>
                  <p className="step-subtitle">Tell us what you are looking for in a prospective partner.</p>
                </div>
              </div>

              <div className="form-grid">
                <Input
                  label="Min Preferred Age"
                  name="ageMin"
                  type="number"
                  value={formData.ageMin}
                  onChange={handleChange}
                />

                <Input
                  label="Max Preferred Age"
                  name="ageMax"
                  type="number"
                  value={formData.ageMax}
                  onChange={handleChange}
                />

                <Input
                  label="Preferred Education"
                  name="partnerEducation"
                  value={formData.partnerEducation}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor's / Master's / Any"
                />

                <Input
                  label="Preferred Location"
                  name="partnerLocation"
                  value={formData.partnerLocation}
                  onChange={handleChange}
                  placeholder="e.g. Delhi NCR / Open to Relocate"
                />
              </div>

              <Input
                label="Expectations From Partner (Optional)"
                name="expectations"
                type="textarea"
                value={formData.expectations}
                onChange={handleChange}
                placeholder="What qualities or lifestyle values are most important to you in your partner?"
                rows="3"
              />
            </div>
          )}

          {/* Controls Footer */}
          <div className="profile-create-controls">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handlePrev} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> Back
              </Button>
            ) : <div />}

            <div className="step-counter-text">
              Step {currentStep + 1} of {STEP_LABELS.length}
            </div>

            {currentStep < STEP_LABELS.length - 1 ? (
              <Button variant="primary" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Next: {STEP_LABELS[currentStep + 1]} <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={loading}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.75rem' }}
              >
                Complete Profile & Proceed <Check size={18} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
