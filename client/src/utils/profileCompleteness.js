/**
 * Calculates profile completeness score (0 - 100%) and identifies missing sections.
 * 
 * @param {Object} profile - User's profile object
 * @returns {{ percent: number, missing: string[] }}
 */
export function getProfileCompletenessDetails(profile) {
  if (!profile) {
    return { percent: 0, missing: ['Create Profile'] };
  }

  const criteria = [
    {
      label: 'Profile Photo',
      weight: 15,
      met: Boolean(profile.profilePhoto),
    },
    {
      label: 'Basic Details (Name, Gender, DOB)',
      weight: 15,
      met: Boolean(profile.fullName && profile.gender && profile.dateOfBirth),
    },
    {
      label: 'Marital Status',
      weight: 5,
      met: Boolean(profile.maritalStatus),
    },
    {
      label: 'Location (City, State)',
      weight: 10,
      met: Boolean(profile.city && profile.state),
    },
    {
      label: 'Height & Physical Details',
      weight: 5,
      met: Boolean(profile.height),
    },
    {
      label: 'About Me / Bio',
      weight: 10,
      met: Boolean(profile.aboutMe && profile.aboutMe.trim().length > 5),
    },
    {
      label: 'Education & Career',
      weight: 15,
      met: Boolean(
        profile.highestQualification &&
        (profile.occupation || profile.companyName || profile.annualIncome)
      ),
    },
    {
      label: 'Family Details',
      weight: 10,
      met: Boolean(
        profile.familyType &&
        (profile.fatherName || profile.motherName || profile.familyStatus)
      ),
    },
    {
      label: 'Religion & Mother Tongue',
      weight: 5,
      met: Boolean(profile.religion && profile.motherTongue),
    },
    {
      label: 'Partner Preferences',
      weight: 10,
      met: Boolean(
        profile.partnerPreference &&
        (profile.partnerPreference.ageMin ||
          profile.partnerPreference.education ||
          profile.partnerPreference.occupation)
      ),
    },
  ];

  const score = criteria.reduce((sum, item) => sum + (item.met ? item.weight : 0), 0);
  const missing = criteria.filter((item) => !item.met).map((item) => item.label);

  return {
    percent: Math.min(100, Math.round(score)),
    missing,
  };
}
