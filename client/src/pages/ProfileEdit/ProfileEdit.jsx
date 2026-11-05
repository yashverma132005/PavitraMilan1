import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, updateProfile, uploadPhoto } from '../../services/profileService';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import './ProfileEdit.css';

export default function ProfileEdit() {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'MALE',
    dateOfBirth: '',
    maritalStatus: 'NEVER_MARRIED',
    birthTime: '',
    birthPlace: '',
    height: '',
    weight: '',
    bloodGroup: '',
    city: '',
    state: '',
    country: 'India',
    aboutMe: '',
    expectations: '',
    highestQualification: '',
    college: '',
    occupation: '',
    companyName: '',
    annualIncome: '',
    workLocation: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    motherOccupation: '',
    brothers: 0,
    sisters: 0,
    familyType: 'NUCLEAR',
    familyStatus: 'MIDDLE_CLASS',
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
    ageMin: 21,
    ageMax: 35,
    heightMin: 150,
    heightMax: 190,
    partnerEducation: '',
    partnerOccupation: '',
    partnerLocation: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const tabs = [
    { id: 'personal', label: 'Personal' },
    { id: 'education', label: 'Education' },
    { id: 'family', label: 'Family' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'partner', label: 'Partner Prefs' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await getMyProfile();
        if (res.data?.data) {
          const p = res.data.data;
          const prefs = p.partnerPreference || {};
          setFormData({
            fullName: p.fullName || '',
            phone: p.phone || '',
            gender: p.gender || 'MALE',
            dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : '',
            maritalStatus: p.maritalStatus || 'NEVER_MARRIED',
            birthTime: p.birthTime || '',
            birthPlace: p.birthPlace || '',
            height: p.height || '',
            weight: p.weight || '',
            bloodGroup: p.bloodGroup || '',
            city: p.city || '',
            state: p.state || '',
            country: p.country || 'India',
            aboutMe: p.aboutMe || '',
            expectations: p.expectations || '',
            highestQualification: p.highestQualification || '',
            college: p.college || '',
            occupation: p.occupation || '',
            companyName: p.companyName || '',
            annualIncome: p.annualIncome || '',
            workLocation: p.workLocation || '',
            fatherName: p.fatherName || '',
            fatherOccupation: p.fatherOccupation || '',
            motherName: p.motherName || '',
            motherOccupation: p.motherOccupation || '',
            brothers: p.brothers || 0,
            sisters: p.sisters || 0,
            familyType: p.familyType || 'NUCLEAR',
            familyStatus: p.familyStatus || 'MIDDLE_CLASS',
            religion: p.religion || 'Hindu',
            caste: p.caste || '',
            subCaste: p.subCaste || '',
            gotra: p.gotra || '',
            manglikStatus: p.manglikStatus || 'NO',
            motherTongue: p.motherTongue || 'Hindi',
            diet: p.diet || 'VEGETARIAN',
            smoking: p.smoking || 'No',
            drinking: p.drinking || 'No',
            hobbies: p.hobbies || '',
            profilePhoto: p.profilePhoto || null,
            ageMin: prefs.ageMin || 21,
            ageMax: prefs.ageMax || 35,
            heightMin: prefs.heightMin || '',
            heightMax: prefs.heightMax || '',
            partnerEducation: Array.isArray(prefs.education) ? prefs.education.join(', ') : prefs.education || '',
            partnerOccupation: Array.isArray(prefs.occupation) ? prefs.occupation.join(', ') : prefs.occupation || '',
            partnerLocation: Array.isArray(prefs.locations) ? prefs.locations.join(', ') : prefs.locations || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile for edit:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        phone: formData.phone || '',
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth || null,
        maritalStatus: formData.maritalStatus,
        birthTime: formData.birthTime || null,
        birthPlace: formData.birthPlace || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        bloodGroup: formData.bloodGroup || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || 'India',
        aboutMe: formData.aboutMe || null,
        expectations: formData.expectations || null,
        highestQualification: formData.highestQualification || null,
        college: formData.college || null,
        occupation: formData.occupation || null,
        companyName: formData.companyName || null,
        annualIncome: formData.annualIncome || null,
        workLocation: formData.workLocation || null,
        fatherName: formData.fatherName || null,
        fatherOccupation: formData.fatherOccupation || null,
        motherName: formData.motherName || null,
        motherOccupation: formData.motherOccupation || null,
        brothers: formData.brothers ? parseInt(formData.brothers, 10) : 0,
        sisters: formData.sisters ? parseInt(formData.sisters, 10) : 0,
        familyType: formData.familyType || null,
        familyStatus: formData.familyStatus || null,
        religion: formData.religion || null,
        caste: formData.caste || null,
        subCaste: formData.subCaste || null,
        gotra: formData.gotra || null,
        manglikStatus: formData.manglikStatus || null,
        motherTongue: formData.motherTongue || null,
        diet: formData.diet || null,
        smoking: formData.smoking || null,
        drinking: formData.drinking || null,
        hobbies: formData.hobbies || null,
        partnerPreference: {
          ageMin: Number(formData.ageMin) || 21,
          ageMax: Number(formData.ageMax) || 35,
          heightMin: formData.heightMin ? parseFloat(formData.heightMin) : null,
          heightMax: formData.heightMax ? parseFloat(formData.heightMax) : null,
          education: formData.partnerEducation ? [formData.partnerEducation] : [],
          occupation: formData.partnerOccupation ? [formData.partnerOccupation] : [],
          locations: formData.partnerLocation ? [formData.partnerLocation] : [],
        },
      };

      await updateProfile(payload);
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      const validationDetails = err.response?.data?.errors?.map((e) => `${e.field}: ${e.message}`).join(', ');
      setMessage({
        type: 'danger',
        text: validationDetails || err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('photo', file);
      const res = await uploadPhoto(data, 'profile');
      if (res.data?.data?.url) {
        setFormData((prev) => ({ ...prev, profilePhoto: res.data.data.url }));
        setMessage({ type: 'success', text: 'Profile photo uploaded successfully!' });
      }
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Photo upload failed. Check Cloudinary settings.',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <Layout isAuthenticated={true} user={user}>
        <Loader message="Loading profile..." />
      </Layout>
    );
  }

  const initials = (formData.fullName || 'User')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout isAuthenticated={true} user={user}>
      <div className="container section">
        <div className="edit-header">
          <h1>Edit Profile</h1>
          <Button onClick={handleSave} loading={saving}>
            Save All Changes
          </Button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} style={{ marginBottom: '1.5rem' }}>
            {message.text}
          </div>
        )}

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="edit-form card">
          {activeTab === 'personal' && (
            <>
              <div className="edit-photo-area">
                <div className="avatar avatar-2xl">
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    initials
                  )}
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className="edit-grid">
                <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                <Input label="WhatsApp Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Include country code, e.g. +91 98765 43210" />
                <Input label="Gender" name="gender" type="select" value={formData.gender} onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Input>
                <Input label="Marital Status" name="maritalStatus" type="select" value={formData.maritalStatus} onChange={handleChange}>
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="AWAITING_DIVORCE">Awaiting Divorce</option>
                </Input>
                <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                <Input label="Birth Time" name="birthTime" type="time" value={formData.birthTime} onChange={handleChange} />
                <Input label="Birth Place" name="birthPlace" value={formData.birthPlace} onChange={handleChange} />
                <Input label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
                <Input label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
                <Input label="Blood Group" name="bloodGroup" type="select" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                </Input>
                <Input label="City" name="city" value={formData.city} onChange={handleChange} />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} />
                <Input label="Country" name="country" value={formData.country} onChange={handleChange} />
              </div>
              <Input label="About Me" name="aboutMe" type="textarea" value={formData.aboutMe} onChange={handleChange} rows="4" />
              <Button onClick={handleSave} loading={saving} style={{ marginTop: '1rem' }}>
                Save Personal Details
              </Button>
            </>
          )}

          {activeTab === 'education' && (
            <>
              <div className="edit-grid">
                <Input label="Highest Qualification" name="highestQualification" type="select" value={formData.highestQualification} onChange={handleChange}>
                  <option value="HIGH_SCHOOL">High School</option>
                  <option value="DIPLOMA">Diploma</option>
                  <option value="BACHELORS">Bachelor's</option>
                  <option value="MASTERS">Master's</option>
                  <option value="DOCTORATE">PhD / Doctorate</option>
                </Input>
                <Input label="College / University" name="college" value={formData.college} onChange={handleChange} />
                <Input label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
                <Input label="Company" name="companyName" value={formData.companyName} onChange={handleChange} />
                <Input label="Annual Income" name="annualIncome" type="select" value={formData.annualIncome} onChange={handleChange}>
                  <option value="BELOW_3_LAKH">Below ₹3L</option>
                  <option value="3_5_LAKH">₹3L - 5L</option>
                  <option value="5_10_LAKH">₹5L - 10L</option>
                  <option value="10_20_LAKH">₹10L - 20L</option>
                  <option value="ABOVE_20_LAKH">Above ₹20L</option>
                </Input>
                <Input label="Work Location" name="workLocation" value={formData.workLocation} onChange={handleChange} />
              </div>
              <Button onClick={handleSave} loading={saving} style={{ marginTop: '1rem' }}>
                Save Education Details
              </Button>
            </>
          )}

          {activeTab === 'family' && (
            <>
              <div className="edit-grid">
                <Input label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                <Input label="Father's Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
                <Input label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} />
                <Input label="Mother's Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
                <Input label="Brothers" name="brothers" type="number" value={formData.brothers} onChange={handleChange} />
                <Input label="Sisters" name="sisters" type="number" value={formData.sisters} onChange={handleChange} />
                <Input label="Family Type" name="familyType" type="select" value={formData.familyType} onChange={handleChange}>
                  <option value="NUCLEAR">Nuclear</option>
                  <option value="JOINT">Joint</option>
                </Input>
                <Input label="Family Status" name="familyStatus" type="select" value={formData.familyStatus} onChange={handleChange}>
                  <option value="MIDDLE_CLASS">Middle Class</option>
                  <option value="UPPER_MIDDLE_CLASS">Upper Middle Class</option>
                  <option value="RICH">Rich</option>
                </Input>
                <Input label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
                <Input label="Caste" name="caste" value={formData.caste} onChange={handleChange} />
                <Input label="Gotra" name="gotra" value={formData.gotra} onChange={handleChange} />
                <Input label="Manglik Status" name="manglikStatus" type="select" value={formData.manglikStatus} onChange={handleChange}>
                  <option value="NO">No</option>
                  <option value="YES">Yes</option>
                  <option value="DONT_KNOW">Don't Know</option>
                </Input>
                <Input label="Mother Tongue" name="motherTongue" value={formData.motherTongue} onChange={handleChange} />
              </div>
              <Button onClick={handleSave} loading={saving} style={{ marginTop: '1rem' }}>
                Save Family Details
              </Button>
            </>
          )}

          {activeTab === 'lifestyle' && (
            <>
              <div className="edit-grid">
                <Input label="Diet" name="diet" type="select" value={formData.diet} onChange={handleChange}>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                  <option value="EGGETARIAN">Eggetarian</option>
                  <option value="VEGAN">Vegan</option>
                </Input>
                <Input label="Smoking" name="smoking" type="select" value={formData.smoking} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Occasionally">Occasionally</option>
                </Input>
                <Input label="Drinking" name="drinking" type="select" value={formData.drinking} onChange={handleChange}>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Occasionally">Occasionally</option>
                </Input>
              </div>
              <Input label="Hobbies" name="hobbies" type="textarea" value={formData.hobbies} onChange={handleChange} rows="3" />
              <Button onClick={handleSave} loading={saving} style={{ marginTop: '1rem' }}>
                Save Lifestyle Details
              </Button>
            </>
          )}

          {activeTab === 'partner' && (
            <>
              <div className="edit-grid">
                <Input label="Min Age" name="ageMin" type="number" value={formData.ageMin} onChange={handleChange} />
                <Input label="Max Age" name="ageMax" type="number" value={formData.ageMax} onChange={handleChange} />
                <Input label="Min Height (cm)" name="heightMin" type="number" value={formData.heightMin} onChange={handleChange} />
                <Input label="Max Height (cm)" name="heightMax" type="number" value={formData.heightMax} onChange={handleChange} />
                <Input label="Preferred Education" name="partnerEducation" value={formData.partnerEducation} onChange={handleChange} />
                <Input label="Preferred Occupation" name="partnerOccupation" value={formData.partnerOccupation} onChange={handleChange} />
                <Input label="Preferred Location" name="partnerLocation" value={formData.partnerLocation} onChange={handleChange} />
              </div>
              <Button onClick={handleSave} loading={saving} style={{ marginTop: '1rem' }}>
                Save Partner Preferences
              </Button>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
